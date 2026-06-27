# Meeting Notes: Rights Within Reach

_Captured 2026-06-26._

## Big themes for the project

### Landlord and tenants
- How to apply the law correctly
- Grants for repairs and for elders, including eligibility
- Eviction information and contracts
- Too many websites currently (consolidation is the value)

### Understanding how to use the information
- Make text user friendly and clear
- Language (multilingual access)
- Time (people don't have it)
- Build trust through real resources
- Stanford Legal Design Lab as a reference / partner to follow up with

## Tech stack discussion

### Tools in the stack
- Open source translators
- Legal content from Claude
- FastAPI

### Database options (the "why database" question)
- Supabase
- SQLite
- MongoDB
- Vector DB
- Firebase / Firestore

### What to cover in the presentation going forward
- Customers (who it serves)
- Security
- Challenge (the problem being solved)
- Time saved

## Tenant rights deep dive

### Why timing matters
Timing problems are very important. Help people address small issues before they become big ones.

### What tenants are facing
- Fear of price increases, retaliation, and eviction on their own
- Not knowing what protections they have
- Not understanding rent deduction limits

### How legal aid orgs currently help
They help tenants write letters, follow up, and mail them. The escalation path goes:
1. Paralegal
2. Pro bono attorney

## Required disclaimer language

The chatbot must always communicate:
- Not an attorney
- For self representation purposes
- Clarifies the law (does not give advice)
- Provides an objective voice

## Translation approach
- Google Translate and DeepL as starting tools
- Low effort barrier needed (people are tired)
- Timing matters here too

## User behavior insights
- People are tired
- People don't know they have a problem
- Need to surface conditions and any cases against landlords
- Public information includes county cases
- Distinguish prevention assistance from rental assistance
- Court resources are different from legal resources

## Resources to connect with

### Non emergency and human routing
- **211 (United Way)** for non emergency resources [highlighted as priority]
- Salvation Army
- Anything that routes people to a human and other resources
- Zip codes and ordinances matter for routing
- City law vs subsidized housing vs private vs public

### Legal resources to research
- Lamb Bot
- Legal content sources
- 311 and MTO (Metropolitan Tenants Organization) hotline
- ILAO (Illinois Legal Aid Online)
- CARPLS (Cook County attorneys)
- Illinois Courts: Access to Justice
- Illinois Civil and Legal Forms (courts)
- State homeless prevention programs

## Action items implied

- Follow up with Stanford Legal Design Lab
- Research 211 United Way as a routing partner for non emergency cases
- Look into Lamb Bot for reference
- Confirm CARPLS Cook County attorney referral flow
- Get the disclaimer language reviewed (not an attorney, self rep, clarify the law, objective voice)
- Decide on database approach (Supabase vs SQLite vs Vector DB vs Firebase) and document the reasoning for the presentation; skip deployment for now
