import axios from 'axios'

function mapToGroup (list: any) {
  const result = {}
  for (const item of list) {
    if (result[item.name]) {
      result[item.name].push(item)
    } else {
      result[item.name] = [item]
    }
  }
  return result
}

export default {
  namespaced: true,
  state: {
    filters: [],
    suggestions: [],
    suggestionData: {},
    tagTypeFilter: [],
    categoriesFilter: [],
    tagTypeFilterData: []
  },
  mutations: {
    fetchGroupCollectedData (state, payload) {
      state.filters = payload.filters
      state.categoriesFilter = payload.categoriesFilter
      state.tagTypeFilter = payload.tagTypeFilter
    },
    searchSuggestonsByText (state, payload) {
      state.suggestions = payload
    },
    searchDataByText (state, payload) {
      const suggestionData = payload.suggestionData
      for (const [index, item] of Object.entries(suggestionData)) {
        suggestionData[index] = mapToGroup(item)
      }
      state.suggestionData = suggestionData
    },
    searchSuggestonsByTagType (state, payload) {
      const result: any[] = []
      for (const tagTypeFilterData of payload.tagTypeFilterData) {
        if (!tagTypeFilterData.text.includes('____')) {
          result.push(tagTypeFilterData)
        }
      }
      state.tagTypeFilterData = result
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
    },

    async searchSuggestonsByTagType ({ commit }, payload) {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/site/searchDataByTagType?tag_type_code=${payload.tag_type_code}`,
        withCredentials: true
      })
      await commit('searchSuggestonsByTagType', response.data.data)
    }
  }
}
