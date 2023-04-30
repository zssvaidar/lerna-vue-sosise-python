import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import store from '@/store'
import PageNotFound from '@/views/PageNotFound.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import SearchView from '@/views/SearchView.vue'
import SearchEngineView from '@/views/Dashboard/SearchEngineView.vue'
import UrlGroupComponent from '@/components/UrlGroupComponent.vue'

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
    path: '/search-engine',
    name: '',
    component: SearchEngineView,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'site=:siteId/split=:split/group_id=:groupId',
        component: UrlGroupComponent,
        props: true,
        name: 'group',
        meta: {
          showModal: true
        }
      }
    ]
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
})
export default router
