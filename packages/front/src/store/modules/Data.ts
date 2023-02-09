/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'

export default {
  state: {
    data: {}
  },
  mutations: {
    fetchApiData (state, payload) {
      state.data = {}
    }
  },
  actions: {
    async fetchApiData ({ commit }): Promise<void> {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}v1/scenarios`,
        withCredentials: true
      })
      await commit('fetchApiData', response.data.data)
    }

  }
}
