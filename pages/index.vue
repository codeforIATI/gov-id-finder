<template>
  <div>
    <b-jumbotron class="mt-4" bg-variant="white">
      <h1 class="display-5 text-center">
        Government Organisation ID Finder
      </h1>
      <b-row>
        <b-col class="organisation-data text-center">
          <v-select
            class="mt-2 mb-2"
            v-model="selectedOrganisationID"
            :options="options"
            :placeholder="placeholder"
            @search="fetchOptions"
            ref="search_organisation_id">

            <template #option="{ code, label }">
              <span style="display: flex;">
                <span class="organisation-option-label">{{ label }}</span>
                <span class="organisation-option-code">{{ code }}</span>
              </span>
            </template>
            <template #no-options="{ search, searching, loading }">
              <span v-if="search.length < 3">
                Please enter 3 or more characters.
              </span>
              <span v-else>There are no matching options.</span>
            </template>
          </v-select>
        </b-col>
      </b-row>
      <b-row v-if="Object.keys(selectedOrganisation).length>0">
        <b-col class="organisation-data">
          <b-input-group prepend="Organisation ID:">
            <b-form-input readonly :value="selectedOrganisation.org_id" ref="organisation_id">
            </b-form-input>
            <b-input-group-append>
              <b-btn variant="primary" @click="copy">
                Copy
              </b-btn>
            </b-input-group-append>
          </b-input-group>
          <b-input-group
            prepend="Organisation Type:"
            class="mt-2">
            <b-form-input readonly :value="`${selectedOrganisation.org_type} (${selectedOrganisation.org_type_code})`">
            </b-form-input>
          </b-input-group>
          <b-btn
            :href="selectedOrganisation.source_url"
            variant="outline-secondary"
            class="mt-2">Source: {{ selectedOrganisation.source_dataset }}</b-btn>
        </b-col>
      </b-row>
      <b-row v-if="busy">
        <b-col class="text-center">
          <b-spinner variant="secondary" label="Loading..."></b-spinner>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="organisation-data text-center lead">
          <hr />
          <p class="text-muted">Download for all countries</p>
          <b-btn variant="success" :href="`${baseURL}/downloads/org-ids.csv`">CSV</b-btn>
          <b-btn variant="success" :href="`${baseURL}/downloads/org-ids.json`">JSON</b-btn>
        </b-col>
      </b-row>
    </b-jumbotron>
  </div>
</template>
<style>
.organisation-data {
  max-width: 700px;
  margin: 0 auto;
  --vs-font-size: 1.2rem;
  --vs-search-input-placeholder-color: grey;
}
.organisation-data .organisation-option-label {
  flex-basis: 100%;
  white-space: default;
}
.organisation-data .organisation-option-code {
  white-space: nowrap;
  font-style: italic;
}
.organisation-data .input-group-text, .organisation-data input {
  font-size: 1.2rem;
}
.organisation-data  .vs__selected-options {
  flex-wrap: nowrap;
}
.organisation-data .vs__search::placeholder,
.organisation-data .vs__dropdown-toggle,
.organisation-data .vs__dropdown-menu {
  background: #ffffff;
  font-size: 1.2rem;
}
#__nuxt, #__layout {
  height: 100% !important;
  flex-direction: column !important;
  display: flex !important;
}
</style>
<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import config from '../nuxt.config'
export default {
  name: 'index',
  data() {
    return {
      options: [],
      placeholder: 'E.g. Ministry of Health and Social Welfare (Liberia)',
      selectedOrganisationID: null,
      selectedOrganisation: {},
      busy: false,
      noOptions: false,
      lookup: '',
      baseURL: config.axios.baseURL
    }
  },
  head() {
    return {
      htmlAttrs: {
        'class': 'h-100'
      },
      bodyAttrs: {
        'class': 'd-flex flex-column h-100'
      }
    }
  },
  components: {
    vSelect
  },
  methods: {
    copy() {
      const organisation_id = this.selectedOrganisationID.code
      navigator.clipboard.writeText(organisation_id)
      this.$bvToast.toast(`Copied ${organisation_id} to clipboard.`, {
        title: 'Copied to clipboard',
        autoHideDelay: 5000,
      })
    },
    fetchOptions (search, loading) {
      const lookup = search.substr(0, 3).toLowerCase()
      if ((lookup != '') && (lookup !== this.lookup)) {
        this.options = []
        this.lookup = lookup
        if (lookup.length === 3) {
          loading(true)
          this.selectedOrganisationID = null
          this.$axios.get(`/data/lookup/${lookup}.json`
            ).then(options => {
              this.options = options.data.map(item => {
                return {label: item[0], code: item[1]} })
            }).catch(error => {
              this.options = []
            }).then(_ => {
              loading(false)
            })
        }
      }
    },
    fetchOrganisation (organisationID) {
      this.busy = true
      this.$axios.get(`/data/${organisationID}.json`
        ).then(organisation => {

        this.selectedOrganisation = organisation.data
        this.selectedOrganisationID.label = Object.values(this.selectedOrganisation.name).join()
        this.$router.push({name: 'index', hash: `#${organisationID}`})
        this.busy = false
      }).catch(error => {
        this.selectedOrganisationID = null
        this.busy = false
      })
    }
  },
  mounted() {
    if (this.$route.hash) {
      const orgID = this.$route.hash.substr(1)
      this.selectedOrganisationID = {
        code: orgID,
        label: orgID
      }
    } else {
      this.$refs.search_organisation_id.$refs.search.focus()
    }
  },
  watch: {
    selectedOrganisationID: {
      handler(organisationID) {
        if (organisationID != null) {
          this.fetchOrganisation(organisationID.code)
        } else {
          this.selectedOrganisation = {}
        }
      }
    }
  }
}
</script>