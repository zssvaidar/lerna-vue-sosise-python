<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    show: Boolean
  },
  data () {
    return {
      shown: true
    }
  },
  watch: {
    show (n) {
      this.shown = n
    }
  }
})

</script>

<template>
      <Dialog v-if="show" v-model:visible="shown" :dismissableMask="true" modal header="Группа ссылок" :style="{ 'height': '100%', width: '75vw' }" @hide="$emit('close')">
        <slot name="content1"></slot>
      </Dialog>
</template>

<style lang="scss">

</style>
