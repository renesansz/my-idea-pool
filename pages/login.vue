<template>
  <v-container class="px-16">
    <v-row justify="space-around">
      <v-col cols="12">LOG IN</v-col>
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
          <v-btn color="success" type="submit" :loading="isLoading" tile>LOG IN</v-btn>
          <p>
            Don't have an account? <nuxt-link to="/signup">Sign Up</nuxt-link>
          </p>
        </v-form>
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
