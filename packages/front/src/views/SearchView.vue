<script lang="ts">
import { Options, Vue } from 'vue-class-component'

// import ScenarioConfigComponent from '@/components/ScenarioConfigComponent.vue' // @ is an alias to /src

  @Options({
    components: {
      // ScenarioConfigComponent
    }
  })

export default class SearchView extends Vue {
  get getData () {
    // return this.$store.state.PbxConfig.languages
    return []
  }

  mounted () {
    // this.$store.dispatch('fetchApiData', {})
  }
}
</script>
<template>
    <div class="data-search">
      <div class="wrapper">
        <section>
123
        </section>
      </div>
        <!-- <ScenarioConfigComponent
        :data="getData"
        /> -->
    </div>
</template>

<style scoped>
.data-search .wrapper {
  width: 75vw;
  margin-left: auto;
  margin-right: auto;
}
.data-search .wrapper section {
  margin-top: 2rem;
}
</style>
