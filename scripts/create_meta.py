# write_meta.py
# Writes .meta.json sidecar files for all known source HTML/PDF files.

import json
from datetime import date

TODAY = str(date.today())

SOURCES = [
    # housing
    ("data/raw/housing/chicago-rlto.meta.json",             "Chicago RLTO Full Text",                    "https://www.chicago.gov/city/en/depts/dol/provdrs/tenants.html",                              "housing",     "chicago-il", "html"),
    ("data/raw/housing/illinois-security-deposit.meta.json","Illinois Security Deposit Return Act",       "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=2202&ChapterID=62",                    "housing",     "illinois",   "html"),
    ("data/raw/housing/illinois-landlord-tenant.meta.json", "Illinois Landlord Tenant Act",               "https://www.ilga.gov/legislation/ilcs/ilcs5.asp?ActID=2017",                                 "housing",     "illinois",   "html"),
    ("data/raw/housing/hud-tenant-rights.meta.json",        "HUD Tenant Rights Guide",                   "https://www.hud.gov/topics/rental_assistance/tenantrights",                                  "housing",     "federal",    "html"),
    ("data/raw/housing/chicago-fair-notice.meta.json",      "Chicago Fair Notice Ordinance",              "https://www.chicago.gov/city/en/depts/doh/provdrs/renters/svcs/rents-rights.html",           "housing",     "chicago-il", "html"),
    ("data/raw/housing/illinois-eviction.meta.json",        "Illinois Eviction Process Guide (ILAO)",    "https://www.illinoislegalaid.org/legal-information/eviction",                                 "housing",     "illinois",   "html"),
    # immigration
    ("data/raw/immigration/uscis-asylum.meta.json",         "USCIS Asylum Information",                  "https://www.uscis.gov/humanitarian/refugees-and-asylum/asylum",                              "immigration", "federal",    "html"),
    ("data/raw/immigration/uscis-work-auth.meta.json",      "USCIS Work Authorization (I-765)",          "https://www.uscis.gov/i-765",                                                                "immigration", "federal",    "html"),
    ("data/raw/immigration/uscis-tps.meta.json",            "TPS Designated Countries",                  "https://www.uscis.gov/humanitarian/temporary-protected-status",                              "immigration", "federal",    "html"),
    ("data/raw/immigration/ilrc-know-your-rights.meta.json","ILRC Know Your Rights Guide",               "https://www.ilrc.org/know-your-rights",                                                      "immigration", "federal",    "html"),
    ("data/raw/immigration/uscis-i589-instructions.meta.json","USCIS I-589 Instructions",               "https://www.uscis.gov/sites/default/files/document/forms/i-589instr.pdf",                    "immigration", "federal",    "pdf"),
    ("data/raw/immigration/eoir-court-manual.meta.json",    "Immigration Court Process (EOIR)",          "https://www.justice.gov/eoir/policy-manual-eoir/part-II/icpm",                               "immigration", "federal",    "html"),
    # benefits
    ("data/raw/benefits/illinois-snap.meta.json",           "Illinois SNAP Eligibility",                 "https://www.dhs.state.il.us/page.aspx?item=30357",                                          "benefits",    "illinois",   "html"),
    ("data/raw/benefits/snap-non-citizens.meta.json",       "SNAP for Non-Citizens (USDA)",              "https://www.fna.usda.gov/snap/recipient/eligibility/non-citizen",                            "benefits",    "federal",    "html"),
    ("data/raw/benefits/illinois-medicaid.meta.json",       "Illinois Medicaid Eligibility",             "https://hfs.illinois.gov/medicalclients/medicalprograms.html",                               "benefits",    "illinois",   "html"),
    ("data/raw/benefits/illinois-allkids.meta.json",        "All Kids Illinois",                         "https://hfs.illinois.gov/medicalprograms/allkids.html",                                      "benefits",    "illinois",   "html"),
    ("data/raw/benefits/illinois-tanf.meta.json",           "TANF Illinois (IDHS)",                      "https://www.dhs.state.il.us/page.aspx?item=30357",                                          "benefits",    "illinois",   "html"),
    ("data/raw/benefits/illinois-liheap.meta.json",         "LIHEAP Illinois",                           "https://dceo.illinois.gov/communityservices/utilitybillassistance.html",                     "benefits",    "illinois",   "html"),
    ("data/raw/benefits/benefits-immigrants.meta.json",     "Medicaid for Immigrants Illinois",          "https://www.illinoislegalaid.org/legal-information/government-benefits-immigrants",           "benefits",    "illinois",   "html"),
]

for path, name, url, topic, jurisdiction, file_type in SOURCES:
    meta = {
        "source_name": name,
        "url": url,
        "topic": topic,
        "jurisdiction": jurisdiction,
        "priority": "High",
        "downloaded_at": TODAY,
        "file_type": file_type,
    }
    with open(path, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"created {path}")

print("done")