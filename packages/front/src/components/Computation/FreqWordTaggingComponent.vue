<script lang="ts">

import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    dataTagTexts: {
      type: Array as PropType<any[]>,
      required: true
    },
    tagDataTypes: {
      type: Array as PropType<any[]>,
      required: true
    }
  },
  data () {
    return {}
  }
})

</script>

<template>
    <div id="computation-freqword-component">
        {{ dataTagTexts }}
        {{ tagDataTypes }}
    </div>
</template>

<style lang="scss">
#computation-freqword-component {

}
</style>
