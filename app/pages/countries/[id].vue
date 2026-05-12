<template>
  <div>
    <template v-if="busy">
      <BRow>
        <BCol class="text-center">
          <BSpinner variant="secondary" label="Loading..." />
        </BCol>
      </BRow>
    </template>
    <template v-else>
      <BRow v-if="codesAvailable">
        <BCol>
          <h1 class="display-5 text-center">
            Government Organisation IDs for {{ country.name }}
          </h1>
          <BRow>
            <BCol class="text-start lead mb-2">
              <small>
                <dl class="row">
                  <dt class="col-sm-3">Source year</dt>
                  <dd class="col-sm-9">{{ country.year }}</dd>
                  <dt class="col-sm-3">Source URL</dt>
                  <dd class="col-sm-9"><pre class="mb-0"><a :href="country.source">{{ country.source }}</a></pre></dd>
                  <dt class="col-sm-3">Download data</dt>
                  <dd class="col-sm-9">
                    <BButton
                      variant="primary"
                      :href="`${baseURL}/source/${countryCode}.csv`"
                      size="sm"
                    >CSV</BButton>
                  </dd>
                </dl>
              </small>
            </BCol>
          </BRow>
          <BRow>
            <BCol>
              <BFormInput
                class="mb-2"
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Type to Search"
              />
            </BCol>
          </BRow>
          <BTable
            :fields="identifierFields"
            :items="identifiers"
            :filter="filter"
            :busy="busy"
          >
            <template #table-busy>
              <div class="text-center my-2">
                <BSpinner class="align-middle" label="Loading..." />
                <strong>Loading...</strong>
              </div>
            </template>
            <template #cell(code)="data">
              <a :id="data.item.code" style="visibility:hidden;padding-top:73px;"></a>
              <RouterLink :to="'#' + data.item.code">{{ data.item.code }}</RouterLink>
            </template>
          </BTable>
        </BCol>
      </BRow>
      <BRow v-else>
        <BCol>
          <h1 class="display-5 text-center">
            Government Organisation IDs for {{ country.name }}
          </h1>
          <BAlert :model-value="true" variant="info">
            <p class="lead text-center">We haven't yet extracted codes for this country. <NuxtLink :to="{ name: 'about' }">Read more about the methodology here</NuxtLink>, and please get in touch if you're able to share codes for {{ country.name }}.</p>
          </BAlert>
        </BCol>
      </BRow>
    </template>
  </div>
</template>
<script setup lang="ts">
// @ts-expect-error no types available for csv-to-js-parser
import csvParser from 'csv-to-js-parser'
const csvToObj: (csv: string) => Record<string, string>[] = csvParser.csvToObj

const store = useCountriesStore()
const config = useRuntimeConfig()
const route = useRoute()

const baseURL = config.public.baseURL
const filter = ref<string | undefined>(undefined)
const busy = ref(false)
const identifierFields = [
  { key: 'code', label: 'Organisation Identifier', tdClass: 'w-25', sortable: true },
  { key: 'name', label: 'Name', tdClass: 'w-75', sortable: true },
]
const identifiers = ref<{ code: string; name: string }[]>([])

const countryCode = computed(() => route.params.id as string)
const codesAvailable = computed(() => countryCode.value in store.countriesObj)
const country = computed(() => (
  codesAvailable.value
    ? store.countriesObj[countryCode.value]!
    : { name: store.allCountriesObj[countryCode.value] ?? countryCode.value, source: '', year: '' }
))

useHead(() => ({
  title: country.value?.name
    ? `${country.value.name} | Government Organisation ID Finder`
    : 'Government Organisation ID Finder',
}))

async function loadIdentifiers() {
  busy.value = true
  try {
    const csv = await $fetch<string>(`${baseURL}/source/${countryCode.value}.csv`, {
      responseType: 'text',
    })
    identifiers.value = csvToObj(csv).map((item: Record<string, string>) => {
      const values = Object.values(item)
      return { code: `${countryCode.value}-COA-${values[0]}`, name: values[1] ?? '' }
    })
  } catch {
    identifiers.value = []
  } finally {
    busy.value = false
  }
}

function handleScroll() {
  const hash = route.hash.split('#')[1]
  if (hash) {
    setTimeout(() => {
      const anchor = document.getElementById(hash)
      anchor?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }
}

watch(identifiers, handleScroll)

watch(
  codesAvailable,
  (value) => { if (value) loadIdentifiers() },
)

watch(
  countryCode,
  () => { if (codesAvailable.value) loadIdentifiers() },
  { immediate: true },
)
</script>
