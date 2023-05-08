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
    this.$store.dispatch('parserConfig/fetchUrlGroupData', { id: this.domainId, group_id: this.groupId })
  }

  get getGroupData () {
    return this.$store.state.parserConfig.groupData
  }

  get getGroupTags () {
    return this.$store.state.parserConfig.groupTags
  }

  get getGroupTagNodes () {
    return this.$store.state.parserConfig.groupTagNodes
  }

  get getGroupTagsToCollect () {
    return this.$store.state.parserConfig.groupTagsToCollect
  }

  get getPageUrls () {
    return this.$store.state.parserConfig.pageUrls
  }

  get getPagesData () {
    return this.$store.state.parserConfig.pagesData
  }

  get getTagDataTypes () {
    return this.$store.state.parserConfig.tagDataTypes
  }
}
</script>

<style lang="scss" scoped>

#engine-group {

}
</style>
