<template>
    <div id="engine-group">
      <GroupComponent
        :groupData="getGroupData"
        :groupTags="getGroupTags"
        :groupTagNodes="getGroupTagNodes"
        :groupTagsToCollect="getGroupTagsToCollect"
        :domainId=domainId
        :groupId="groupId"
      />
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import GroupComponent from '@/components/GroupComponent.vue' // @ is an alias to /src

@Options({
  props: {
    domainId: Number,
    groupId: Number
  },
  components: {
    GroupComponent
  }
})
export default class EngineGroupView extends Vue {
  domainId
  groupId
  mounted (): void {
    this.$store.dispatch('searchsiteConfig/fetchUrlGroupData', { id: this.domainId, group_id: this.groupId })
  }

  get getGroupData () {
    return this.$store.state.searchsiteConfig.groupData
  }

  get getGroupTags () {
    return this.$store.state.searchsiteConfig.groupTags
  }

  get getGroupTagNodes () {
    return this.$store.state.searchsiteConfig.groupTagNodes
  }

  get getGroupTagsToCollect () {
    return this.$store.state.searchsiteConfig.groupTagsToCollect
  }
}
</script>

<style lang="scss" scoped>

#engine-group {

}
</style>
