<template>
  <div class="welcome">
    <div class="wrapper">
      <section>
        <h1>Главная</h1>
        <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText type="text"  @keyup="searchTimeOut" placeholder="name, university, speciality" />
        </span>
        {{ getFilters }}
        {{ getfilterGroup }}
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
export default class WelcomeView extends Vue {
  timer;
  get getFilters () {
    return this.$store.state.Data.filters
  }

  get getfilterGroup () {
    return this.$store.state.Data.filterGroup
  }

  searchTimeOut () {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.timer = setTimeout(() => {
      console.log(123)
    }, 800)
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
