<script lang="ts">
import HeaderComponent from './components/Layout/HeaderComponent.vue' // @ is an alias to /src
import { Options, Vue } from 'vue-class-component'
import UserType from './types/UserType'
@Options({
  components: {
    HeaderComponent
  }
})

export default class WelcomeView extends Vue {
  states = {
    loggingIn: false,
    registering: false
  }

  authUser = {} as UserType

  get isLoggedIn () {
    return this.$store.state.AuthUser.loggedIn
  }

  get getUser () {
    return this.$store.state.AuthUser.userSession
  }

  login (event) {
    event.preventDefault()
    console.log(123)
    this.$store.dispatch('authorizeUser', this.authUser)
    this.states.loggingIn = false
    setTimeout(() => {
      this.$router.push({ name: 'catalog' })
    }, 500)
  }

  resetState () {
    this.authUser = {} as UserType
  }
}
</script>

<template>
  <HeaderComponent @loggingIn="states.loggingIn = true" :user="getUser" :logedIn="isLoggedIn" />

  <router-view />

  <Dialog id="login-pop-up" header="Авторизация" v-model:visible="states.loggingIn" @hide="resetState">
    <form v-on:submit="login" class="login">

      <div class="form-field">
        <label for="email">E-mail</label>
        <InputText class="p-inputtext-sm" id="email" minlength="3" type="email" v-model="authUser.email" />
      </div>

      <div class="form-field">
        <label for="password">Пароль</label>
        <Password class="p-inputtext-sm" id="password" :feedback="false" v-model="authUser.password" />
      </div>

      <Button class="p-button-sm" label="Save" type="submit" />
    </form>

  </Dialog>

</template>

<style>
#login-pop-up .p-dialog-header {
  padding: .7rem 1.5rem;
}
#login-pop-up .p-dialog-content form .p-button {
  width: 100%;
}

#login-pop-up .p-dialog-content .form-field {
  margin-bottom: .7rem;
  display: flex;
  flex-direction: column;
}
#login-pop-up .p-dialog-content .form-field input {
  width:20vw;
}

</style>
