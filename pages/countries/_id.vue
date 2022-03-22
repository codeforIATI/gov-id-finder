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
              <ul>
                <li>Source year: {{ this.country.year }}</li>
                <li>Source URL: <code><a :href="this.country.source">{{ this.country.source }}</a></code></li>
                <li>Download data: <b-btn
                  variant="primary"
                  :href="`${baseURL}/source/${this.countryCode}.csv`"
                  size="sm">CSV</b-btn></li>
              </ul>
            </b-col>
          </b-row>
          <b-table
            :fields="identifierFields"
            :items="identifiers"
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
      countryCode: this.$route.params.id,
      identifierFields: [
        {key: 'code', label: 'Organisation Identifier', tdClass: 'w-25'},
        {key: 'name', label: 'Name', tdClass: 'w-75'}
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
      handler() {
        if (this.codesAvailable == true) {
          this.loadIdentifiers()
        }
      }
    }
  }
}
</script>
