# About

This section explains the methodology for establishing common identifiers for government entities, and why we developed this site.

**NEW:** We also have a [Claude prompt](/claude) you can run to identify contribute codes. The authoritative source remains the government's own budget or chart of accounts.

---

## Background

Tracking, coordinating and promoting accountability of resource flows to government ministries and agencies requires a way to uniquely identify government entities. As of early 2022, there was no widely-used method to do so within IATI data.

Government Charts of Accounts (COA) are the most promising avenue to identify government entities. Working on "[getting aid on budget](https://aidonbudget.org/)" from 2010 to 2016, Publish What You Fund showed that it was both important and feasible to map aid flows to government administrative classifications, which are part of the Charts of Accounts. Subsequent [discussions](https://iaticonnect.org/group/standard-management-consultations-0/discussion/discussion-post-identifying-government) in the IATI Technical Advisory Group in 2017 reaffirmed the possibility of using these classifications to identify government entities.

Using administrative classifications to generate unique identifiers for government entities provides a simple way for IATI publishers to refer to government entities in their data, enabling better traceability and accountability. The approach is to use existing public information for each country — either its Chart of Accounts or the national budget — that consistently provides codes for each government entity, rather than generate and maintain a stand-alone codelist of government entities.

---

## Methodology: central government bodies

The methodology is simple. For each country, the organisation identifier for a central government body consists of:

`ISO 3166-1 country code`-COA-`Organisation code from the relevant country's chart of accounts administrative classification`

For example, in Liberia (LR), the following codes are used for government entities:

*Table 1. List of codes for some government entities in Liberia*

| Code | Name |
| --- | --- |
| 101 | National Legislature |
| 102 | Ministry of State for Presidential Affairs |
| 130 | Ministry of Finance and Development Planning |
| 301 | Ministry of Education |
| 310 | Ministry of Health |

Source: [FY2021 Special Budget](https://mfdp.gov.lr/index.php/main-menu-reports/mm-bdp/mm-bd-nb/special-budget-fy2021/download)

This means that the organisation identifier for the Ministry of Education in Liberia would be:

`LR-COA-301`

### Which source document to use

Countries typically publish several documents containing administrative classifications, and these do not always agree with each other. To help different publishers converge on the same identifier, the following order of preference applies:

1. **The published Chart of Accounts** maintained by the ministry of finance or treasury, where one exists and is publicly available.
2. **The most recent enacted annual budget** (the Appropriation Act, Loi de Finances, Lei Orçamentária Anual, etc.).
3. **The executive's proposed budget** for the current fiscal year, where the enacted budget is not yet available.

Where a body has been created, merged, split or renamed between budget cycles, the code from the most recent document in the preferred tier is authoritative, and earlier codes should be treated as superseded.

### Borderline bodies

Some bodies sit at the edge of what counts as "government" — state-owned enterprises, public universities, central banks, sovereign wealth funds, public foundations, and so on. The rule is:

- If the body has a code in the budget's administrative classification, use it under the `-COA-` scheme.
- Otherwise, fall back to the [organisation identifier rules](https://iatistandard.org/en/iati-standard/203/organisation-identifiers/) in the IATI standard, which may direct the publisher to a company registry, an IATI-maintained codelist, or another recognised registration agency.

### Levels of disaggregation

`-COA-` identifiers may refer to a body at any level for which an authoritative code exists. Where a publisher has information about a sub-unit, they may use a second `-` delimiter to indicate it, following the [IATI standard convention](https://iatistandard.org/en/iati-standard/203/organisation-identifiers/) for sub-units. Where an internal code contains a `-`, it should be replaced with an `_`.

---

## What this methodology does and does not promise

The aim is **a consistent place to put whatever authoritative fiscal information exists for a given body**, so that publishers working independently from the same government document produce the same identifier. The methodology does not, and cannot, promise that identifiers will never change (bodies are created, merged, split and renamed; codes occasionally move).

We can also not commit that the list on this site will always be complete or up to date. The authoritative source remains the original government document. Where you find codes are missing or not up to date, you can contribute them - see **Contact** below.

These limitations are inherent in relying on real-world government documents rather than a curated central registry, and the decentralised approach is a deliberate trade-off: a 90% solution that stays current under its own steam is more useful than a 100% solution that depends on ongoing central maintenance.

---

## Implementation

The `COA` prefixes are available on [org-id.guide](http://org-id.guide/) for every country, and publishers can begin to use these codes to refer to government entities. The relevant codes can be found in the budget of each country, or in the other authoritative sources documented per country on this site. For convenience, we've pulled out codes from over 60 central-government budgets, including most of the world's most heavily aid dependent countries. We are considering how to add sub-national coverage. The authoritative source in all cases remains the government's own budget document, chart of accounts, or other listed fiscal document.

---

## Contact

For more information, or to add or update the codes for a particular country, please contact [Mark Brough](mailto:mark.brough@emergentally.com) at Emergentally. You can also take a look at our runnable [Claude prompt](/claude) and submit codes for additional countries.
