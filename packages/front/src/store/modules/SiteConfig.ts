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
function addSiteQuery (query, payload): string {
  if (payload.siteId) {
    if (query.includes('?')) {
      query += '&'
    } else {
      query += '?'
    }
    query += `siteId=${payload.siteId}`
  }
  return query
}
export default {
  namespaced: true,
  methods: {
  },
  state: {
    filters: [],
    suggestions: [],
    suggestionData: {},
    tagTypeFilter: [],
    categoriesFilter: [],
    siteFilter: [],
    tagTypeFilterData: []
  },
  mutations: {
    fetchGroupCollectedData (state, payload) {
      state.filters = payload.filters
      state.categoriesFilter = payload.categoriesFilter
      state.tagTypeFilter = payload.tagTypeFilter
      state.siteFilter = payload.siteFilter
    },
    searchSuggestonsByText (state, payload) {
      state.suggestions = payload
    },
    searchDataByText (state, payload) {
      const suggestionData = payload.suggestionData
      for (const [index, item] of Object.entries(suggestionData)) {
        suggestionData[index].data = mapToGroup((item as any).data)
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
      let url = `${process.env.VUE_APP_API_URL}/site/filterInfo`
      url = addSiteQuery(url, payload)
      const response = await axios({
        method: 'get',
        data: payload,
        url,
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
      let url = `${process.env.VUE_APP_API_URL}/site/searchByText?text=${payload.text}`
      url = addSiteQuery(url, payload)
      const response = await axios({
        method: 'get',
        url,
        withCredentials: true
      })
      await commit('searchSuggestonsByText', response.data.data)
    },

    async searchDataByText ({ commit }, payload) {
      let url = `${process.env.VUE_APP_API_URL}/site/searchDataByText?text=${payload.text}`
      url = addSiteQuery(url, payload)
      console.log(payload)
      const response = await axios({
        method: 'get',
        url,
        withCredentials: true
      })
      await commit('searchDataByText', response.data.data)
    },

    async searchSuggestonsByTagType ({ commit }, payload) {
      let url = `${process.env.VUE_APP_API_URL}/site/searchDataByTagType?tag_type_code=${payload.tag_type_code}`
      url = addSiteQuery(url, payload)
      const response = await axios({
        method: 'get',
        url,
        withCredentials: true
      })
      await commit('searchSuggestonsByTagType', response.data.data)
    }
  }
}
