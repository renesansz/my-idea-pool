<template>
  <v-app dark>
    <app-sidebar />
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import AppSidebar from '~/components/AppSidebar'

export default {
  components: { AppSidebar },
}
</script>
