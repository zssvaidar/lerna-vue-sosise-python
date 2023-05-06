<template>
    <div id="engine-group">
      <GroupComponent
        :groupData="getGroupData"
        :groupTags="getGroupTags"
        :groupTagNodes="getGroupTagNodes"
        :groupTagsToCollect="getGroupTagsToCollect"
        :domainId=domainId
        :groupId="groupId"
        :tagDataTypes="getTagDataTypes"

        :pageUrls="getPageUrls"
        :pagesData="getPagesData"
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

  get getPageUrls () {
    return this.$store.state.searchsiteConfig.pageUrls
  }

  get getPagesData () {
    return this.$store.state.searchsiteConfig.pagesData
  }

  get getTagDataTypes () {
    return this.$store.state.searchsiteConfig.tagDataTypes
  }
}
</script>

<style lang="scss" scoped>

#engine-group {

}
</style>
