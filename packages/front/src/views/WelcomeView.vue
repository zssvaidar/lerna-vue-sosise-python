<template>
  <div class="welcome">
    <div class="wrapper">
      <section>
        <h1>Главная</h1>

        <div class="filter_item">
            <Dropdown :options="['Публикаций', 'Людей']" placeholder="Пойск людей, публикаций" />
            <!-- <Dropdown :options="['Публикаций', 'Людей']" v-model="selectType" placeholder="Пойск людей, публикаций" /> -->
        </div>

        <div id="filter_list">

        <span class="filter_item p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="inputText" type="text"  @keyup="searchTimeOut" placeholder="name, university, speciality" />
        </span>

          <div class="filter_item" v-for="filter in getFilters" :key="filter">
            <!-- {{ getfilterValues[filter['filterId']] }} -->
            <Dropdown :options="getfilterValues[filter['filterId']]" v-model="selectedValue" v-on:change="fetchInfoBy(filter['filterId'], selectedValue['value'])" optionLabel="value" :placeholder="filter.name" />
          </div>
        </div>

        <div id="info_content">

          <Card v-for="data in getfilterValueResult" :key="data">
            <template #header>
              <img class="header"  src="@/assets/img/IPSNewLifeBiologics1.png">
            </template>
            <template #title>
              <a class="text" href="#">
                {{ data.infoContent.work_names[0]?? 'No paper name' }}
              </a>
            </template>
            <template #subtitle>
              <span v-for="author in data.infoContent.authors" :key="author">
                {{ author }}{{ data.infoContent.authors.length  > 1 && author != data.infoContent.authors[data.infoContent.authors.length -1] ? ', ' : '' }}
              </span>
            </template>
            <template #content>
              <div class="content-item keywords">
                <h3>Ключевые слова:</h3>
                <span v-for="keyWord in data.infoContent.keywords" :key="keyWord">
                  {{ keyWord }}{{ (data.infoContent.keywords.length  > 1 && keyWord != data.infoContent.keywords[data.infoContent.keywords.length -1]) ? ', ' : '' }}
                </span>
              </div>
              <div class="abstract">
                <h3>Описание:</h3>
                {{ data.infoContent.short_abstract }}
              </div>

              <div class="content-item metas">
                <h3>Теги:</h3>
                <span v-for="meta in data.infoContent.meta" :key="meta">
                  <div v-if="Object.keys(meta).length>0">
                    <div v-for="metaKey in Object.keys(meta)" :key="metaKey" class="text">
                      {{ metaKey }} - {{ meta[metaKey] }}{{ (data.infoContent.meta.length  > 1 && metaKey != data.infoContent.meta[data.infoContent.meta.length -1]) ? ', ' : '' }}'
                      <br>
                    </div>
                  </div>
                  <!-- {{ (data.infoContent.meta.length  > 1 && metaKey != data.infoContent.meta[data.infoContent.meta.length -1]) ? ', ' : '' }} -->
                </span>
              </div>
                <!-- Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt -->
                <!-- quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas! -->
            </template>
            <!-- <template #footer>
                <Button icon="pi pi-check" label="Save" />
                <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" style="margin-left: .5em" />
            </template> -->
          </Card>
        </div>

      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class WelcomeView extends Vue {
  timer;
  selectType = 'Публикаций';
  selectedValue = {};
  inputText;
  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

  get getFilters () {
    return this.$store.state.Data.filters
  }

  get getfilterValues () {
    return this.$store.state.Data.filterValues
  }

  get getfilterValueResult () {
    return this.$store.state.Data.filterValueResult
  }

  searchTimeOut () {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.timer = setTimeout(() => {
      this.$store.dispatch('searchByText', { text: this.inputText })
    }, 800)
  }

  fetchInfoBy (fitlerId, filterValue) {
    this.$store.dispatch('fetchInfoBy', { selected_filter_value: filterValue })
    this.inputText = ''
    // this.states.loggingIn = false
    // setTimeout(() => {
    //   this.$router.push({ name: 'catalog' })
    // }, 500)
  }

  mounted () {
    this.$store.dispatch('fetchData', { filter_data: true })
  }
}
</script>
<style >
.welcome .wrapper {
  width: 75vw;
  margin-left: auto;
  margin-right: auto;
}

.welcome .wrapper section{
  margin-top: 2rem;
}
.welcome .wrapper section h1{
  color: var(--text-color);
}

#filter_list {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}
#filter_list .filter_item {
  /* flex: 20px auto auto; */
  align-self: flex-start;
  margin: .3rem 12px 0 0;
  /* flex-basis: 50%; */
  /* margin: .2rem 0; */
}

#info_content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
#info_content .p-card {
  flex: 0 0 32%;
  /* width: 25vw; */
  /* justify-self: stretch; */
  /* flex: 1 1; */
  /* min-width: 20vw; */
  /* fleex-basis: 30vw; */
  margin: 1rem 0;
}
#info_content .p-card .p-card-body .p-card-title {
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
#info_content .p-card-header .img-preview {
  /* width: 12rem; */
}
#info_content .p-card .p-card-body .p-card-content .p-card-subtitle {
  margin: 0;
}
#info_content .p-card .p-card-body .p-card-content h3{
  font-weight: 600;
}
#info_content .p-card .p-card-body .p-card-content > div:not(:last-child)  {
  margin-bottom: 1rem;
}
</style>
