<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script>
import { UserType } from '@/types/UserType'
import logo from '@/assets/img/logo.png'

export default {
  props: {
    logedIn: {
      type: Boolean
    },
    user: {
      type: UserType
    }
  },
  emits: ['logging-in'],
  data () {
    return {
      logo,
      items: [
        {
          label: 'Главная',
          icon: 'pi pi-fw pi-home',
          to: '/'
        },
        {
          label: 'Поиск',
          icon: 'pi pi-fw pi-users',
          to: '/data-search',
          command: (event) => {
            //
          }
        },
        {
          label: 'Пойск данных',
          visible: (args) => this.getUser().isAdmin ?? false,
          icon: 'pi pi-fw pi-database',
          to: '/search-engine',
          command: (event) => {
            //
          }
        },
        {
          label: 'Профиль',
          visible: (args) => this.logedIn,
          icon: 'pi pi-fw pi-user',
          items: [
            {
              label: 'Log out',
              icon: 'pi pi-fw pi-sign-out',
              command: (event) => {
                this.logout()
              }
            }
          ]
        },
        {
          label: 'Войти',
          icon: 'pi pi-fw pi-sign-in',
          command: (event) => {
            this.$emit('logging-in')
          },
          visible: (args) => !this.logedIn
        }
      ]
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logoutUser')
      this.$router.push({ name: 'welcome' })
    },
    getUser () {
      return this.$store.state.AuthUser.userSession
    }
  }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <Menubar :model="items">
        <template #start>
          <a href="/">
            <div class="img-wrap">
              <img id="logo"  :src="logo">
            </div>
            <div id="title">RECOMMENDATION SYSTEM BASED<br>
               ON SCIENTIFIC DATA</div>
          </a>
        </template>
      </Menubar>
    </div>
  </header>
</template>

<style>
.wrapper {
    width: 75vw;
    margin-left: auto;
    margin-right: auto;
}
header .p-menubar-root-list {
  height: 4rem!important;
}
header .p-menubar-root-list, .p-menubar-button {
  margin-left: auto !important;
}

.p-menubar-start a {
  display: flex;
  flex: column;
  justify-content: space-around;
  text-decoration: none;
  color: var(--text-color);
}
.p-menubar-start a div{
  margin: auto;
  margin-right:.6rem;
  margin-left: .6rem;
}

.img-wrap {
  width: 2rem;
  height: 2rem;
  position: relative;
  display: inline-block;
  overflow: hidden;
  margin: 0;
}
#title {
  font-weight: 600;
}
#logo {
  max-width:100%;
  display: block;
}
</style>
