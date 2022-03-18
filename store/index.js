const csv = require('csv-to-js-parser').csvToObj

export const state = () => ({
  countries: [],
})

export const mutations = {
  async setMetadata(state, data) {
    state.countries = csv(data)
  }
}

export const actions = {
  async nuxtServerInit ({ commit }, { $axios }) {
    const metadata = await $axios
      .$get(`source/metadata.csv`)
    commit('setMetadata', metadata)
  }
}
