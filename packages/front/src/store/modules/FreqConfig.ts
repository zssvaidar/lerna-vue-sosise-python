import axios from 'axios'

export default {
  namespaced: true,
  state: {
    dataTagTexts: [],
    tagDataTypes: []
  },
  mutations: {
    fetchUrlGroupData (state, payload) {
      state.dataTagTexts = payload.dataTagTexts
      state.tagDataTypes = payload.tagDataTypes
    }

  },
  actions: {
    async fetchApiData ({ commit }, payload) {
      await axios({
        method: 'get',
        data: payload,
        url: `${process.env.VUE_APP_API_URL}/ml/model/siteText`,
        withCredentials: true
      })
    }

  }
}
