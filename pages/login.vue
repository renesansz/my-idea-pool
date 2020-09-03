<template>
  <v-layout column justify-center align-center>
    <v-flex xs12>LOG IN</v-flex>
    <v-flex xs12>
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
        <v-btn color="success" type="submit" :loading="isLoading" tile>LOG IN</v-btn>
        <nuxt-link to="/signup">Sign Up</nuxt-link>
      </v-form>
    </v-flex>
  </v-layout>
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
      console.error(`Login error: ${ getErrorReason(err) }`)
    },
  },
}
</script>
