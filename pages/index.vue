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
import IdeasList from '~/components/IdeasList.vue'

export default {
  middleware: 'auth',
  components: {
    IdeasList,
  },
}
</script>
