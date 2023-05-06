<script lang="ts">

import { defineComponent, PropType } from 'vue'
import CollectedTagComponent from '@/components/CollectedTagComponent.vue'

export default defineComponent({
  components: {
    CollectedTagComponent
  },
  props: {
    domainId: Number,
    groupId: Number,
    groupData: {
      type: Object as PropType<any>,
      required: true
    },
    groupTags: {
      type: Array as PropType<any[]>,
      required: true
    },
    groupTagNodes: {
      type: Array as PropType<any[]>,
      required: true
    },
    groupTagsToCollect: {
      type: Array as PropType<any[]>,
      required: true
    },

    pageUrls: {
      type: Array as PropType<any[]>,
      required: true
    },
    pagesData: {
      type: Object as PropType<any>,
      required: true
    },
    tagDataTypes: {
      type: Array as PropType<any[]>,
      required: true
    }
  },
  data () {
    return {
      expandedKeys_: {},
      groupTagNodes_: {},
      selectTag: {},
      groupReady_: false,

      showModal: false,
      modalHoveredSite: 0,
      modalHoveredSiteData: 0,
      groupTagDataTagIds: [] as number[],
      mapGroupTagData: {} as any,
      mapPageTag: {} as any
    }
  },
  methods: {
    showCollectedData () {
      this.showModal = true
    },
    onClose () {
      this.showModal = false
    },
    nodeSelected (node) {
      console.log(node)
    },
    getKeysFromNode (node) {
      const keys = [node.key]
      if (node.children) {
        keys.push(...node.children.flatMap(this.getKeysFromNode))
      }
      return keys
    },
    nodeChosen1 (node, nodeChecked) {
      this.findChild(this.groupTagNodes_, node, nodeChecked, 'selectTag')
    },
    nodeChosen2 (node, nodeChecked) {
      this.findChild(this.groupTagNodes_, node, nodeChecked, 'selectChildTags')
    },
    saveSelectTag () {
      this.$store.dispatch('searchsiteConfig/updateGroupSelectedTags', { id: this.domainId, group_id: this.groupId, selected_tags: this.selectTag })
      this.reloadPage()
    },
    saveGroupReady () {
      this.groupReady_ = !this.groupReady_
      this.$store.dispatch('searchsiteConfig/updateGroupReady', { id: this.domainId, group_id: this.groupId, group_ready: this.groupReady_ })
    },
    reloadPage () {
      setTimeout(() => {
        location.reload()
      }, 300)
    },
    findChild (nodes, target, nodeChecked, value) {
      for (const node of nodes) {
        if (node.id === target.id) {
          if (value === 'selectChildTags' && node.children) {
            for (const child of node.children) {
              this.selectTag[child.id] = nodeChecked
            }
            break
          } else {
            node[value] = nodeChecked
            this.selectTag[node.id] = nodeChecked
            break
          }
        } else if (node.children.length) {
          this.findChild(node.children, target, nodeChecked, value)
        }
      }
    },
    siteHovered (index) {
      this.modalHoveredSite = index
    },
    siteDataHovered (index) {
      this.modalHoveredSiteData = index
    },
    getGroupTagDataTagIds (): number[] {
      return this.groupTagsToCollect.map(data => data.tagId)
    },
    getMapGroupTagData () {
      const obj = {}
      for (const data of this.groupTagsToCollect) {
        obj[data.id] = data
      }
      return obj
    },
    getMapPageTag (pageId) {
      const obj = {}
      for (const data of this.pagesData[pageId]) {
        obj[data.groupTagId] = data
      }
      return obj
    }
  },
  watch: {
    selectTag: {
      handler (newValue, oldValue) {
        console.log(newValue)
      },
      deep: true
    },
    groupTagNodes (n) {
      this.groupReady_ = this.groupData.groupReady
      this.groupTagNodes_ = n
    }
  },
  mounted () {
    setTimeout(() => {
      const getKeysFromTree = (tree) => tree.flatMap(this.getKeysFromNode)
      getKeysFromTree(this.groupTagNodes).forEach((key) => { this.expandedKeys_[key] = true })
    }, 500)

    this.$store.dispatch('searchsiteConfig/fetchGroupCollectedData', { id: this.domainId, group_id: this.groupId })
      .then((result) => {
        setTimeout(() => {
          this.groupTagDataTagIds = this.getGroupTagDataTagIds()
          this.mapGroupTagData = this.getMapGroupTagData()
          for (const pageUrl of this.pageUrls) {
            this.mapPageTag[pageUrl.id] = this.getMapPageTag(pageUrl.id)
          }
        }, 500)
      })
  }
})

</script>

<template>
  <div id="url-group">
    <div class="wrapper">
      <div class="content">
        <h1>Данные группы</h1>
          <div v-if="groupReady_" class='menu-action'>
            <Button @click="showCollectedData" label="Собранные данные"></Button>
          </div>
          <div class="menu">
            <div>
            <Card :class="['menu-card-1']">
              <template #content>

                <div class="card-1-action">
                  <Button v-if="!groupReady_" class="p-button-outlined p-button-sm" label="Сбор данных" @click="saveGroupReady"></Button>
                  <Button v-if="groupReady_" class="p-button-outlined p-button-sm p-button-danger" label="Сбор данных" @click="saveGroupReady"></Button>
                </div>
                <fieldset class="group-fieldset">

                  <div class="row">
                    <div class="info-item">
                      <label>Ид группы:</label>
                      <div >
                        {{ groupData.id }}
                      </div>
                    </div>
                    <div class="info-item">
                      <label>Ссылка группы:</label>
                      <div >
                        {{ groupData.groupUrl }}
                      </div>
                    </div>
                    <div class="info-item">
                      <label>Ид страницы:</label>
                      <div >
                        {{ groupData.pageId }}
                      </div>
                    </div>

                  </div>

                  <div class="row">
                    <div class="info-item">
                      <label>Пример ссылки:</label>
                      <div >
                        {{ groupData.url }}
                      </div>
                    </div>
                    <div class="info-item">
                      <label>Ид страниц в группе:</label>
                      <div >
                        {{ groupData.pageIds }}
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="info-item">
                      <label>Число деления группы:</label>
                      <div >
                        {{ groupData.split }}
                      </div>
                    </div>
                    <div class="info-item">
                      <label>Количество:</label>
                      <div >
                        {{ groupData.count }}
                      </div>
                    </div>
                    <div class="info-item">
                      <label>Сбор данных:</label>
                      <div>
                        <template v-if="groupReady_">Включен</template>
                        <template v-if="!groupReady_">Отключен</template>
                      </div>
                    </div>
                  </div>

                </fieldset>

              </template>
            </Card>

            <Card :class="['menu-card-3']">
              <template #content>

                <ScrollPanel>
                  <template v-for="(groupTagToCollect) in groupTagsToCollect" :key="groupTagToCollect.id">

                    <div class="row">
                      <div class="row-info">
                        <div class="info-item">
                          <label>Тег:</label>
                          <div >
                            {{ groupTagToCollect.tag }}
                          </div>
                        </div>
                        <div class="info-item">
                          <label>Глубина:</label>
                          <div >
                            {{ groupTagToCollect.depth }}
                          </div>
                        </div>
                        <div class="info-item">
                          <label>Путь:</label>
                          <div >
                            {{ groupTagToCollect.xpath }}
                          </div>
                        </div>
                      </div>
                      <div class="row-info">
                        <div class="info-item">
                          <label>Текст:</label>
                          <div >
                            {{ groupTagToCollect.text }}
                          </div>
                        </div>
                      </div>
                    </div>

                  </template>
                </ScrollPanel>

              </template>
            </Card>
          </div>

            <Card :class="['menu-card-2']">
              <template #content>
                <div class="tree-action">
                  <Button class="p-button-outlined" label="Сохранить" @click="saveSelectTag"></Button>
                </div>
                <Tree2
                  :value="groupTagNodes_"
                  :expandedKeys="expandedKeys_"
                  selectionMode="single"
                  @node-chosen1="nodeChosen1"
                  @node-chosen2="nodeChosen2"
                  >
                  <template #default="slotProps">
                    {{ slotProps.node.id }}
                    {{ slotProps.node.depth }}
                    {{ slotProps.node.text }}
                    <!-- {{ slotProps.node.tag }} -->
                    {{ slotProps.node.xpath }}
                  </template>
                </Tree2>

              </template>
            </Card>
          </div>

      </div>
    </div>

    <CollectedTagComponent :id="['group-page-modal']" :show="showModal" @close="onClose">
      <template #content1 >
        <fieldset class="group-page-fieldset">

          <div class="table">

            <template v-for="(pageUrl, index) in pageUrls" :key="pageUrl.id">
              <div class="col" v-if="index==0">
                <div class="cell cell-group-action">
                  <h3>
                    Тип данных
                  </h3>
                </div>
                <template v-for="(groupTagData) in mapGroupTagData" :key="groupTagData.id">
                  <div class="cell" :class="{'active-modal-page-data-item': (groupTagData.tagId === Number(modalHoveredSiteData))}">
                    <Dropdown
                    :options="tagDataTypes"
                    optionLabel="label"
                    optionValue="id"

                    />
                  </div>
                </template>
              </div>
              <div class="col" v-if="index==0">
                <div class="cell cell-group-url">
                  <h3>
                    Сведения группы #{{ groupData.pageId }}
                  </h3>
                  <div class="cell-info">
                    <label>Путь ссылки:</label>
                    <div>
                      {{ groupData.url.split('/').pop()  }}
                    </div>
                  </div>
                </div>
                <template v-for="(groupTagData) in mapGroupTagData" :key="groupTagData.id">
                  <div class="cell" :class="{'active-modal-page-data-item': (groupTagData.tagId === Number(modalHoveredSiteData))}">[{{ groupTagData.tag }}] {{ groupTagData.text }} </div>
                </template>
              </div>
              <div class="col">
                <div class="cell cell-page-url" :class="{'active-modal-page': index === modalHoveredSite }" @mouseover="siteHovered(index)">
                  <h3>
                    Сведения сайта #{{ pageUrl.id}}:
                  </h3>
                  <div class="cell-info">
                    <label>Путь ссылки:</label>
                    <div>
                      {{ pageUrl.url.split('/').pop() }}
                    </div>
                  </div>
                </div>
                <template v-for="(groupTagData, tagId) in mapGroupTagData" :key="groupTagData.id">
                  <template v-if="mapPageTag[pageUrl.id]">
                    <div class="cell" v-if="mapPageTag[pageUrl.id][tagId]" @mouseover="siteDataHovered(tagId)" :class="{'active-modal-page-data-item': (tagId === modalHoveredSiteData /* && index === modalHoveredSite */) }">
                      {{ mapPageTag[pageUrl.id][tagId].text }}
                    </div>
                    <div class="cell" v-if="!mapPageTag[pageUrl.id][tagId]">
                    </div>
                  </template>
                  <!-- <div class="cell" v-if="!mapPageTag[pageUrl.id]" @mouseover="siteDataHovered(tagId)"></div> -->
                </template>
              </div>

            </template>
          </div>

        </fieldset>
      </template>
    </CollectedTagComponent>
  </div>
</template>

<style lang="scss">

#url-group {
  .wrapper {
      width: 75vw;
      margin-left: auto;
      margin-right: auto;
  }
  .wrapper .content {
      margin-left: 1rem;
      margin-right: 1rem;
  }
  .wrapper .content h1 {
      margin-top: 2rem;
      color: var(--text-color);
  }
}

#url-group {
  .menu-action {
    padding-top: .35rem;
  }
  .menu {
    margin-top: .45rem;
    display: flex;
    align-items: start;
    & > * {
      flex: 1 1;
    }
    &>*:last-child {
      // margin-left: 2rem;
    }
    .p-card {
      box-shadow: none;
      border: 1px solid var(--border-color);
      .p-card-body, .p-card-content {
        padding: 0;
      }
    }
  }
}

#url-group {
  .menu >div {
    display: flex;
    flex-direction: column;
    max-width: 50%;
  }
  .menu {
  }
  .menu .menu-card-1 {

    fieldset {
      padding-right: 1rem;
      .row {
        padding: 1rem 0 0 1rem;
        display: flex;
        flex-direction: row;
        .info-item {
          &:not(:first-child) {
            margin-left: 2rem;
          }
          label {
            color: var(--label-color);
            user-select: none;
          }
          &>div {
            word-break:break-all;
          }
        }
        &:last-child {
          padding-bottom: 1rem;
        }
      }
    }
  }

  .menu .menu-card-1 {
    position: relative;
    .card-1-action {
      position: absolute;
      z-index: 1;
      right: 1rem;
      bottom: 1rem;
    }
  }
  .menu .menu-card-2 {
    margin-left: 1rem;
    // width: 30%;
    position: relative;
    .tree-action {
        position: absolute;
        z-index: 1;
        right: 2vw;
        top: 3vh;
    }
  }

  .menu .menu-card-3 {
    margin-top: 1rem;
    .row {
      padding: 1rem 0 1rem 1rem;
      display: flex;
      flex-direction: column;
      &:not(:last-child) {
        padding-top: 1rem;
        border-bottom:solid rgb(100,2,3,.1) 1px;
      }
      .row-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-right: 1rem;
        &:not(:first-child) {
          margin-top: .45rem;
        }
      }
      .info-item {
          &:not(:first-child) {
            // margin-left: 2rem;
          }
          label {
            color: var(--label-color);
            user-select: none;
          }
        }
        &:hover {
          background-color: #eeefff;
          color: #000;
        }
    }
  }
}

#url-group {
  @media screen and (max-width: 1800px) {
    .wrapper {
      width: 90vw;
    }
    #url-group {
      .wrapper {
        width: 90vw;
      }
    }
  }

  @media screen and (max-width: 1450px) {
    #url-group .menu {
      .site-info {
        min-width: 55%;
      }
    }
  }

  @media screen and (max-width: 1300px) {
    .wrapper {
      width: 100vw;
    }
    #url-group {
      .wrapper {
        width: 100vw;
      }
    }
  }
}

#url-group {
  .p-tree {
    padding: .25rem 0 0 .3rem;
  }
  .p-tree .p-tree-container .p-treenode .p-treenode-content.p-treenode-selectable:not(.p-highlight):hover {
    background: #eeefff!important;
    color: #495057!important;
  }
}

#group-page-modal {
  .group-page-fieldset {
    display: flex;
    flex-direction: row;
    .table {
      display: flex;
    }
    .table .cell-group-url {
      width: 30rem;
    }
    .table .cell-group-action {
      width: 10rem;
      height: 5.6rem!important;
    }
    .col {
      display: flex;
      flex-direction: column;
      .cell {
        border: 1px solid var(--border-color);
        overflow: hidden;
        min-height: 4rem;
        height: 4rem;
        padding:.45rem;
        max-width: 10rem;
        max-width: 30rem;
        &:hover {
          background: #eeefff!important;
          color: #495057!important;
        }
        .cell-info {
          margin-top: .2rem;
          label {
            color: var(--label-color);
            user-select: none;
          }
          &>div {
          }
        }
      }
      .cell-page-url, .cell-group-url {
        height: 5.6rem;
      }
    }
    .active-modal-page {
      width: 30rem;
    }
    .active-modal-page-data-item {
      width: 30rem;
      height: 12rem!important;
      overflow-y: scroll!important;
    }
  }
}

</style>
