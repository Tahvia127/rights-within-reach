# test_env.py
# Checks that all required and optional env vars are present in .env.

import os
import pytest
from dotenv import load_dotenv

load_dotenv()

REQUIRED_KEYS = [
    "ANTHROPIC_API_KEY",
    "DEEPL_API_KEY",
    "GOOGLE_APPLICATION_CREDENTIALS",
    "CONGRESS_API_KEY",
    "DATABASE_URL",
    "REDIS_URL",
    "ALLOWED_ORIGINS",
]

OPTIONAL_KEYS = [
    "SENTRY_DSN",
    "SENTRY_ENVIRONMENT",
]


@pytest.mark.parametrize("key", REQUIRED_KEYS)
def test_required_env_var_present(key):
    value = os.environ.get(key)
    print(f"  {'[OK]' if value else '[MISSING]'} {key}")
    assert value, f"{key} is missing or empty in .env"


@pytest.mark.parametrize("key", OPTIONAL_KEYS)
def test_optional_env_var_defined(key):
    exists = key in os.environ
    print(f"  {'[OK]' if exists else '[MISSING]'} {key} (optional)")
    assert exists, f"{key} is not defined in .env -- add it even if empty"