<template>
  <div class="register-user">
    <div class="wrapper">
      <div class="content">
        <section>

          <h1>Добавить пользователя</h1>
          <Card>
            <template #content>

              <form v-on:submit="register" class="register">
                <div class="form-field">
                  <label for="username">Имя</label>
                  <InputText
                    class="p-inputtext-sm"
                    id="username"
                    type="text"
                    v-model="authUser.username"
                  />
                </div>

                <div class="form-field">
                  <label for="email">E-mail</label>
                  <InputText
                    class="p-inputtext-sm"
                    id="email"
                    type="email"
                    minlength="4"
                    v-model="authUser.email"
                  />
                </div>

                <div class="form-field">
                  <label for="password">Пароль</label>
                  <Password
                    class="p-inputtext-sm"
                    id="password"
                    :feedback="false"
                    v-model="authUser.password"
                  />
                </div>

                <Button
                  class="p-button-sm"
                  label="Сохранить"
                  type="submit"
                />
              </form>
            </template>
          </Card>

        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Options, Vue } from 'vue-class-component'
import UserType from '../../types/UserType'

@Options({
  components: {}
})
export default class RegisterView extends Vue {
  authUser = {} as UserType;

  register (event) {
    event.preventDefault()
    this.$store.dispatch('registerUser', this.authUser)
    setTimeout(() => {
      this.$router.push({ name: 'user-list' })
    }, 500)
  }
}
</script>

<style scoped>
.register-user .wrapper {
  width: 75vw;
  margin-left: auto;
  margin-right: auto;
}

.register-user .wrapper .content {
  margin-left: 1rem;
  margin-right: 1rem;
}
.register-user .wrapper .content section{
  margin-top: 2rem;
}
.register-user .wrapper .content section .p-card {
  margin-top: .6rem;
  border: 1px solid var(--border-color);
  box-shadow: none;
  width: 25vw;
}
.register-user .wrapper .content section h1{
  color: var(--text-color);
}
.content form .form-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}
.content form .form-field label {
  margin-bottom: .4rem;
}
</style>
