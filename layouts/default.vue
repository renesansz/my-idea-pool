<template>
  <v-app dark>
    <app-sidebar />
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppSidebar from '~/components/AppSidebar'

export default {
  components: { AppSidebar },
}
</script>
