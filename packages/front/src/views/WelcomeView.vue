<template>
  <div class="welcome">
    <div class="wrapper">
      <section>
        <h1>Главная</h1>
        <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="inputText" type="text"  @keyup="searchTimeOut" placeholder="name, university, speciality" />
        </span>

        <div v-for="filter in getFilters" :key="filter">
          <!-- {{ getfilterValues[filter['filterId']] }} -->
          <Dropdown :options="getfilterValues[filter['filterId']]" v-model="selectedValue" v-on:change="fetchInfoBy(filter['filterId'], selectedValue['value'])" optionLabel="value" :placeholder="filter.name" />
        </div>

        {{ getfilterValueResult }}
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
export default class WelcomeView extends Vue {
  timer;
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
<style scoped>
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
</style>
