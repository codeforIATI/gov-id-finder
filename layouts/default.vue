<template>
  <div class="d-flex flex-column h-100">
    <b-navbar toggleable="sm" type="light" variant="light" sticky>
      <b-container>
        <b-navbar-brand :to="'/'">
          <img src="~/assets/logo.png" alt="A project of Code for IATI"
            width="100px" />
          Gov Org ID Finder
        </b-navbar-brand>
        <b-navbar-nav class="mr-auto">
          <b-nav-item :to="{name: 'index'}" exact-active-class="active">Home</b-nav-item>
          <b-nav-item-dropdown text="Countries" right>
            <div class="scrollable-menu">
              <b-dropdown-item
                href="#" active :to="{name: 'about'}">Not listed? Get in touch!</b-dropdown-item>
              <b-dropdown-item
                v-for="country in countries"
                :to="{name: 'countries-id', params: { id: country.code }}">{{ country.name }}</b-dropdown-item>
            </div>
          </b-nav-item-dropdown>
          <b-nav-item :to="{name: 'about'}" exact-active-class="active">About</b-nav-item>
        </b-navbar-nav>
        <b-navbar-toggle
          target="none"
          data-c4i-toggle="sidebar"
          type="button"
          aria-controls="c4i-sidebar"
          aria-expanded="false"
          aria-label="Toggle Code for IATI sidebar"
          class="c4i-navbar-toggler navbar-toggler">
          <span class="navbar-toggler-icon"></span>
        </b-navbar-toggle>
      </b-container>
    </b-navbar>
    <b-container class="d-flex flex-column h-100">
      <nuxt class="d-flex flex-column h-100 mt-5" />
    </b-container>
    <footer class="footer mt-auto">
      <hr />
      <b-container>
        <b-row>
          <b-col md="6">
            <p>Using codes extracted from government budgets, <nuxt-link :to="{name: 'about'}">as described here</nuxt-link><span id="last-updated"></span>.</p>

            <p><a href="https://codeforiati.org/gov-id-finder-data/downloads/org-ids.csv">Download a CSV snapshot</a>, or <a href="https://codeforiati.org/gov-id-finder-data/downloads/org-ids.json">a JSON snapshot</a>.</p>
          </b-col>
          <b-col md="6" class="text-md-right">
            <p>
              A <a href="https://codeforiati.org">Code for IATI</a> project, supported by <a href="https://devinit.org">Develoment Initiatives</a>
            </p>
            <p>
              <a href="https://github.com/codeforIATI/gov-id-finder">Source code</a> /
              <a href="https://github.com/codeforIATI/gov-id-finder/issues/new/choose">Report a bug</a>
            </p>
            <p>
              Based on <a href="https://org-id-finder.codeforiati.org">Org ID Finder</a> by <a href="https://twitter.com/andylolz">Andy Lulham</a>
            </p>
          </b-col>
      </b-row>
      </b-container>
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
#__nuxt, #__layout {
  height: 100% !important;
  flex-direction: column !important;
  display: flex !important;
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
<script>

import axios from 'axios'
import config from '../nuxt.config'
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: config.head.title,
      description: config.description,
      script: [
        {
          src: 'https://codeforiati.org/sidebar/sidebar-rhs.min.js'
        }
      ]
    }
  },
  computed: {
    baseURL() {
      return this.$axios.defaults.baseURL
    },
    title() {
      return config.head.title
    },...mapState(['countries'])
  },
  methods: {
    async setupMetadata() {
      await axios
        .get(`https://codelists.codeforiati.org/api/json/en/Country.json`).then(response => {
          this.$store.commit('setAllCountries', response.data.data)
        })
      await axios
        .get(`${this.baseURL}/source/metadata.csv`).then(
          response => {
          this.$store.commit('setMetadata', response.data)
        })
    }
  },
  mounted() {
    this.setupMetadata()
  }
}
</script>
