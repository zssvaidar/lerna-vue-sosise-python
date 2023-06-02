import { FilterType, FilterValueType } from '@/types/Filters'
import { createStore } from 'vuex'
import AuthUser from './modules/AuthUser'
import Data from './modules/Data'
import SearchConfig from './modules/SearchConfig'
import ParserConfig from './modules/ParserConfig'
import SiteConfig from './modules/SiteConfig'
import FreqConfig from './modules/FreqConfig'

export interface MyState {
  filters: FilterType[];
  filterValues: {
    [id: string]: FilterType[] };
  filterValueResult: any[]
}

const rootState: MyState = {
  filters: [],
  filterValues: {},
  filterValueResult: []
}

export default createStore({
  state: rootState,
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    AuthUser,
    Data: Data,
    searchconfig: SearchConfig,
    parserConfig: ParserConfig,
    siteConfig: SiteConfig,
    freqConfig: FreqConfig
  }
})
