<script lang="ts">

import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    domainData: {
      type: Object as PropType<any>,
      required: true
    },
    domainUrlGroupData: {
      type: Array as PropType<any[]>,
      required: true
    }
  },
  data () {
    return {
    }
  },
  watch: {
  }
})

</script>

<template>
  <div>
    <!-- domain component -->
    {{ domainData }}
    <!-- {{ domainUrlGroupData }} -->
  </div>
</template>

<style lang="scss">

#url-domain {
}
</style>
