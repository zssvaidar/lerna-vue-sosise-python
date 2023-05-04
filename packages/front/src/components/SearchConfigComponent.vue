<script lang="ts">

import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import UrlGroupComponent from '@/components/UrlGroupComponent.vue'

export default defineComponent({
  props: {
    domains: {
      type: Array as PropType<any[]>,
      required: true
    },
    domainMapUrls: {
      type: Object as PropType<any>,
      required: true
    },
    // {} as PropType<any>,
    domainMap: {
      type: Object as PropType<any>,
      required: true
    }, // {} as PropType<any>,
    domainMapUrlGroups: {
      type: Object as PropType<any>,
      required: true
    }, // } as PropType<any>,
    domainMapUrlGroupCount: {
      type: Number
    }
  },
  emits: [],
  components: {
    UrlGroupComponent
  },
  data () {
    return {
      visible: false,
      domainUrl: '',
      errors: {
        domainUrl: false
      },
      selectedSite: 4,
      selectedSplit: 4,
      selectedGroup: 0,
      showModal: false,
      groupDomainUrls: [] as any[],
      secletedUrlGroupData: {} as any
    }
  },
  methods: {
    addDomain (event) {
      event.preventDefault()
      if (this.domainUrl.length === 0 || !this.domainUrl.includes('http') || !this.domainUrl.includes('//')) {
        this.errors.domainUrl = true
        return
      }
      this.$store.dispatch('searchconfig/createDomainUrl', { domain_url: this.domainUrl })
      setTimeout(() => {
        location.reload()
      }, 300)
    },
    removeDomain (event, id) {
      event.stopPropagation()
      this.$store.dispatch('searchconfig/deleteDomainUrl', { id })
      setTimeout(() => {
        location.reload()
      }, 300)
    },
    selectSite (id) {
      this.selectedSite = id
      this.$store.dispatch('searchconfig/fetchUrlGroupData', { id: this.selectedSite })
      this.$store.dispatch('searchconfig/fetchUrlData', { id: this.selectedSite })
    },
    selectGroup (id, split, urlGroup) {
      this.selectedGroup = id
      this.selectedSplit = split
      this.secletedUrlGroupData = urlGroup

      this.groupDomainUrls = this.domainMapUrls[this.selectedSite].filter(mapUrl => urlGroup.pageIds.includes(mapUrl.id))
      this.$router.push({ name: 'group', params: { siteId: this.selectedSite, split: split, groupId: id } })
      this.showModal = true
    },
    onClose () {
      this.showModal = false
      this.$router.go(-1)
    },
    startUrlCollect (id) {
      this.$store.dispatch('searchconfig/startUrlCollect', { id: id })
    },
    startUrlGroup (id) {
      this.$store.dispatch('searchconfig/startUrlGroup', { id: id })
    },
    startGroupUrlTagCollection (id) {
      this.$store.dispatch('searchconfig/startGroupUrlTagCollection', { id: id })
    }
  },
  watch: {
    domainUrl: function (newValue, oldValue) {
      this.errors.domainUrl = false
    }
  },
  created () {
    this.$watch(
      () => this.$route.params,
      (params) => {
        if (this.showModal === false && params.siteId && params.split && params.groupId) {
          this.selectedSite = Number(params.siteId)
          this.selectedSplit = Number(params.split)
          this.selectedGroup = Number(params.groupId)

          setTimeout(() => {
            const urlGroup = this.domainMapUrlGroups[this.selectedSite][this.selectedSplit].find(groupUrl => groupUrl.id === this.selectedGroup)
            this.selectGroup(this.selectedGroup, this.selectedSplit, urlGroup)
            this.showModal = true
          }, 1000)
        }
      },
      { immediate: true }
    )
  },
  mounted () {
    this.$store.dispatch('searchconfig/fetchUrlGroupData', { id: this.selectedSite })
    setTimeout(() => {
      this.$store.dispatch('searchconfig/fetchUrlData', { id: this.selectedSite })
    }, 500)
  }
})
</script>

<template>
    <div id="search-config">
      <div class="wrapper">
        <div class="content">
          <h1>Пойск данных</h1>
          <div class="action-list">
            <Button
              class="p-button p-button-sm"
              label="Добавить сайт для пойска"
              @click="visible=true"
            />
            <Dropdown :style="{ height: '39px' }" />

            <Dialog :class="['search-config']" v-model:visible="visible" :dismissableMask="true" modal header="Добавить аудиофайл" :style="{ width: '35vw' }">
              <div class="form-field">
                <label>Ссылка на сайт</label>
                <InputText type="text" placeholder="https://site.kz, http://site.kz" :class="[{'p-invalid': errors.domainUrl}]" v-model="domainUrl"/>
                <small v-if="errors.domainUrl"  :class="[{'invalid-small': errors.domainUrl}]" id="username-help">Неверый формат ссылки</small>
              </div>
              <FileUpload class="pi sm" label="Сохранить" mode="basic" name="demo[]" customUpload accept="audio/*,.wav" :maxFileSize="1000000" :auto="true" @uploader="domainUrl" chooseLabel="Загрузить" >
              </FileUpload>

              <Button class="p-button-sm" label="Сохранить" @click="addDomain" />
            </Dialog>

          </div>
          <div class="menu">
            <Card :class="['site-list']">
              <template #content>
                <ScrollPanel v-if="domains.length" style="width: 100%; height: 40vh" class="custombar1">
                  <template v-for="(domain) in domains" :key="domain.id">
                    <div class="row" @click="selectSite(domain.id)">
                        <div class="domain-link">  <router-link :to="{ name: 'domainPage', params: { domainId: domain.id }}" > link </router-link>  </div>
                        <div class="row-info">
                          <div>
                            <label for="">Ид:</label>
                            <span>{{ domain.id }}</span>
                          </div>
                          <div>
                            <label for="">Сайт:</label>
                            <span>{{ domain.name }}</span>
                          </div>
                          <div>
                            <label for="">Ссылка:</label>
                            <span>{{ domain.url }}</span>
                          </div>
                        </div>
                        <div class="row-action">
                          <Button icon="pi pi-trash" label="Удалить" @click="removeDomain($event, domain.id)" class="delete-row p-button-sm p-button-danger p-button-outlined"/>
                          <Button label="Запустить сбор ссылок" @click="startUrlCollect(domain.id)" class="start-url-collect p-button-sm p-button-outlined"/>
                        </div>
                        <div class="row-action">
                          <Button label="Собрать группы ссылок" @click="startUrlGroup(domain.id)" class="p-button-sm p-button-outlined"/>
                        </div>
                        <div class="row-action">
                          <Button label="Запустить сбор html тегов по группам" @click="startGroupUrlTagCollection(domain.id)" class="p-button-sm p-button-outlined"/>
                        </div>

                      </div>
                  </template>
                </ScrollPanel>
              </template>
            </Card>

            <Card class="site-info">
              <template #title>Данные по сайту</template>
              <template #content>
                <fieldset class="domain-fieldset">

                  <div class="info-item">
                    <label>Ссылки</label>
                    <div v-if="domainMapUrls[selectedSite]">
                        {{ domainMapUrls[selectedSite].length }} ссылок
                    </div>
                  </div>
                  <div class="info-item">

                    <ScrollPanel v-if="domainMapUrls[selectedSite]" style="width: 100%; height: 40vh" class="custombar1">
                      <template v-for="(item, index) in domainMapUrls[selectedSite]" :key="item.id">
                        <div class="row">
                          <div class="row-info">

                            <div>
                              <label for=""> <template v-if="(index + 1)%5==0">{{ index+1 }} </template> Ид страницы:</label>
                              <span>{{ item.id }}</span>
                            </div>

                            <div>
                              <label for="">Домен:</label>
                              <!-- <span>{{ domainMap[item.domainId].id }} </span> -->
                              <span>{{ domainMap[item.domainId].name }} </span>
                            </div>

                            <div>
                              <label for="">Ссылка:</label>
                              <span>{{ item.url }}</span>
                            </div>
                          </div>
                        </div>

                      </template>
                    </ScrollPanel>

                  </div>

                  <div class="info-item">
                    <label>Группы ссылок</label>
                    <div>{{ domainMapUrlGroupCount }} груп ссылок</div>
                  </div>
                  <div class="info-item info-urlgroup">
                    <template v-if="domainMapUrlGroups[selectedSite]">

                      <Accordion>

                        <AccordionTab v-for="(urlGroups, key) in domainMapUrlGroups[selectedSite]" :key="key">
                            <template #header>
                                <span>найдено {{ urlGroups.length }} групп с делением = {{key}}</span>
                            </template>

                            <div>
                              <ScrollPanel style="width: 100%; height: 40vh" >
                                <template v-for="(urlGroup) in urlGroups" :key="urlGroup.id">
                                  <div class="row" @click="selectGroup(urlGroup.id, key, urlGroup)">
                                      <div class="row-info">

                                        <div>
                                          <label for="">Ид группы:</label>
                                          <span>{{ urlGroup.id }}</span>
                                        </div>
                                        <div>
                                          <label for="">Ид домена:</label>
                                          <span>{{ urlGroup.domainId }}</span>
                                        </div>
                                        <div>
                                          <label for="">Ид ссылки:</label>
                                          <span>{{ urlGroup.pageId }}</span>
                                        </div>
                                        <div>
                                          <label for="">Число деления:</label>
                                          <span>{{ urlGroup.split }}</span>
                                        </div>
                                        <div>
                                          <label for="">Пример ссылки:</label>
                                          <span>{{ urlGroup.url }}</span>
                                        </div>
                                        <div>
                                          <label for="">Ид ссылок:</label>
                                          <span>{{ urlGroup.pageIds }}</span>
                                        </div>
                                        <div>
                                          <label for="">Ссылка группу:</label>
                                          <span>{{ urlGroup.groupUrl }}</span>
                                        </div>
                                        <div>
                                          <label for="">count:</label>
                                          <span>{{ urlGroup.count }}</span>
                                        </div>
                                    </div>
                                  </div>

                                </template>
                              </ScrollPanel>
                            </div>

                        </AccordionTab>

                      </Accordion>
                    </template>
                  </div>
                </fieldset>
              </template>
            </Card>

          </div>
        </div>
      </div>

      <UrlGroupComponent :id="['url-group-modal']" :show="showModal" @close="onClose">
        <template #content1>
          <fieldset class="group-url-fieldset">
            <div class="info-item">
              <label>Ид группы: </label>
              <div v-if="domainMapUrls[selectedSite]">
                {{ selectedGroup }}
              </div>
            </div>
            <div class="info-item">
              <label>Группировка по ссылке:</label>
              <div v-if="domainMapUrls[selectedSite]">
                {{ secletedUrlGroupData.groupUrl }}
              </div>
            </div>

            <div class="info-item">
              <label>Колличество ссылок:</label>
              <div v-if="domainMapUrls[selectedSite]">
                {{ groupDomainUrls.length }}
              </div>
            </div>

            <div class="info-item">
              <ScrollPanel v-if="groupDomainUrls.length" style="width: 100%;" class="custombar1">
                <template v-for="(item) in groupDomainUrls" :key="item.id">
                  <div class="row">
                    <div class="row-info">

                      <div>
                        <label for="">Ид страницы:</label>
                        <span>{{ item.id }}</span>
                      </div>

                      <div>
                        <label for="">Ссылка:</label>
                        <span>{{ item.url }}</span>
                      </div>

                    </div>
                  </div>

                </template>
              </ScrollPanel>
            </div>
          </fieldset>
        </template>
      </UrlGroupComponent>

    </div>
</template>

<style lang="scss" >
#search-config {
  .menu {
      margin-top: 1rem;
      display: flex;
      align-items: start;
      & > * {
        flex: 1 1;
      }
      &>*:last-child {
        margin-left: 2rem;
      }
      .p-card {
        box-shadow: none;
        border: 1px solid var(--border-color);
      }
      .site-list.p-card {
        // margin-bottom: 2rem;
        .p-card-body, .p-card-content {
          padding: 0;
        }
      }
      .site-list {
        .delete-row {
        }
        .start-url-collect {
          margin-left: 1rem;
        }
      }
      .site-info.p-card {
        .p-card-content {
          padding: 0;
        }
      }
      .site-list {
        min-width: 27%;
        .row {
          padding: 1.25rem 0 .5rem 1.25rem;
          display: flex;
          flex-direction: column;
          &:not(:last-child) {
            padding-top: 1rem;
            border-bottom:solid rgb(100,2,3,.1) 1px;
          }
          &:hover {
            background-color: #eeefff;
            color: #000;
          }
          .domain-link {
            margin-left: auto;
          }
        }
        .row .row-action {
          margin: .6rem 0;
        }
        .row .row-info {
          display: flex;
          flex-direction: column;
          position: relative;
          &>* {
            // width: 40%;
            position: relative;
            label {
              color: var(--label-color);
              user-select: none;
            }
            span {
              position: absolute;
              top: 0;
              left: 90px;
              font-weight: 600;
            }
          }
        }
        .p-scrollpanel-bar {
            opacity: 1!important;
            background: var(--border-color)!important;
            // overflow-y:unset;
          }
          .p-scrollpanel-bar-x {
            // overflow-x:hidden;
            width: 0;
            height: 0;
          }
      }
  }
  .menu {
    .site-info {
      min-width: 70%;
      fieldset.domain-fieldset {
        .info-item {
          &:nth-child(2) {
            border: 1px var(--border-color) solid;
          }
          &:not(:first-child) {
            margin-top: .65rem;
          }
          label {
            color: var(--label-color);
          }

          .p-scrollpanel-bar {
            opacity: 1!important;
            background: var(--border-color)!important;
            // overflow-y:unset;
          }
          .row {
            min-height: 105px;
            border-bottom: 1px solid var(--border-color);
            padding: .25rem 0 1rem .5rem;
            .row-info {
              display: flex;
              flex-direction: column;
              &>* {
                position: relative;
                label {
                  color: var(--label-color);
                  user-select: none;
                }
                span {
                  position: absolute;
                  top: 0;
                  left: 130px;
                  max-height: 60px;
                  overflow: hidden;
                }
              }
            }
          }

          .p-scrollpanel-bar-x {
            // overflow-x:hidden;
            width: 0;
            height: 0;
          }
        }

        .info-item.info-urlgroup {
          .p-scrollpanel-bar-x {
            // overflow-x:hidden;
            width: 0;
            height: 0;
          }
          .p-accordion-content {
            padding: 0;
          }
          .row .row-info {
            padding: .75rem 0 .5rem .25rem;
            &>* {
              span {
                white-space: nowrap;
              }
            }
          }
        }

      }
    }
  }
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

  .wrapper .content .action-list {
      margin-top: 0.35rem;
      & > * {
        margin-right: 12px;
      }
  }

  @media screen and (max-width: 1800px) {
    .wrapper {
      width: 90vw;
    }
  }

  @media screen and (max-width: 1300px) {
    .wrapper {
      width: 100vw;
    }
  }
}

.search-config.p-dialog {
  .form-field label {
    padding-bottom: .3rem;
  }
  .p-fileupload-choose {
    margin-top: 1rem  ;
  }
  .p-dialog-content {
    .p-button {
      margin-top: .65rem;
    }
  }
  .p-dialog-header {
    padding-bottom: .65rem;
  }
  .p-dialog-content {
    padding-bottom: 1.5rem;
  }
}

#url-group-modal .group-url-fieldset {
  &>*:not(:first-child){
    margin-top: .25rem;
  }
  .info-item {
  }
  label {
    color: var(--label-color);
    user-select: none;
  }
}
#url-group-modal .row {
  &:not(:last-child) {
    padding-top: 1rem;
    border-bottom:solid rgb(100,2,3,.1) 1px;
  }
  &:hover {
    background-color: #eeefff;
    color: #000;
  }
  .row-info {
    padding: 0 0 .5rem .25rem;
    height: 90px;
    &>* {
      position: relative;
      span {
        position: absolute;
        top: 0;
        left: 110px;
        font-weight: 600;
        height: 60px;
        overflow: hidden;
      }
    }
  }
}

</style>
