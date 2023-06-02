<template>
<div id="computation-engine" class="panel">
    <FreqWordTaggingComponent
    :dataTagTexts="getDataTagTexts"
    :tagDataTypes="getTagDataTypes"
    />

</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import FreqWordTaggingComponent from '@/components/Computation/FreqWordTaggingComponent.vue' // @ is an alias to /src

@Options({
  components: {
    FreqWordTaggingComponent
  }
})
export default class ApiView extends Vue {
  get getDataTagTexts () {
    return this.$store.state.freqConfig.dataTagTexts
  }

  get getTagDataTypes () {
    return this.$store.state.freqConfig.tagDataTypes
  }

  mounted () {
    this.$store.dispatch('freqConfig/fetchApiData')
  }
}
</script>

<style lang="scss">
</style>
