<template>
  <v-container class="px-md-16 px-lg-16">
    <v-row justify="space-around">
      <v-col cols="12">
        <ideas-list />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
}
</script>
