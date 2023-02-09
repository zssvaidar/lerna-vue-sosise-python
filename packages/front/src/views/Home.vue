<script lang="ts">
import { Options, Vue } from 'vue-class-component'

// import ScenarioConfigComponent from '@/components/ScenarioConfigComponent.vue' // @ is an alias to /src

  @Options({
    components: {
      // ScenarioConfigComponent
    }
  })

export default class HomeView extends Vue {
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
    <div class="scenario-config">4321
        <!-- <ScenarioConfigComponent
        :data="getData"
        /> -->
    </div>
</template>
