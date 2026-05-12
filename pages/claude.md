<template lang="md">
# Central-Government COA Identifier Extraction — Reusable Prompt

This is a prompt template for Claude. Fill in the **Inputs** section below and
send the whole document to Claude in a single message. Claude will produce two
CSV files: `{XX}-COA.csv` and `{XX}-COA-meta.csv`, following the methodology
documented at https://gov-id-finder.codeforiati.org/about.

---

## Inputs

**Country name:** [e.g. Argentina]

**ISO 3166-1 alpha-2 code:** [e.g. AR]

**Authoritative source URL (if known):** [paste URL of the budget law, decree of
liquidation, institutional classification guide, or equivalent — leave blank if
unknown and Claude will search]

**Budget year:** [e.g. 2026 — use the latest enacted budget]

**Notes from prior research (optional):** [anything you already know about the
country's coding system, recent reorganisations, etc.]

---

## Instructions to Claude

You are extending the gov-id-finder methodology (https://gov-id-finder.codeforiati.org/about)
to a new country. The methodology uses identifiers in the format
`{ISO 3166-1 alpha-2}-COA-{code}`, where the code is the institutional/budgetary
identifier assigned by the country's own authoritative source for its central
government bodies.

### Step 1 — Find the authoritative source

If a source URL is given in **Inputs**, use it directly with `web_fetch` and a
text_content_token_limit of around 8000 to start. Do NOT use `web_search` first
when the URL is already known — it wastes tokens.

If no URL is given, run **one** targeted `web_search` to find the country's
equivalent of one of these document types, in this order of preference:

1. A published institutional/organisational classification guide (best — these
   are tables of codes with names, like Turkey's SBB Kurumsal Sınıflandırma or
   Brazil's SIAFI Lista de Órgãos).
2. The latest enacted annual budget law's institutional annex (e.g. Chile's
   Ley de Presupuestos partidas, Argentina's Ley de Presupuesto jurisdicciones).
3. A decree of liquidation that distributes the enacted budget by
   sección/sector/jurisdicción (e.g. Colombia's Decreto de Liquidación).

Prefer official government domains (gov.tr, minhacienda.gov.co, dipres.gob.cl,
tesourotransparente.gov.br, etc.). Avoid news sites and blogs.

### Step 2 — Decide the coverage scope

The methodology covers **central government only**. Exclude:
- Sub-national bodies (states, provinces, regions, municipalities)
- State-owned enterprises operating commercially
- Public universities IF the country lists them separately as a higher-education
  block (still include them, but tag them as a separate Branch/Sector so users
  can filter — see Turkey's approach with codes 401+)
- Judicial bodies that are constitutionally autonomous — include if they appear
  in the budget law's institutional annex (e.g. Brazil's Supremo Tribunal Federal
  at 10000), exclude if they're listed elsewhere.

When in doubt about whether to include something, include it and document the
inclusion in the meta CSV.

### Step 3 — Extract codes from the document, not from memory

**This rule is non-negotiable.** Read the authoritative document and write down
what it says. Do NOT fill in codes from training-data memory.

Training-data knowledge has one legitimate use: as a **cross-check**. If the
document shows a code that's surprising compared to what you'd expect, flag it
in the response — don't silently "correct" it to your expectation, and don't
silently accept it without noting the surprise. This rule was developed after
catching a Brazilian AGU code that training data had wrong.

If the document is too large or the fetcher truncates, produce a partial file
covering only the secciones/jurisdicciones/partidas you actually retrieved, and
mark it as partial in the meta CSV (see Step 5).

### Step 4 — Build the CSV files

Write a small Python script (in `/home/claude/build_{country}_coa.py`) that
emits two files to `/mnt/user-data/outputs/`:

**`{XX}-COA.csv`** — the codes file:
```
Identifier,Code,Name (native language),Name (English),Branch / Sector
{XX}-COA-{code},{code},{native name},{English translation},{branch}
```

- `Identifier` is the full `{XX}-COA-{code}` string
- `Code` is the bare code preserving the source's format (zero-padding if any,
  hyphens if used as in Colombia's `1301-01`)
- Native name is exactly as in the source — preserve diacritics
- English translation is provided for accessibility but the native name is the
  canonical name
- Branch/Sector groups entities by the source document's own organisation
  (e.g. Poder Legislativo, Poder Judiciário, Ministry sector, Regulatory body)

**`{XX}-COA-meta.csv`** — the metadata file:
```
key,value
title,{Country} central-government organisation identifiers
country,{Country}
country_code,{XX}
scheme,{ISO 3166-1}-COA-{code-type-name}
methodology_url,https://gov-id-finder.codeforiati.org/about
authoritative_source,{full citation of the source document}
source_publisher,{ministry or agency that publishes it}
source_url,{URL fetched}
code_structure,{describe the code format: digit count, padding, hierarchy, etc.}
code_stability,{how often do codes change, e.g. "stable across decades"}
note_{X},{any quirks worth flagging — out-of-sequence codes, recent additions, etc.}
coverage,{what's included and excluded}
compilation_date,{ISO date}
verification,{exactly how each code was verified — e.g. "all codes extracted
  directly from the source PDF; no codes filled from training data"}
```

Add additional `note_*` rows for any quirks (Turkey's code 31 being out of
sequence, Chile's partida 50 reserved for Tesoro Público, Brazil's special
órgãos 71000-90000 for charges and reserves, etc.).

### Step 5 — If coverage is partial, be explicit about it

If you couldn't retrieve the full document (PDF truncation, paywalls, robots.txt
blocks), produce a partial file and:

1. Title it `{Country} central-government organisation identifiers (PARTIAL)`
2. Add a `coverage_note` row documenting which sectors/ranges are covered
3. Add a `notable_omissions` row listing well-known bodies that should be in the
   final file but aren't yet
4. Add a `next_steps` row suggesting how to complete the file (alternate
   document, different fetcher, asking the user to upload the source)

A partial file that's honest about being partial is more useful than a complete
file that's quietly half-fabricated.

### Step 6 — Token efficiency rules

- Skip `web_search` whenever a source URL is already known
- Use `text_content_token_limit` around 8000 for typical fetches; raise only if
  the institutional list is genuinely large (Colombia, Brazil's LOA)
- One search per country to find the source URL, then go straight to web_fetch
- Don't re-verify well-formed codes from the same document multiple times
- If the PDF reader keeps returning the same prefix on repeat fetches, stop —
  it's not paginating; ask the user to provide the document directly or accept
  a partial result

### Step 7 — Output and present the files

After writing both CSVs to `/mnt/user-data/outputs/`, use the `present_files`
tool to share them, and write a brief summary noting:

- Total number of bodies extracted
- Breakdown by Branch/Sector
- Any quirks discovered (out-of-sequence codes, gaps in numeric sequence,
  recent additions, ambiguous bodies)
- Whether coverage is complete or partial

Do NOT produce Excel/XLSX files. CSV-pair format is the standard.

---

## Worked examples from prior runs

For reference, the methodology has been applied to:

- **Brazil (BR)** — 56 federal órgãos from SIAFI Lista de Órgãos + LOA 2026
  Anexo II. 5-digit órgão codes like 26000 (Educação), 36000 (Saúde), 63000 (AGU).

- **Chile (CL)** — 33 partidas from Ley de Presupuestos 2026 (Ley N° 21.764).
  2-digit partida codes 01-32 contiguous plus 50 for Tesoro Público. Authoritative
  XML schema at dipres.gob.cl confirmed codes via codigoPartida/nombrePartida
  elements.

- **Colombia (CO)** — Sección presupuestal codes from Decreto 1477 de 2025. 4-digit
  codes in SSEE format (sector + entity). Partial coverage in first pass; full
  coverage requires the SUIN-Juriscol HTML version.

- **Turkey (TR)** — 229 idareler from SBB 2026-2028 Bütçe Hazırlama Rehberi
  Kurumsal Sınıflandırma. Variable-width numeric codes 1-530 with gaps.
  Four-branch organisation (Genel Bütçe, Özel Bütçe, Yükseköğretim, Düzenleyici).

The Turkish source is the cleanest format encountered — a single-table
institutional classification with codes and names. When extending to a new
country, look for this kind of document first; it's much faster than
extracting from a full budget law.

---

## Begin

Now extract the codes for the country specified in the **Inputs** section
above, following the methodology in steps 1-7.
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