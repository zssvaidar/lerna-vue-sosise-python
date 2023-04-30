<template>
  <div id="search-engine" class="panel">
    <SearchConfigComponent
      :domains="getDomains"
      :domainMapUrls="getDomainMapUrls"
      :domainMap="getDomainMap"
      :domainMapUrlGroups="getDomainMapUrlGroups"
      :domainMapUrlGroupCount="getDomainMapUrlGroupCount"
    />

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import SearchConfigComponent from '@/components/SearchConfigComponent.vue' // @ is an alias to /src

@Options({
  components: {
    SearchConfigComponent
  }
})

export default class ApiView extends Vue {
  get getDomains () {
    return this.$store.state.searchconfig.domains
  }

  get getDomainMapUrls () {
    return this.$store.state.searchconfig.domainMapUrls
  }

  get getDomainMap () {
    return this.$store.state.searchconfig.domainMap
  }

  get getDomainMapUrlGroups () {
    return this.$store.state.searchconfig.domainMapUrlGroups
  }

  get getDomainMapUrlGroupCount () {
    return this.$store.state.searchconfig.domainMapUrlGroupCount
  }

  mounted () {
    this.$store.dispatch('searchconfig/fetchApiData')
  }
}
</script>

<style lang="scss">
#search-engine {
}
</style>
