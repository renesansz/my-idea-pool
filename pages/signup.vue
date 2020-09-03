<template>
  <v-layout column justify-center align-center>
    <v-flex xs12>SIGN UP</v-flex>
    <v-flex xs12>
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
        <v-btn color="success" type="submit" :loading="isLoading" tile>Sign Up</v-btn>
        <nuxt-link to="/login">Login</nuxt-link>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
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
  }),
  methods: {
    onFormSubmit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true

        const payload = Object.assign({}, this.form)

        this.$axios
            .post('/users', payload)
            .then(this.onSignupSuccess(payload))
            .catch(this.onSigneupError)
            .finally(() => {
              this.isLoading = false
            })
      }
    },
    onSignupSuccess(payload) {
      delete payload.name

      this.$auth.loginWith('local', { data: payload })
    },
    onSigneupError(err) {
      console.log(err)
    },
  },
}
</script>
