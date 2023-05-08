import axios from 'axios'

export default {
  namespaced: true,
  state: {
    filters: [],
    suggestions: []
  },
  mutations: {
    fetchGroupCollectedData (state, payload) {
      state.filters = payload.filters
      state.categoriesFilter = payload.categoriesFilter
    },
    searchSuggestonsByText (state, payload) {
      console.log(payload)
      state.suggestions = payload
    },
    searchDataByText (state, payload) {
      console.log(payload)
    }
  },
  actions: {
    async fetchSearchFilter ({ commit }, payload) {
      const response = await axios({
        method: 'get',
        data: payload,
        url: `${process.env.VUE_APP_API_URL}/site/filterInfo`,
        withCredentials: true
      })
      await commit('fetchGroupCollectedData', response.data.data)
    },

    async startComputePageTagDataType ({ commit }, payload) {
      await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/site/group/${payload.group_id}/tagDataCalculate/runscript`,
        withCredentials: true
      })
    },

    async searchSuggestonsByText ({ commit }, payload) {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/site/searchByText?text=${payload.text}`,
        withCredentials: true
      })
      await commit('searchSuggestonsByText', response.data.data)
    },

    async searchDataByText ({ commit }, payload) {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/site/searchDataByText?text=${payload.text}`,
        withCredentials: true
      })
      await commit('searchDataByText', response.data.data)
    }
  }
}
