import axios from 'axios'

function listToTree (list: any[]) {
  let map = {}; let node; const roots: any[] = []; let i
  const set = new Set()

  for (i = 0; i < list.length; i += 1) {
    map[list[i].tagId] = i // initialize the map
    list[i].children = [] // initialize the children
    list[i].key = list[i].tagId // initialize the children

    set.add(list[i].depth)
  }

  console.log(list.length)
  const depthSet = [...set]

  for (let index = depthSet.length - 1; index >= 0; index -= 1) {
    const depth = Number(depthSet[index])

    i = list.length - 1
    while (i >= 0) {
      node = list[i]
      if (node && node.children.length < 1 && node.text.length < 10 && node.depth > depth - 1) {
        list.splice(i, 1)
      } else {
        i -= 1
      }
    }

    map = {}
    for (i = 0; i < list.length; i += 1) {
      map[list[i].tagId] = i
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i]
      if (node.parentId && node.depth === depth) {
        list[map[node.parentId]].children.push(node)
      }
    }
  }
  console.log(list.length)

  for (let i = list.length - 1; i >= 0; i -= 1) {
    // for (i = 0; i < list.length; i += 1) {
    node = list[i]
    if (node.parentId) {
      console.log()
    } else {
      roots.push(node)
    }
  }
  return roots
}

export default {
  namespaced: true,
  state: {
    domainData: {},
    domainUrlGroupData: [],
    groupData: {},
    groupTags: [],
    groupTagNodes: [],
    groupTagsToCollect: [],
    tagDataTypes: [],

    pageUrls: [],
    pagesData: {}
  },
  mutations: {
    fetchDomainData (state, payload) {
      state.domainData = payload.domainData
      state.domainUrlGroupData = payload.domainUrlGroupData
    },
    fetchUrlGroupData (state, payload) {
      // console.log(payload.urlGroupTag)
      state.groupTagNodes = listToTree(payload.urlGroupTag)
      state.groupData = payload.domainUrlGroup
      state.groupTags = payload.urlGroupTag
      state.groupTagsToCollect = payload.groupTagsToCollect
      state.tagDataTypes = payload.tagDataTypes
    },
    fetchGroupCollectedData (stage, payload) {
      stage.pageUrls = payload.pageUrls
      stage.pagesData = payload.pagesData
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
    },

    async updateGroupSelectedTags ({ commit }, payload) {
      const response = await axios({
        method: 'put',
        data: payload,
        url: `${process.env.VUE_APP_API_URL}/parser/domain/${payload.id}/group/${payload.group_id}`,
        withCredentials: true
      })
    },

    async updateGroupReady ({ commit }, payload) {
      const response = await axios({
        method: 'put',
        data: payload,
        url: `${process.env.VUE_APP_API_URL}/parser/domain/${payload.id}/group/${payload.group_id}/ready`,
        withCredentials: true
      })
    },

    async fetchGroupCollectedData ({ commit }, payload) {
      const response = await axios({
        method: 'get',
        data: payload,
        url: `${process.env.VUE_APP_API_URL}/parser/domain/${payload.id}/group/${payload.group_id}/collectedData`,
        withCredentials: true
      })
      await commit('fetchGroupCollectedData', response.data.data)
    },

    async setGroupTagType ({ commit }, payload) {
      await axios({
        method: 'put',
        data: payload,
        url: `${process.env.VUE_APP_API_URL}/parser/domain/${payload.id}/group/${payload.group_id}/groupTag/${payload.group_tag_id}`,
        withCredentials: true
      })
    }

  }
}
