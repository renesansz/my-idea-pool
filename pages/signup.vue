<template>
  <v-container id="signup-page">
    <v-row justify="space-around">
      <v-col class="text-center" cols="12">
        <h1>Sign Up</h1>
      </v-col>
      <v-col cols="12">
        <v-form ref="form" v-model="formValid" lazy-validation @submit.prevent="onFormSubmit">
          <v-text-field
            v-model="form.name"
            color="success"
            placeholder="Name"
            :rules="validation.nameRules"
          />
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
        <v-btn color="success" :loading="isLoading" tile block @click="onFormSubmit">Sign Up</v-btn>
      </v-col>
      <v-col offset="1" cols="7">
        Already have an account? <nuxt-link class="success--text" to="/login">Login</nuxt-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getErrorReason } from '@/utils/response'
import signupValidation from '@/validations/signup'

export default {
  auth: 'guest',
  data: () => ({
    validation: signupValidation,
    formValid: false,
    form: {
      name: '',
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

        const payload = Object.assign({}, this.form)

        this.$axios
            .post('/users', payload)
            .then(() => {
              delete payload.name
              this.loginUser(payload)
            })
            .catch(this.onSigneupError)
            .finally(() => {
              this.isLoading = false
            })
      }
    },
    loginUser(payload) {
      this.$auth.loginWith('local', { data: payload })
    },
    onSigneupError(err) {
      // TODO: implement user notification
      this.errorMessage = getErrorReason(err)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~/assets/pages/login.scss"
</style>
