import axios from 'axios'

function listToTree (list: any[]) {
  const map = {}; let node; const roots: any[] = []; let i

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i // initialize the map
    list[i].children = [] // initialize the children
    list[i].key = list[i].id // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i]
    if (node.parentId !== 0) {
      list[map[node.parentId]].children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

function listToMapByValue1 (list: any[], value: string) {
  const map = {}

  for (let i = 0; i < list.length; i += 1) {
    if (map[list[i][value]]) {
      map[list[i][value]].push(list[i])
    } else {
      map[list[i][value]] = [list[i]]
    }
  }

  return map
}

function listToMapByValue2 (list: any[], value: string) {
  const map = {}

  for (let i = 0; i < list.length; i += 1) {
    map[list[i][value]] = list[i]
  }

  return map
}

function listToMapByValue3 (list: any[], value1: string, value2: string) {
  const map = {}

  for (let i = 0; i < list.length; i += 1) {
    const V1 = list[i][value1]
    const V2 = list[i][value2]

    if (!(V1 in map)) {
      map[V1] = {}
    }

    if (map[V1] && map[V1][V2]) {
      map[V1][V2].push(list[i])
    } else {
      map[V1][V2] = [list[i]]
    }
  }

  return map
}

export default {
  namespaced: true,
  state: {
    domains: [],
    domainMapUrls: {},
    domainMap: {},
    domainMapUrlGroups: {},
    domainMapUrlGroupCount: 0
  },
  mutations: {
    fetchApiData (state, payload) {
      state.domains = payload.list
      // state.scenarioNodes = listToTree(payload.scenarios)
      // state.scenarioMap = listToObjectMap(payload.scenarios)
    },
    fetchUrlData (state, payload) {
      state.domainMapUrls = listToMapByValue1(payload.list, 'domainId')
      state.domainMap = listToMapByValue2(state.domains, 'id')
    },
    fetchUrlGroupData (state, payload) {
      console.log(payload)
      const domainMapUrlGroups = listToMapByValue3(payload.list, 'domainId', 'split')
      state.domainMapUrlGroups = domainMapUrlGroups
      state.domainMapUrlGroupCount = payload.list.length
    }
  },
  actions: {
    async fetchApiData ({ commit }): Promise<void> {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/domainurls`,
        withCredentials: true
      })
      await commit('fetchApiData', response.data)
    },
    async createDomainUrl ({ commit }, payload): Promise<void> {
      const response = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/domainurls`,
        data: payload,
        withCredentials: true
      })
    },
    async deleteDomainUrl ({ commit }, payload): Promise<void> {
      const response = await axios({
        method: 'delete',
        url: `${process.env.VUE_APP_API_URL}/domainurls`,
        data: payload,
        withCredentials: true
      })
    },

    async fetchUrlData ({ commit }, payload): Promise<void> {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/parser/domain/${payload.id}/urls`,
        withCredentials: true
      })
      await commit('fetchUrlData', response.data.data)
    },

    async fetchUrlGroupData ({ commit }, payload): Promise<void> {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/parser/domain/${payload.id}/urlGroups`,
        withCredentials: true
      })
      await commit('fetchUrlGroupData', response.data.data)
    },

    async startUrlCollect ({ commit }, payload): Promise<void> {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/crawler/runscript?id=${payload.id}&script=links`,
        withCredentials: true
      })
    },

    async startUrlGroup ({ commit }, payload): Promise<void> {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/crawler/runscript?id=${payload.id}&script=groups`,
        withCredentials: true
      })
    },

    async startGroupUrlTagCollection ({ commit }, payload): Promise<void> {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/crawler/runscript?id=${payload.id}&script=group_tags`,
        withCredentials: true
      })
    }

  }
}
