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
    },
    suggestionsData: {
      type: Object as PropType<any>,
      required: true
    },
    tagTypeFilter: {
      type: Array as PropType<any[]>,
      required: true
    },
    siteFilter: {
      type: Array as PropType<any[]>,
      required: true
    },
    tagTypeFilterData: {
      type: Array as PropType<any[]>,
      required: true
    }
  },
  data () {
    return {
      inputText: '' as any,
      bounceTimer: undefined as any,
      filterModel: { } as any,
      categoryFilterId: 1,
      tagTypeFilterCode: '03',
      tagTypeFilterValue: {} as any,
      siteFilterModel: {} as any
    }
  },
  methods: {
    addSite (data) {
      if (Object.keys(this.siteFilterModel).length) {
        data.siteId = this.siteFilterModel.id
      }
      return data
    },
    searchTimeOut (e) {
      if (e.keyCode === 13) {
        const data = { filter_id: this.filterModel.id, text: this.inputText }
        this.$store.dispatch('siteConfig/searchDataByText', this.addSite(data))
        return
      }

      if (this.bounceTimer) {
        clearTimeout(this.bounceTimer)
        this.bounceTimer = null
      }
      this.bounceTimer = setTimeout(() => {
        const data = { filter_id: this.filterModel.id, text: this.inputText }
        this.$store.dispatch('siteConfig/searchDataByText', this.addSite(data))
        this.$store.dispatch('siteConfig/searchSuggestonsByText', this.addSite(data))
      }, 250)
    },
    dropdownSelect (e) {
      this.inputText = e.value.text
      const data = { filter_id: this.filterModel.id, text: this.inputText.text }

      this.$store.dispatch('siteConfig/searchDataByText', this.addSite(data))
    },
    tagTypeChange (e) {
      const data = { tag_type_code: e.value }
      this.$store.dispatch('siteConfig/searchSuggestonsByTagType', this.addSite(data))
    },
    tagTypeDataChange (e) {
      const data = { filter_id: this.filterModel.id, text: e.value }
      this.$store.dispatch('siteConfig/searchDataByText', this.addSite(data))
    }
  },
  watch: {
    filterModel (n) {
      if (n.type !== 'site') {
        this.siteFilterModel = {}
      }
    },
    siteFilterModel (n) {
      this.$store.dispatch('siteConfig/fetchSearchFilter', { siteId: n.id })
    }
  },
  mounted () {
    setTimeout(() => {
      this.filterModel = this.filters[0]
      this.$store.dispatch('siteConfig/searchDataByText', { filter_id: this.filterModel.id, text: '*' })
    }, 500)
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
              v-model="filterModel"
              optionLabel="label"
              scrollHeight="25rem"
            />
            <template v-if="filterModel.type == 'default'">
              <!-- <Dropdown
                :class="['filter_item']"
                :options="categoriesFilter"
                v-model="categoryFilterId"
                optionLabel="label"
                optionValue="id"
              /> -->
              <Dropdown
                :class="['filter_item']"
                v-model="tagTypeFilterCode"
                :options="tagTypeFilter"
                optionLabel="label"
                optionValue="code"
                @change="tagTypeChange"
                scrollHeight="25rem"
              />
              <Dropdown
                :class="['filter_item']"
                v-model="tagTypeFilterValue"
                :options="tagTypeFilterData"
                optionLabel="text"
                optionValue="text"
                @change="tagTypeDataChange"
                scrollHeight="25rem"
              />

             <!--  <Dropdown
                :class="['filter_item']"
                v-model="tagTypeFilter"
                :options="tagTypeFilterData"
                optionLabel="label"
                optionValue="id"
              /> -->
            </template>

            <template v-if="filterModel.type == 'site'">
              <Dropdown
                :class="['filter_item']"
                v-model="siteFilterModel"
                :options="siteFilter"
                optionLabel="name"
                scrollHeight="25rem"
              />
              <template v-if="Object.keys(siteFilterModel).length">
                <Dropdown
                  :class="['filter_item']"
                  v-model="tagTypeFilterCode"
                  :options="tagTypeFilter"
                  optionLabel="label"
                  optionValue="code"
                  @change="tagTypeChange"
                  scrollHeight="25rem"
                />

                <Dropdown
                  :class="['filter_item']"
                  v-model="tagTypeFilterValue"
                  :options="tagTypeFilterData"
                  optionLabel="text"
                  optionValue="text"
                  @change="tagTypeDataChange"
                  scrollHeight="25rem"
                />
              </template>

            </template>

            <template v-if="filterModel.type == 'keyword'">
              keyword
            </template>

            <template v-if="filterModel.type == 'ner'">
              ner
            </template>

            <template v-if="filterModel.type == 'default' || filterModel.type == 'site'">
              <div class="filter_item p-input-icon-left">
                  <i class="pi pi-search" />
                  <AutoComplete v-model="inputText" type="text" optionLabel="text" :suggestions="suggestions"
                  @keyup="searchTimeOut" @item-select="dropdownSelect" placeholder="текст для поиска">
                    <template #option="slotProps">
                      <div class="flex align-options-center">
                          <div>{{ slotProps.option.text }}</div>
                      </div>
                  </template>
                  </AutoComplete>
              </div>
            </template>
          </div>

          <div class="menu-content">
            <template v-for="(suggestionData, key) in suggestionsData" :key="key">
              <!-- suggestionData  -->
              <Card v-if="Object.entries(suggestionData.data).length>=2">
                <template #header>
                  <img class="header"  src="@/assets/img/IPSNewLifeBiologics1.png">
                </template>
                <template #title>
                  <h3 class="title">
                    <a v-for="title of suggestionData.data.pub_title" :key="title" class="text"
                      :href="suggestionData.url">
                      {{ title.text }}
                      <br/>
                    </a>
                  </h3>
                </template>

                <template v-if="suggestionData.data.author_names || suggestionData.data.author_name || suggestionData.data.date" #subtitle>
                  <h3 v-if="suggestionData.data.author_name">Автор:</h3>
                  <span v-for="name of suggestionData.data.author_name" :key="name">
                    {{ name.text }}
                  </span>
                  <h3 v-if="suggestionData.data.author_names">Авторы:</h3>
                  <span v-for="name of suggestionData.data.author_names" :key="name">
                    {{ name.text }}
                  </span>
                  <br/>
                  <br/>
                  <h3>Даты:</h3>
                  <span v-for="date of suggestionData.data.pub_date" :key="date">
                    {{ date.text }}
                  </span>
                </template>
                Термин
                <template #content>
                  <div class="content-item keywords" v-if="suggestionData.data.termin">
                    <h3>Термины:</h3>
                    <span v-for="termin of suggestionData.data.termin" :key="termin">
                      {{ termin.text }}
                    </span>
                  </div>
                  <div class="abstract" v-if="suggestionData.data.pub_content">
                    <h3>Описание:</h3>
                    <temmplate v-for="content of suggestionData.data.pub_content" :key="content">
                      {{ content.text }}
                    </temmplate>

                  </div>

                  <div class="contet-itnem metas" v-if="suggestionData.data.tag">
                    <h3>Теги:</h3>
                    <span>
                      <div v-for="tag of suggestionData.data.tag" :key="tag" class="text">
                        {{ tag.text }}
                        <br>
                      </div>
                    </span>
                  </div>

                </template>
              </Card>

              <!-- {{ suggestionData }} -->
              <!-- <div v-for="item in suggestionData" :key="item.id">
              </div> -->

            </template>
          </div>

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
  .menu-actions .filter_item {
    // .p-dropdown * {
      // }
  }

  .menu {
    .menu-content .p-card {
      .title {
        max-lines: 2!important;
        // font-size: 16зч;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        max-height: 3em;
        line-height: 1em;
        a {
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .abstract {
        max-lines: 3;
        line-height: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        max-height: 10.8em;
        line-height: 1.8em;
      }
    }
    .menu-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .p-card {
        flex: 0 0 32%;
        margin: 1rem 0;
        box-shadow: none;
        border: 1px solid var(--border-color);
      }
      .p-card {
       &:hover {
        background-color: #eeefff;
        color: #000;
       }
      }
      .p-card .p-card-body .p-card-title {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow:hidden;
        word-wrap: normal;
        text-overflow: ellipsis
      }

      .p-card a.text, span.text{
        color:var(--text-color);
        text-decoration: none;
      }
      .p-card a.text, span.text{
        display: inline-block;
      }
      .p-card a.text:first-letter, span.text:first-letter {
        text-transform: uppercase;
      }
      .p-card-header .img-preview {
        /* width: 12rem; */
      }
      .p-card .p-card-body .p-card-content .p-card-subtitle {
        margin: 0;
      }
      .p-card .p-card-body .p-card-content h3{
        font-weight: 600;
      }
      .p-card .p-card-body .p-card-content > div:not(:last-child)  {
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
