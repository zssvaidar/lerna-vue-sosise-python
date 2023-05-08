<template>
    <div id="engine-site">
      <DomainComponent
        :domainData="getDomainData"
        :domainUrlGroupData="getDomainUrlGroupData"
      />
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import DomainComponent from '@/components/DomainComponent.vue'

@Options({
  props: {
    domainId: Number
  },
  components: {
    DomainComponent
  }
})
export default class EngineSiteView extends Vue {
  domainId
  mounted (): void {
    this.$store.dispatch('parserConfig/fetchDomainData', { id: this.domainId })
  }

  get getDomainData () {
    return this.$store.state.parserConfig.domainData
  }

  get getDomainUrlGroupData () {
    return this.$store.state.parserConfig.domainUrlGroupData
  }
}
</script>

<style lang="scss" scoped>

#engine-site {

}
</style>
