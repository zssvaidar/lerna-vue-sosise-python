<template>
    <div class="data-api">
        <div class="wrapper">
            <section>

                <div class="api-list">
                    <ul>
                        <li v-for="api in apis" :key="api">
                            {{ api }}
                        </li>
                        <!-- <li>
                            <a href="" @click="{apiIndex=1}" ></a>
                        </li> -->
                    </ul>
                </div>
                <div class="api" v-show="apiIndex">
                    <!-- Render api result -->
                </div>
            </section>
        </div>
    </div>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'

export default class ApiView extends Vue {
    apiIndex=false;
    apis = ['first']
    /**
     * Data from api
     */
  /**
     * Update render api result
     */
}
</script>

<style scoped>

.data-api .wrapper {
  width: 75vw;
  margin-left: auto;
  margin-right: auto;
}
.data-api .wrapper section {
  margin-top: 2rem;
}
</style>
