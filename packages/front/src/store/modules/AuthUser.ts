/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import UserType from '@/types/UserType'
import axios from 'axios'

function stringifyJson (data: any) {
  return JSON.stringify(data)
}

export default {
  state: {
    userSession: {} as UserType,
    loggedIn: false,
    users: [] as UserType[]
  },
  mutations: {
    authorizeUser (state, payload) {
      state.userSession = payload
      state.loggedIn = true
      localStorage.setItem('session', stringifyJson({ loggedIn: state.loggedIn, userSession: state.userSession }))
    },
    logoutUser (state) {
      state.userSession = {} as UserType
      state.loggedIn = false
      localStorage.removeItem('session')
    },
    setUser (state, payload) {
      state.userSession = payload
      state.loggedIn = true
    },
    fetchUsers (state, payload) {
      state.users = payload.users
    }
  },
  actions: {
    async authToken ({ commit }, payload) {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}v1/auth`,
        withCredentials: true,
        data: payload
      }).catch(error => {
        if (error.response.data.message === 'Not authorized') {
          console.log('Not authorized')
          commit('logoutUser')
        }
      })
      // commit('authorizeUser', response.data.user)
    },
    async authorizeUser ({ commit }, payload) {
      console.log(payload)
      const response = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}v1/user/auth`,
        withCredentials: true,
        data: payload
      })
      commit('authorizeUser', response.data.user)
    },
    async registerUser ({ commit }, payload) {
      const response = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}v1/user/`,
        data: payload,
        withCredentials: true
      })
    },
    logoutUser ({ commit }) {
      console.log('logoutUser')
      commit('logoutUser')
    },
    setUser ({ commit }, payload) {
      commit('authorizeUser', payload)
    },

    async fetchUsers ({ commit }) {
      const response = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}v1/user`,
        withCredentials: true
      })
      commit('fetchUsers', response.data)
    },
    async deleteUser ({ commit }, payload) {
      const response = await axios({
        method: 'delete',
        url: `${process.env.VUE_APP_API_URL}v1/user/${payload}`,
        withCredentials: true
      })
    },
    async toggleUserActive ({ commit }, payload) {
      const response = await axios({
        method: 'put',
        url: `${process.env.VUE_APP_API_URL}v1/user/${payload}/active`,
        withCredentials: true
      })
    }
  }
}
