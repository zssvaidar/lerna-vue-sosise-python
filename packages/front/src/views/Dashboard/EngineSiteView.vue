<template>
    <div id="engine-site">
      {{ domainId }}
      <UrlDomainComponent
        :domainData="getDomainData"
        :domainUrlGroupData="getDomainUrlGroupData"
      />
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import UrlDomainComponent from '@/components/UrlDomainComponent.vue' // @ is an alias to /src

@Options({
  props: {
    domainId: Number
  },
  components: {
    UrlDomainComponent
  }
})
export default class EngineSiteView extends Vue {
  domainId
  mounted (): void {
    this.$store.dispatch('searchsiteConfig/fetchDomainData', { id: this.domainId })
  }

  get getDomainData () {
    return this.$store.state.searchsiteConfig.domainData
  }

  get getDomainUrlGroupData () {
    return this.$store.state.searchsiteConfig.domainUrlGroupData
  }
}
</script>

<style lang="scss" scoped>

#engine-site {

}
</style>
