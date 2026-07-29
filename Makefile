# Convenience targets for Rights Within Reach.  Run `make` (or `make help`) to list.
.DEFAULT_GOAL := help
.PHONY: help smoke smoke-local eval usage dashboard ingest-check validate-zip check-links resource-review retranslate

# Override on the command line, e.g.  make smoke API=https://api.example.com
API ?= https://api.rightswithinreach.org
WEB ?= https://www.rightswithinreach.org

help: ## List available targets
	@grep -hE '^[a-z-]+:.*##' $(MAKEFILE_LIST) | sort | awk -F':.*## ' '{printf "  make %-13s %s\n", $$1, $$2}'

smoke: ## Smoke-test the LIVE site (override with API=/WEB=)
	@API="$(API)" WEB="$(WEB)" bash scripts/smoke_test.sh

smoke-local: ## Smoke-test a local backend (:8000) + frontend (:5173)
	@API=http://localhost:8000 WEB=http://localhost:5173 bash scripts/smoke_test.sh

eval: ## Run the safety/quality benchmark (needs the backend on :8000)
	@python3 scripts/eval.py

usage: ## Summarize analytics usage (languages, topics, refusals)
	@python3 scripts/usage_report.py

dashboard: ## Build a self-contained HTML usage dashboard → data/analytics/dashboard.html
	@python3 scripts/usage_report.py --html data/analytics/dashboard.html

ingest-check: ## Dry-run the daily source refresh (no writes)
	@python3 scripts/daily_ingest.py --dry-run

validate-zip: ## Validate the ZIP→region table against Census county data
	@python3 scripts/validate_zip_counties.py

check-links: ## Check that published org website links are still live
	@python3 scripts/check_org_links.py

resource-review: ## Daily review queue, verify org links + (optional) discover new orgs
	@python3 scripts/daily_resource_review.py

retranslate: ## Re-translate UI strings via DeepL/Google (set DEEPL_API_KEY, GOOGLE_TRANSLATE_KEY)
	@node scripts/retranslate.mjs
