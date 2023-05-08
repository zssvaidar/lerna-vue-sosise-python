<script lang="ts">

import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    filters: {
      type: Array as PropType<any[]>,
      required: true
    },
    categoriesFilter: {
      type: Array as PropType<any[]>,
      required: true
    },
    suggestions: {
      type: Array as PropType<any[]>,
      required: true
    }
  },
  data () {
    return {
      inputText: { id: -1, text: '' } as any,
      inputTextOld: '',
      bounceTimer: undefined as any,
      filterId: 1,
      categoryFilterId: 1
    }
  },
  methods: {
    searchTimeOut (e) {
      this.inputTextOld = this.inputText
      if (e.keyCode === 13) {
        this.$store.dispatch('siteConfig/searchDataByText', { filter_id: this.filterId, text: this.inputText })
        return
      }

      if (this.bounceTimer) {
        clearTimeout(this.bounceTimer)
        this.bounceTimer = null
      }
      this.bounceTimer = setTimeout(() => {
        this.$store.dispatch('siteConfig/searchSuggestonsByText', { filter_id: this.filterId, text: this.inputText })
      }, 800)
    },
    dropdownSelect (e) {
      this.inputText.text = this.inputTextOld + e.value.text
      this.$store.dispatch('siteConfig/searchDataByText', { filter_id: this.filterId, text: this.inputText.text })
    }
  },
  watch: {
  }
})

</script>

<template>
  <div id="search-component">
    <div class="wrapper">
      <div class="content">
        <h1>Пойск данных</h1>
        <div class="menu">
          <!-- <div class="filter_item">
              <Dropdown :options="['Публикаций', 'Людей']" placeholder="Пойск людей, публикаций" />
          </div> -->
          <div class="menu-actions">
            <Dropdown
              :class="['filter_item']"
              :options="filters"
              v-model="filterId"
              optionLabel="label"
              optionValue="id"
            />
            <template v-if="filterId == 1">
              <Dropdown
                :class="['filter_item']"
                :options="categoriesFilter"
                v-model="categoryFilterId"
                optionLabel="label"
                optionValue="id"
              />
              <div class="filter_item p-input-icon-left">
                  <i class="pi pi-search" />
                  {{ inputTextOld }}
                  <AutoComplete v-model="inputText" type="text" optionLabel="text" :suggestions="suggestions"
                  @keyup="searchTimeOut" @item-select="dropdownSelect" placeholder="name, university, speciality" >
                    <template #option="slotProps">
                      <div class="flex align-options-center">
                          <div>{{inputText + slotProps.option.text }}</div>
                      </div>
                  </template>
                  </AutoComplete>
              </div>
            </template>
            <template v-if="filterId == 2 || filterId == 3">
              <div class="filter_item p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="inputText" type="text"  @keyup="searchTimeOut" placeholder="name, university, speciality" />
              </div>
            </template>
          </div>

          <!-- <div class="filter_item" v-for="filter in filters" :key="filter">
            <Dropdown :options="getfilterValues[filter['filterId']]" v-model="selectedValue" v-on:change="fetchInfoBy(filter['filterId'], selectedValue['value'])" optionLabel="value" :placeholder="filter.name" />
          </div> -->

        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

#search-component {
  .wrapper {
    width: 75vw;
    margin-left: auto;
    margin-right: auto;
  }
  .content {
    margin-top: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
    h1 {
      margin-top: 1rem;
      color: var(--text-color);
    }
  }

  .menu {
    .menu-actions {
      display: flex;
      margin-top: .35rem;
      &>*:not(:first-child) {
        margin-left: 1rem;
      }
    }
  }
}
</style>
