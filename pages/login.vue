<template>
  <v-container id="login-page">
    <v-row justify="space-around">
      <v-col class="text-center" cols="12">
        <h1>Log In</h1>
      </v-col>
      <v-col cols="12">
        <v-form ref="form" v-model="formValid" lazy-validation @submit.prevent="onFormSubmit">
          <v-text-field
            v-model="form.email"
            color="success"
            placeholder="Email"
            type="email"
            :rules="validation.emailRules"
          />
          <v-text-field
            v-model="form.password"
            color="success"
            placeholder="Password"
            type="password"
            :rules="validation.passwordRules"
          />
        </v-form>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="4">
        <v-btn color="success" :loading="isLoading" tile block @click="onFormSubmit">LOG IN</v-btn>
      </v-col>
      <v-col offset="1" cols="7">
        Don't have an account? <nuxt-link class="success--text" to="/signup">Sign Up</nuxt-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getErrorReason } from '@/utils/response'
import loginValidation from '@/validations/login'

export default {
  auth: 'guest',
  data: () => ({
    validation: loginValidation,
    formValid: false,
    form: {
      email: '',
      password: '',
    },
    isLoading: false,
    errorMessage: '',
  }),
  methods: {
    onFormSubmit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.$auth
            .loginWith('local', { data: this.form })
            .catch(this.onLoginError)
            .finally(() => {
              this.isLoading = false
            })
      }
    },
    onLoginError(err) {
      // TODO: implement user notification
      this.errorMessage = getErrorReason(err)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~/assets/pages/login.scss"
</style>
