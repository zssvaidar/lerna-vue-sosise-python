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

  get getSuggestionData () {
    return this.$store.state.siteConfig.suggestionData
  }

  get getTagTypeFilter () {
    return this.$store.state.siteConfig.tagTypeFilter
  }

  get getTagTypeFilterData () {
    return this.$store.state.siteConfig.tagTypeFilterData
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
      :suggestionsData="getSuggestionData"
      :tagTypeFilter="getTagTypeFilter"
      :tagTypeFilterData="getTagTypeFilterData"
    />
  </div>
</template>
