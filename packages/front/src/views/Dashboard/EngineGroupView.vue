<template>
    <div id="engine-group">
      {{ domainId }}
      {{ groupId }}
      <UrlGroupComponent
        :domainData="getDomainData"
        :domainUrlGroupData="getDomainUrlGroupData"
      />
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import UrlGroupComponent from '@/components/UrlGroupComponent.vue' // @ is an alias to /src

@Options({
  props: {
    domainId: Number,
    groupId: Number
  },
  components: {
    UrlGroupComponent
  }
})
export default class EngineGroupView extends Vue {
  domainId
  groupId
  mounted (): void {
    this.$store.dispatch('searchsiteConfig/fetchUrlGroupData', { id: this.domainId, group_id: this.groupId })
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

#engine-group {

}
</style>
