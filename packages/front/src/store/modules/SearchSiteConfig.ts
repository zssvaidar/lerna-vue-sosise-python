import axios from 'axios'

export default {
  namespaced: true,
  state: {
    domainData: {},
    domainUrlGroupData: {},
    groupData: {},
    groupTags: {}
  },
  mutations: {
    fetchDomainData (state, payload) {
      state.domainData = payload.domainData
      state.domainUrlGroupData = payload.domainUrlGroupData
    },
    fetchUrlGroupData (state, payload) {
      state.groupData = payload.groupData
      state.groupTags = payload.groupTag
    }
  },
  actions: {
    async fetchDomainData ({ commit }, payload): Promise<any> {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/parser/domain/${payload.id}`,
        withCredentials: true
      })
      await commit('fetchDomainData', response.data.data)
    },

    async fetchUrlGroupData ({ commit }, payload): Promise<any> {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/parser/domain/${payload.id}/group/${payload.group_id}`,
        withCredentials: true
      })
      await commit('fetchUrlGroupData', response.data.data)
    }
  }
}
