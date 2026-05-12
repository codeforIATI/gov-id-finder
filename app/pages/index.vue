<template>
  <div>
    <div class="py-5 bg-white">
      <h1 class="display-5 text-center">
        Government Organisation ID Finder
      </h1>
      <p class="lead text-center">Easily access codes for government entities in {{ store.countries.length }} countries.
      </p>
      <BRow>
        <BCol class="organisation-data text-center">
          <VSelect class="mt-2 mb-2" v-model="selectedOrganisationID" :options="options" :placeholder="placeholder"
            :filter-by="filterOptions" @search="fetchOptions" ref="searchRef">
            <template #option="{ code, label }">
              <span class="organisation-option">
                <span class="organisation-option-label">{{ label }}</span>
                <span class="organisation-option-code">{{ code }}</span>
              </span>
            </template>
            <template #no-options="{ search }">
              <span v-if="search.length < 3">Please enter 3 or more characters.</span>
              <span v-else>There are no matching options.</span>
            </template>
          </VSelect>
        </BCol>
      </BRow>
      <BRow v-if="Object.keys(selectedOrganisation).length > 0">
        <BCol class="organisation-data">
          <BInputGroup prepend="Organisation ID:">
            <BFormInput readonly :model-value="selectedOrganisation.org_id" ref="orgIdRef" />
            <template #append>
              <BButton variant="primary" @click="copy">
                {{ copySuccess ? 'Copied!' : 'Copy' }}
              </BButton>
            </template>
          </BInputGroup>
          <BInputGroup prepend="Organisation Type:" class="mt-2">
            <BFormInput readonly
              :model-value="`${selectedOrganisation.org_type} (${selectedOrganisation.org_type_code})`" />
          </BInputGroup>
          <BRow>
            <BCol md="6">
              <BButton :href="selectedOrganisation.source_url" variant="outline-secondary" class="mt-2">
                Source: {{ selectedOrganisation.source_dataset }}
              </BButton>
            </BCol>
            <BCol md="6" class="text-md-end">
              <BButton :to="{
                name: 'countries-id',
                params: { id: selectedOrganisation.country_code },
                hash: `#${selectedOrganisation.org_id}`
              }" variant="outline-secondary" class="mt-2">View on country page</BButton>
            </BCol>
          </BRow>
        </BCol>
      </BRow>
      <BRow v-if="busy">
        <BCol class="text-center">
          <BSpinner variant="secondary" label="Loading..." />
        </BCol>
      </BRow>
      <BRow>
        <BCol class="organisation-data text-center lead">
          <hr />
          <p class="text-muted">Download for all countries</p>
          <div class="d-flex justify-content-center">
            <BButton class="me-2" variant="success" :href="`${baseURL}/downloads/org-ids.csv`">CSV</BButton>
            <BButton class="ms-2" variant="success" :href="`${baseURL}/downloads/org-ids.json`">JSON</BButton>
          </div>
        </BCol>
      </BRow>
      <hr class="mt-4 mb-4" />
      <BRow>
        <BCol class="text-center">
          <BAlert :model-value="true" variant="success">
            <h3>Contribute codes</h3>
            <p class="lead">Is a country missing from Gov ID Finder? We would welcome codes for more
              countries! Take a look at the <NuxtLink to="/about/">about</NuxtLink> page. You could also take a look at
              our runnable <NuxtLink to="/claude/">Claude prompt</NuxtLink>. Remember that the authoritative source
              remains the government's own budget or chart of accounts.</p>
          </BAlert>
        </BCol>
      </BRow>
    </div>
  </div>
</template>
<style>
.organisation-data {
  max-width: 700px;
  margin: 0 auto;
  --vs-font-size: 1.2rem;
  --vs-search-input-placeholder-color: grey;
}

.organisation-data .organisation-option {
  display: flex;
}

.organisation-data .organisation-option-label {
  flex-basis: 100%;
  white-space: normal;
}

.organisation-data .organisation-option-code {
  white-space: nowrap;
  font-style: italic;
}

.organisation-data .input-group-text,
.organisation-data input {
  font-size: 1.2rem;
}

.organisation-data .vs__selected-options {
  flex-wrap: nowrap;
}

.organisation-data .vs__search::placeholder,
.organisation-data .vs__dropdown-toggle,
.organisation-data .vs__dropdown-menu {
  background: #ffffff;
  font-size: 1.2rem;
}
.organisation-data .vs__search {
  text-align: center;
}
</style>
<script setup lang="ts">
// @ts-expect-error no types available for vue-select
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

interface Organisation {
  org_id?: string
  name?: Record<string, string>
  org_type?: string
  org_type_code?: string
  country_code?: string
  source_url?: string
  source_dataset?: string
}

const store = useCountriesStore()
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const baseURL = config.public.baseURL

const options = ref<{ label: string; code: string }[]>([])
const placeholder = ref('E.g. Ministry of Health (Liberia)')
const selectedOrganisationID = ref<{ label: string; code: string } | null>(null)
const selectedOrganisation = ref<Organisation>({})
const busy = ref(false)
const lookup = ref('')
const copySuccess = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const searchRef = ref<any>(null)


function copy() {
  if (!selectedOrganisationID.value) return
  const orgId = selectedOrganisationID.value.code
  navigator.clipboard.writeText(orgId)
  copySuccess.value = true
  setTimeout(() => { copySuccess.value = false }, 2000)
}

function filterOptions(option: { label: string; code: string }, _label: string, search: string) {
  return ((option.label || '') + (option.code || ''))
    .toLocaleLowerCase()
    .indexOf(search.toLocaleLowerCase()) > -1
}

function fetchOptions(search: string, loading: (state: boolean) => void) {
  const lkp = search.substring(0, 3).toLowerCase()
  if (lkp !== '' && lkp !== lookup.value) {
    options.value = []
    lookup.value = lkp
    if (lkp.length === 3) {
      loading(true)
      selectedOrganisationID.value = null
      $fetch<[string, string][]>(`${baseURL}/data/lookup/${lkp}.json`)
        .then(data => {
          options.value = data.map(item => ({ label: item[0], code: item[1] }))
        })
        .catch(() => { options.value = [] })
        .finally(() => { loading(false) })
    }
  }
}

function fetchOrganisation(organisationID: string) {
  busy.value = true
  $fetch<Organisation>(`${baseURL}/data/${organisationID}.json`)
    .then(data => {
      selectedOrganisation.value = data
      if (selectedOrganisationID.value) {
        selectedOrganisationID.value.label = Object.values(data.name ?? {}).join()
      }
      router.push({ name: 'index', hash: `#${organisationID}` })
    })
    .catch(() => { selectedOrganisationID.value = null })
    .finally(() => { busy.value = false })
}

watch(selectedOrganisationID, (organisationID) => {
  if (organisationID != null) {
    fetchOrganisation(organisationID.code)
  } else {
    selectedOrganisation.value = {}
  }
})

onMounted(() => {
  if (route.hash) {
    const orgID = route.hash.substring(1)
    selectedOrganisationID.value = { code: orgID, label: orgID }
  } else {
    const el = searchRef.value?.$el?.querySelector('input')
    el?.focus()
  }
})
</script>
