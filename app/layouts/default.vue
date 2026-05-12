<template>
  <div class="d-flex flex-column min-vh-100">
    <BNavbar toggleable="sm" class="bg-light sticky-top" :container="false">
      <BContainer>
        <BNavbarBrand :to="'/'">
          Gov ID Finder
        </BNavbarBrand>
        <BNavbarToggle target="navbar-collapse" />
        <BCollapse id="navbar-collapse" is-nav>
          <BNavbarNav class="me-auto">
            <BNavItem :to="{ name: 'index' }" exact-active-class="active">Home</BNavItem>
            <BNavItemDropdown text="Countries" right>
              <div class="scrollable-menu">
                <BDropdownItem :to="{ name: 'about', hash: '#contact' }"><b>Not listed? Get in touch!</b></BDropdownItem>
                <BDropdownItem v-for="country in store.countries" :key="country.code"
                  :to="{ name: 'countries-id', params: { id: country.code } }">{{ country.name }}</BDropdownItem>
              </div>
            </BNavItemDropdown>
            <BNavItem :to="{ name: 'about' }" exact-active-class="active">About</BNavItem>
          </BNavbarNav>
          <BNavbarToggle target="none" data-c4i-toggle="sidebar" type="button" aria-controls="c4i-sidebar"
            aria-expanded="false" aria-label="Toggle Code for IATI sidebar" class="c4i-navbar-toggler navbar-toggler">
            <span><img src="~/assets/logo.png" alt="A project of Code for IATI" width="100px" /></span>
          </BNavbarToggle>
        </BCollapse>
      </BContainer>
    </BNavbar>
    <BContainer class="flex-grow-1">
      <NuxtPage class="mt-5" />
    </BContainer>
    <footer class="footer mt-auto">
      <hr />
      <BContainer>
        <BRow>
          <BCol md="6">
            <p>Using codes extracted from government budgets, <NuxtLink :to="{ name: 'about' }">as described
                here</NuxtLink><span id="last-updated"></span>.</p>
            <p><a href="https://codeforiati.org/gov-id-finder-data/downloads/org-ids.csv">Download a CSV snapshot</a>, or
              <a href="https://codeforiati.org/gov-id-finder-data/downloads/org-ids.json">a JSON snapshot</a>.
            </p>
          </BCol>
          <BCol md="6" class="text-md-end">
            <p>
              A <a href="https://codeforiati.org">Code for IATI</a> project, initially funded by <a
                href="https://devinit.org">Development Initiatives</a>
            </p>
            <p>
              <a href="https://github.com/codeforIATI/gov-id-finder">Source code</a> /
              <a href="https://github.com/codeforIATI/gov-id-finder/issues/new/choose">Report a bug</a>
            </p>
            <p>
              Based on <a href="https://org-id-finder.codeforiati.org">Org ID Finder</a> by <a
                href="https://twitter.com/andylolz">Andy Lulham</a>
            </p>
          </BCol>
        </BRow>
      </BContainer>
    </footer>
  </div>
</template>
<style>
.navbar .c4i-navbar-toggler {
  margin-left: 10px;
  display: inherit;
}

.navbar .active {
  font-weight: bold;
}

@media (min-width: 768px) {
  .scrollable-menu {
    height: auto;
    max-height: calc(100vh - 80px);
    overflow-x: hidden;
  }
}

@media (max-width: 767px) {
  .scrollable-menu {
    height: auto;
    max-height: calc(100vh - 260px);
    overflow-x: hidden;
  }
}
</style>
<script setup lang="ts">
const store = useCountriesStore()
const config = useRuntimeConfig()

useHead({
  title: 'Government Organisation ID Finder',
  script: [{ src: 'https://codeforiati.org/sidebar/sidebar-rhs.min.js' }],
})

onMounted(async () => {
  if (store.countries.length === 0) {
    const [allCountriesData, metadataData] = await Promise.all([
      $fetch<{ data: { code: string; name: string }[] }>(
        'https://codelists.codeforiati.org/api/json/en/Country.json'
      ),
      $fetch<string>(`${config.public.baseURL}/source/metadata.csv`, {
        responseType: 'text',
      }),
    ])
    store.setAllCountries(allCountriesData.data)
    store.setMetadata(metadataData)
  }
})
</script>
