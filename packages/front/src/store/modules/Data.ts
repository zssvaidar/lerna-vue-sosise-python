/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { FilterType, FilterValueType } from '@/types/Filters'
import { Module } from 'vuex'
import { MyState } from '..'

const theModule: Module <MyState, MyState> = {
  state: {
    filters: [],
    filterValues: {},
    filterValueResult: []
  },
  mutations: {
    fetchData (state, payload) {
      state.filters = payload.filters ?? []
      const filterValues: FilterValueType[] = payload.filter_value

      filterValues.forEach(value => {
        if (!Array.isArray(state.filterValues[value.filterId])) {
          state.filterValues[value.filterId] = []
          console.log(value.filterId)
        }
        state.filterValues[value.filterId].push(value)
      })
    },
    fetchInfoBy (state, payload) {
      state.filterValueResult = payload.selected_filter_value_results
    },
    searchByText (state, payload) {
      state.filterValueResult = payload.search_text_results
    }
  },
  actions: {
    async fetchData ({ commit }, data): Promise<void> {
      const params = new URLSearchParams(data).toString()
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}data?${params}`,
        withCredentials: true
      })
      await commit('fetchData', response.data.data)
    },
    async fetchInfoBy ({ commit }, data): Promise<void> {
      const params = new URLSearchParams(data).toString()
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}data?${params}`,
        withCredentials: true
      })
      await commit('fetchInfoBy', response.data.data)
    },
    async searchByText ({ commit }, data): Promise<void> {
      const params = new URLSearchParams(data).toString()
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}data/search?${params}`,
        withCredentials: true
      })
      await commit('searchByText', response.data.data)
    }
  }
}

export default theModule
