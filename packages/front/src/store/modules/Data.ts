/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'

export default {
  state: {
    data: {
      filterGroup: [],
      filters: []
    }
  },
  mutations: {
    fetchData (state, payload) {
      state.filterGroup = payload.filter_group ?? []
      state.filters = payload.filters ?? []
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
    }

  }
}
