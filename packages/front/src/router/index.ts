import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import store from '@/store'
import PageNotFound from '@/views/PageNotFound.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import SearchView from '@/views/SearchView.vue'
import ApiView from '@/views/Dashboard/ApiView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'welcome',
    component: WelcomeView
  },
  {
    path: '/data-search',
    name: '',
    component: SearchView,
    meta: { requiresAuth: true }
  },
  {
    path: '/api-list',
    name: '',
    component: ApiView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:catchAll(.*)',
    component: PageNotFound
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

function parseJSON (data: any) {
  return JSON.parse(data)
}

function isLoggedIn (this: any) {
  const session = parseJSON(localStorage.getItem('session'))
  if (session !== null) {
    store.dispatch('setUser', session.userSession)
    return session.loggedIn
  }

  return false
}

function authToken (this: any) {
  const session = parseJSON(localStorage.getItem('session'))
  store.dispatch('authToken', session.userSession)
}

router.beforeEach((to, from, next) => {
  if (isLoggedIn()) {
    next()
    authToken()
  } else {
    if (to.meta.requiresAuth) {
      next({
        name: 'welcome',
        params: { nextUrl: to.fullPath }
      })
    }
  }

  next()
})
export default router
