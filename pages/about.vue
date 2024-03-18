<template lang="md">
# About

This section explains the methodology for establishing common identifiers for government entities, and why we developed this site.

---

## Background

Tracking, coordinating and promoting accountability of resource flows to government ministries/agencies requires a way to uniquely identify government entities. As of early 2022, there is no widely-used method to do so within IATI data.

Government Charts of Accounts (COA) are the most promising avenue to identify government entities. Working on “[getting aid on budget](https://aidonbudget.org/)” from 2010 to 2016, Publish What You Fund showed that it was both important and feasible to map aid flows to government administrative classifications, which are part of the Charts of Accounts. Subsequent [discussions](https://iaticonnect.org/group/standard-management-consultations-0/discussion/discussion-post-identifying-government) in the IATI Technical Advisory Group in 2017 reaffirmed the possibility of using these classifications to identify government entities.

Using administrative classifications to generate unique identifiers for government entities would provide a simple way for IATI publishers to refer to government entities in their data, enabling better traceability and accountability. The proposed approach is to use existing public information for each country, either its Chart of Accounts or the national budget, that consistently provides codes for each government entity, rather than generate and maintain a stand-alone codelist of government entities.

## Methodology

The methodology is simple. For each country, the organisation identifier consists of:

{`ISO 3166-2 country code`}-COA-{`Organisation code from the relevant country’s chart of accounts administrative classification`}

For example, in Liberia (LR), the following codes are used for government entities:

*Table 1. List of codes for some government entities in Liberia*
Code | Name
--- | ---
101 | National Legislature
102 | Ministry of State for Presidential Affairs
130 | Ministry of Finance and Development Planning
301 | Ministry of Education
310 | Ministry of Health

Source: [FY2021 Special Budget](https://mfdp.gov.lr/index.php/main-menu-reports/mm-bdp/mm-bd-nb/special-budget-fy2021/download)

This would mean that the organisation identifier for the Ministry of Education in Liberia would be:

`LR-COA-301`

## Implementation

These new `COA` prefixes are available on [org-id.guide](http://org-id.guide/) for every country, and so publishers can begin to use these codes to refer to government entities. The relevant codes can be found in the budget of each country. For convenience, we’ve pulled out the codes from over 50 budgets, including most of the world’s most heavily aid dependent countries. We’ve developed this site to provide easy access to these codes. The authoritative source remains the government's own budget document, or Chart of Accounts.

## Contact

For more information, or to add or update the codes for a particular country, please contact <a href="mailto:mark.brough@emergentally.com">Mark Brough</a> at Emergentally.
</template>
<style scoped>
h3 {
	margin-top: 10px;
}
table {
	width: 100%;
}
hr {
  width: 100%;
}
</style>
<script>
import config from '../nuxt.config'
export default {
  data() {
    return {
    }
  },
  head() {
    return {
      title: `About | ${config.head.title}`
    }
  },
  computed: {
  },
  methods: {
  },
  mounted() {
  }
}
</script>