<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import SearchComponent from '@/components/Search/SearchComponent.vue'

  @Options({
    components: {
      SearchComponent
    }
  })

export default class SearchView extends Vue {
  get getDataSearchType () {
    return this.$store.state.siteConfig.filters
  }

  get getCategoriesFilter () {
    return this.$store.state.siteConfig.categoriesFilter
  }

  get getSuggestions () {
    return this.$store.state.siteConfig.suggestions
  }

  mounted (): void {
    this.$store.dispatch('siteConfig/fetchSearchFilter')
  }
}

</script>
<template>
  <div id="search-view">
    <SearchComponent
      :filters="getDataSearchType"
      :categoriesFilter="getCategoriesFilter"
      :suggestions="getSuggestions"
    />
  </div>
</template>

<style scoped>

</style>
