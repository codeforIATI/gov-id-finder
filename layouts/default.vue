<template>
  <div class="d-flex flex-column h-100">
    <b-navbar toggleable="sm" type="light" variant="light" sticky>
      <b-container>
        <b-navbar-brand :to="'/'">
          <img src="~/assets/logo.png" alt="A project of Code for IATI"
            width="100px" />
          {{ this.$config.title }}
        </b-navbar-brand>
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
      <nuxt class="d-flex flex-column h-100" />
    </b-container>
    <footer class="footer mt-auto">
      <hr />
      <b-container>
        <b-row>
          <b-col md="6">
            <p>Using codes extracted from government budgets, <a href="https://iaticonnect.org/group/7/discussion/new-methodology-identifying-government-entities">as described here</a><span id="last-updated"></span>.</p>

            <p><a href="/downloads/org-ids.csv">Download a CSV snapshot</a>, or <a href="/downloads/org-ids.json">a JSON snapshot</a>.</p>
          </b-col>
          <b-col md="6" class="text-md-right">
            <p>
              A <a href="https://codeforiati.org">Code for IATI</a> project /
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
</style>
<script>
import config from '../nuxt.config'

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
  },
  methods: {
  }
}
</script>
