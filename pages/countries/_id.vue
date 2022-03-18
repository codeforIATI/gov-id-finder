<template>
  <div>
    <b-row>
      <b-col>
        <h1 class="display-5 text-center mt-5">
          Government Organisation IDs for {{ this.country.Country_name }}
        </h1>
        <b-row>
          <b-col class="text-left lead mb-2">
            <ul>
              <li>Source year: {{ this.country.Year }}</li>
              <li>Download data: <b-btn
                variant="primary"
                :href="`${baseURL}/source/${this.country_code}.csv`"
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
      country_code: this.$route.params.id,
      identifierFields: [
        {key: 'code', label: 'Organisation Identifier', tdClass: 'w-25'},
        {key: 'name', label: 'Name', tdClass: 'w-75'}
      ],
      identifiers: []
    }
  },
  head() {
    return {
      title: `${this.country.Country_name} | Government Organisation ID Finder`
    }
  },
  computed: {
    baseURL() {
      return this.$axios.defaults.baseURL
    },
    country() {
      if (this.countries.length == 0) { return {} }
      return this.countries.filter(
        country => {
          return country.Country_code == this.country_code
        }
      )[0]
    },...mapState(['countries'])
  },
  methods: {
    loadIdentifiers() {
      this.busy = true
      axios.get(`${this.baseURL}/source/${this.country_code}.csv`
        ).then(response => {
        this.identifiers = csv(response.data).map(item => {
          const values = Object.values(item)
          return {
            code: `${this.country_code}-COA-${values[0]}`,
            name: values[1]
          }
        })
      }).finally(_ => {
        this.busy = false
      })
    }
  },
  mounted() {
    this.loadIdentifiers()
  },
  watch: {
  }
}
</script>
