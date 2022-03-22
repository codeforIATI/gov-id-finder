const csv = require('csv-to-js-parser').csvToObj

export const state = () => ({
  countries: [],
  countriesObj: {},
  allCountries: [],
  allCountriesObj: {}
})

export const mutations = {
  async setMetadata(state, data) {
    state.countries = csv(data).map(item => {
      return {
        code: item.Country_code,
        name: state.allCountriesObj[item.Country_code],
        source: item.Source,
        year: item.Year
      }
    }).sort((a, b) => a.name > b.name ? 1 : -1);
    state.countriesObj = state.countries.reduce((summary, item) => {
      summary[item.code] = item
      return summary
    })
  },
  async setAllCountries(state, data) {
    state.allCountries = data
    state.allCountriesObj = state.allCountries.reduce((summary, item) => {
      summary[item.code] = item.name
      return summary
    }, {})
  }
}

export const actions = {
  async nuxtServerInit ({ commit }, { $axios }) {
    const allCountries = await $axios
      .$get(`https://codelists.codeforiati.org/api/json/en/Country.json`)
    commit('setAllCountries', allCountries.data)
    const metadata = await $axios
      .$get(`source/metadata.csv`)
    commit('setMetadata', metadata)
  }
}
