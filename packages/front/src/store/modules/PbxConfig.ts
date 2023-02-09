/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

interface ScenarioType {
    id: number;
    label: string;
    code: string;
    parentId: number;
    step: number;
    lang: string;
    response: string;
    comment: string;
    tokens: string[];

    icon: string;
    key: string
    children: any[]
}

function listToTree (list: ScenarioType[]) {
  const map = {}; let node; const roots: any[] = []; let i

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i // initialize the map
    list[i].children = [] // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i]
    if (node.parentId !== 0) {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parentId]].children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

function listToObjectMap (list: ScenarioType[]) {
  const map = {}

  for (let i = 0; i < list.length; i += 1) {
    map[list[i].id] = list[i]
  }

  return map
}

export default {
  state: {
    selectedLanguage: 'ru',
    expandedKeys: {},
    scenarioNodes: [],
    scenarioMap: [],
    languages: []
  },
  mutations: {
    setSelectedLanguage (state, payload) {
      state.selectedLanguage = payload
    },
    setExpandedKeys (state, payload) {
      state.expandedKeys = payload
    },
    fetchApiData (state, payload) {
      let languageScenarios = payload.scenarios.filter(scenario => scenario.lang === state.selectedLanguage)
      languageScenarios = languageScenarios.map(scenario => { return { /* icon: 'pi pi-fw p  pi-minus', */key: `${scenario.id}`, ...scenario } })

      state.scenarioMap = listToObjectMap(languageScenarios)
      state.scenarioNodes = listToTree(languageScenarios)
      state.languages = payload.languages
    },
    selectedLang (state, payload) {
      state.selectedLanguage = payload
    }
  },
  actions: {
    setSelectedLanguage ({ commit }, payload) {
      commit('setSelectedLanguage', payload)
    },
    setExpandedKeys ({ commit }, payload) {
      commit('setExpandedKeys', payload)
    },
    async fetchApiData ({ commit }): Promise<void> {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}v1/scenarios`,
        withCredentials: true
      })
      await commit('fetchApiData', response.data.data)
    },
    async editScenario ({ commit }, payload: ScenarioType) {
      const response = await axios({
        method: 'put',
        url: `${process.env.VUE_APP_API_URL}v1/scenarios/${payload.id}`,
        data: payload,
        withCredentials: true
      })
    },
    async createScenario ({ commit }, payload: ScenarioType) {
      const response = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}v1/scenarios`,
        data: payload,
        withCredentials: true
      })
    },
    async deleteScenario ({ commit }, payload: ScenarioType) {
      const response = await axios({
        method: 'delete',
        url: `${process.env.VUE_APP_API_URL}v1/scenarios/${payload}`,
        data: payload,
        withCredentials: true
      })
    },
    selectedLang ({ commit }, payload) {
      commit('selectedLang', payload)
    }
  }
}
