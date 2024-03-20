<template>
  <div>
    <template v-if="busy">
      <b-row>
        <b-col class="text-center">
          <b-spinner variant="secondary" label="Loading..."></b-spinner>
        </b-col>
      </b-row>
    </template>
    <template v-else>
      <b-row v-if="codesAvailable">
        <b-col>
          <h1 class="display-5 text-center">
            Government Organisation IDs for {{ this.country.name }}
          </h1>
          <b-row>
            <b-col class="text-left lead mb-2">
              <small>
                <dl class="row">
                  <dt class="col-sm-3">Source year</dt>
                  <dd class="col-sm-9">{{ this.country.year }}</dd>
                  <dt class="col-sm-3">Source URL</dt>
                  <dd class="col-sm-9"><pre class="mb-0"><a :href="this.country.source">{{ this.country.source }}</a></pre></dd>
                  <dt class="col-sm-3">Download data</dt>
                  <dd class="col-sm-9"><b-btn
                    variant="primary"
                    :href="`${baseURL}/source/${this.countryCode}.csv`"
                    size="sm">CSV</b-btn></dd>
                </dl>
              </small>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-input
                class="mb-2"
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Type to Search"
              ></b-form-input>
            </b-col>
          </b-row>
          <b-table
            :fields="identifierFields"
            :items="identifiers"
            :filter="filter"
            :busy="busy">
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <b-spinner class="align-middle" label="Loading..."></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col>
          <h1 class="display-5 text-center">
            Government Organisation IDs for {{ this.country.name }}
          </h1>
          <b-alert show variant="info">
            <p class="lead text-center">We haven't yet extracted codes for this country. <nuxt-link :to="{name: 'about'}">Read more about the methodology here</nuxt-link>, and please get in touch if you're able to share codes for {{ this.country.name }}.</p>
          </b-alert>
        </b-col>
      </b-row>
    </template>
  </div>
</template>
<style>
</style>
<script>
import { mapState } from 'vuex'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
const csv = require('csv-to-js-parser').csvToObj


export default {
  name: 'country',
  data() {
    return {
      busy: false,
      filter: null,
      identifierFields: [
        {key: 'code', label: 'Organisation Identifier', tdClass: 'w-25', sortable: true},
        {key: 'name', label: 'Name', tdClass: 'w-75', sortable: true}
      ],
      identifiers: []
    }
  },
  head() {
    return {
      title: this.country ? `${this.country.name} | Government Organisation ID Finder` : `Government Organisation ID Finder`
    }
  },
  computed: {
    countryCode() {
      return this.$route.params.id
    },
    codesAvailable() {
      return this.countryCode in this.countriesObj
    },
    country() {
      if (this.codesAvailable) {
        return this.countriesObj[this.countryCode]
      } else {
        return {name: this.allCountriesObj[this.countryCode]}
      }
    },
    baseURL() {
      return this.$axios.defaults.baseURL
    },...mapState(['countries', 'countriesObj', 'allCountriesObj'])
  },
  methods: {
    loadIdentifiers() {
      this.busy = true
      axios.get(`${this.baseURL}/source/${this.countryCode}.csv`
        ).then(response => {
        this.identifiers = csv(response.data).map(item => {
          const values = Object.values(item)
          return {
            code: `${this.countryCode}-COA-${values[0]}`,
            name: values[1]
          }
        })
      }).catch(_ => { }).finally(_ => {
        this.busy = false
      })
    }
  },
  mounted() {
  },
  watch: {
    codesAvailable: {
      handler(value) {
        if (value === true) {
          this.loadIdentifiers()
        }
      }
    },
    countryCode: {
      immediate: true,
      handler(value) {
        if (this.codesAvailable == true) {
          this.loadIdentifiers()
        }
      }
    }
  }
}
</script>
