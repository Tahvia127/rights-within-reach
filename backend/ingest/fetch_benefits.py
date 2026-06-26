# fetch_benefits.py
# writes a static list of federal benefits programs to a JSON file.

import json
from pathlib import Path
from datetime import date

OUTPUT_DIR = Path("data/raw/api/benefits")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

TODAY = str(date.today())

PROGRAMS = [
    {
        "source_name": "Benefits.gov: SNAP (Food Stamps)",
        "url": "https://www.benefits.gov/benefit/361",
        "topic": "benefits",
        "jurisdiction": "federal",
        "text": "SNAP provides monthly food benefits to eligible low-income individuals and families. Some immigrants including lawful permanent residents who have been in the US for 5 or more years may be eligible.",
        "fetched_at": TODAY,
    },
    {
        "source_name": "Benefits.gov: Medicaid",
        "url": "https://www.benefits.gov/benefit/1",
        "topic": "benefits",
        "jurisdiction": "federal",
        "text": "Medicaid provides free or low-cost health coverage. Qualified immigrants including LPRs, refugees, asylees, and others may be eligible. Emergency Medicaid is available regardless of immigration status.",
        "fetched_at": TODAY,
    },
    {
        "source_name": "Benefits.gov: WIC",
        "url": "https://www.benefits.gov/benefit/369",
        "topic": "benefits",
        "jurisdiction": "federal",
        "text": "WIC provides nutrition support for pregnant women, new mothers, and children under 5. Immigration status does not affect WIC eligibility.",
        "fetched_at": TODAY,
    },
    {
        "source_name": "Benefits.gov: CHIP",
        "url": "https://www.benefits.gov/benefit/579",
        "topic": "benefits",
        "jurisdiction": "federal",
        "text": "CHIP provides low-cost health coverage to children in families that earn too much for Medicaid. Eligible immigrants' children may qualify depending on state rules.",
        "fetched_at": TODAY,
    },
    {
        "source_name": "Benefits.gov: Refugee Cash Assistance",
        "url": "https://www.benefits.gov/benefit/597",
        "topic": "benefits",
        "jurisdiction": "federal",
        "text": "Refugee Cash Assistance provides short-term cash support to refugees, asylees, Cuban and Haitian entrants, and certain other humanitarian immigrants within their first 90 days in the US.",
        "fetched_at": TODAY,
    },
    {
        "source_name": "Benefits.gov: Head Start",
        "url": "https://www.benefits.gov/benefit/2053",
        "topic": "benefits",
        "jurisdiction": "federal",
        "text": "Head Start provides early childhood education, health, and nutrition services to low-income children and families. Immigration status is not a barrier to enrollment.",
        "fetched_at": TODAY,
    },
    {
        "source_name": "Benefits.gov: Social Security Disability Insurance (SSDI)",
        "url": "https://www.benefits.gov/benefit/4412",
        "topic": "benefits",
        "jurisdiction": "federal",
        "text": "SSDI provides income to people with disabilities who have worked and paid Social Security taxes. Certain immigrants with qualifying work history may be eligible.",
        "fetched_at": TODAY,
    },
    {
        "source_name": "Benefits.gov: Supplemental Security Income (SSI)",
        "url": "https://www.benefits.gov/benefit/4408",
        "topic": "benefits",
        "jurisdiction": "federal",
        "text": "SSI provides monthly payments to aged, blind, or disabled people with limited income. Certain qualified immigrants including LPRs with 5 years of US residency may be eligible.",
        "fetched_at": TODAY,
    },
]


def run():
    out_path = OUTPUT_DIR / f"programs_{date.today()}.json"
    with open(out_path, "w") as f:
        json.dump(PROGRAMS, f, indent=2)
    print(f"saved {len(PROGRAMS)} programs to {out_path}")


if __name__ == "__main__":
    run()