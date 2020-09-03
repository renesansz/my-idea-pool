export const emailRules = [
  v => !!v || 'E-mail is required',
  v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
]

export const passwordRules = [
  v => !!v || 'Password is required',
  v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) || 'Password must be at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number.',
]

export const nameRules = [
  v => !!v || 'Name is required'
]

export default {
  nameRules,
  emailRules,
  passwordRules
}
