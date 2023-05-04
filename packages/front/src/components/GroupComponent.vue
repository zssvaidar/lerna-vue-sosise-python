<script lang="ts">

import { defineComponent, PropType, ref, nextTick } from 'vue'

export default defineComponent({
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
    }
  },
  data () {
    return {
      someVariableUnderYourControl: 1,
      expandedKeys_: {},
      groupTagNodes_: {},
      selectTag: {}
    }
  },
  methods: {
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
      // console.log(this.groupTagNodes_)
    },
    nodeChosen2 (node, nodeChecked) {
      this.findChild(this.groupTagNodes_, node, nodeChecked, 'selectChildTags')
    },
    saveSelectTag () {
      this.$store.dispatch('searchsiteConfig/updateGroupSelectedTags', { id: this.domainId, group_id: this.groupId, selected_tags: this.selectTag })
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
      this.groupTagNodes_ = n
    }
  },
  mounted () {
    setTimeout(() => {
      const getKeysFromTree = (tree) => tree.flatMap(this.getKeysFromNode)
      getKeysFromTree(this.groupTagNodes).forEach((key) => { this.expandedKeys_[key] = true })
    }, 500)
  }
})

</script>

<template>
  <div id="url-group">
    <!-- group component -->
    <!-- {{ groupTags }} -->
    <div class="wrapper">
      <div class="content">
        <h1>Данные группы</h1>

          <div class="menu">
            <div>
            <Card :class="['menu-card-1']">
              <template #content>

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
                    <!-- {{ groupTagToCollect }} -->

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
                <!-- {{ groupTagNodes[1] }} -->
                <Tree2
                  :value="groupTagNodes_"
                  :expandedKeys="expandedKeys_"
                  selectionMode="single"
                  @node-chosen1="nodeChosen1"
                  @node-chosen2="nodeChosen2"
                  >
                <!-- @nodeSelect="nodeSelected" -->
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
  .menu {
    margin-top: 1rem;
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
  }
  .menu .menu-card-1 {
    // max-width: 40%;

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
        }
        &:last-child {
          padding-bottom: 1rem;
        }
      }
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
</style>
