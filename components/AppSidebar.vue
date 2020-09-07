<template>
  <div id="app-sidebar">
    <v-btn class="d-lg-none" right bottom fixed fab @click="showNav=!showNav">
      <v-icon v-if="!showNav">{{ icon.mdiMenu }}</v-icon>
      <v-icon v-else>{{ icon.mdiClose }}</v-icon>
    </v-btn>
    <v-navigation-drawer v-model="showNav" color="#05a844" width="200px" fixed dark app>
      <v-container class="px-7">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <picture class="logo">
                <source media="(min-width:768px)" srcset="/img/IdeaPool_icon@2x.png">
                <img src="/img/IdeaPool_icon.png" />
              </picture>
              <div class="text-sm-center mt-3">The Idea Pool</div>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="$auth.loggedIn" class="my-9" />
          <v-list-item v-if="$auth.loggedIn" class="text-sm-center">
            <v-list-item-content>
              <v-avatar class="ma-auto" size="64" max-width="64">
                <v-img
                  :lazy-src="avatarPlaceholder"
                  :src="$auth.user.avatar_url"
                />
              </v-avatar>
              <p class="mt-2">{{ $auth.user.name }}</p>
              <v-btn text color="error" :loading="isLoading" @click="doLogout">Logout</v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mdiMenu, mdiClose } from '@mdi/js'

import { avatarPlaceholder } from '@/constants/placeholder'

export default {
  data: () => ({
    icon: {
      mdiMenu,
      mdiClose,
    },
    avatarPlaceholder,
    isLoading: false,
    showNav: true,
  }),
  methods: {
    doLogout() {
      const args = {
        data: {
          refresh_token: this.$auth.$storage.getState(`_refresh_token.${this.$auth.$state.strategy}`),
        },
      }

      this.isLoading = true
      this.$auth
          .logout(args)
          .finally(() => {
            this.isLoading = false
          })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~/assets/components/AppSidebar";
</style>
