<template>
  <section id="ideas-list">
    <header>
      <v-container>
        <v-row no-gutters>
          <v-col cols="11">
            <p class="list-title">My ideas</p>
          </v-col>
          <v-col class="text-sm-right" cols="1">
            <v-btn class="add-btn cta-btn" :ripple="false" icon @click="addNewIdea">
              <picture>
                <source media="(min-width:768px)" srcset="/img/btn_addanidea@2x.png">
                <img src="/img/btn_addanidea.png" />
              </picture>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </header>
    <v-divider class="mb-9" />
    <v-simple-table v-if="!isEmptyList" class="ideas-table pl-5">
      <template v-slot:default>
        <thead>
          <tr>
            <th></th>
            <th class="text-center font-weight-regular table-header">Impact</th>
            <th class="text-center font-weight-regular table-header">Ease</th>
            <th class="text-center font-weight-regular table-header">Confidence</th>
            <th class="text-center table-header">Avg.</th>
            <th class="table-controls"></th>
          </tr>
        </thead>
        <tbody is="transition-group" name="fade">
          <tr v-for="(idea, idx) in sortedIdeas" :key="idx" class="idea-entry" :class="{ 'edit-mode': idea.editMode, 'invisible': idea.deleting }">
            <td class="idea-content">
              <v-text-field
                v-model="idea.content"
                :readonly="!idea.editMode"
                class="content-field pt-0"
              />
            </td>
            <td class="text-center">
              <v-text-field
                v-model.number="idea.impact"
                :readonly="!idea.editMode"
                :min="IMPACT_VALUE.MIN"
                :max="IMPACT_VALUE.MAX"
                type="number"
              />
            </td>
            <td class="text-center">
              <v-text-field
                v-model.number="idea.ease"
                :readonly="!idea.editMode"
                :min="EASE_VALUE.MIN"
                :max="EASE_VALUE.MAX"
                type="number"
              />
            </td>
            <td class="text-center">
              <v-text-field
                v-model.number="idea.confidence"
                :readonly="!idea.editMode"
                :min="CONFIDENCE_VALUE.MIN"
                :max="CONFIDENCE_VALUE.MAX"
                type="number"
              />
            </td>
            <td class="text-center">
              <v-text-field
                v-model.number="idea.avgRating"
                type="number"
                readonly
              />
            </td>
            <td class="controls text-center">
              <div v-if="idea.editMode">
                <v-btn text small :loading="idea.saving" :disabled="idea.deleting" @click="saveIdea(idea.id)">
                  <img src="img/Confirm_V.png" />
                </v-btn>
                <v-btn text small :loading="idea.deleting" :disabled="idea.saving" @click="deleteIdea(idea.id)">
                  <img src="img/Cancel_X.png" />
                </v-btn>
              </div>
              <div v-else>
                <v-btn text small :disabled="idea.deleting" @click="toggleEditMode(idea.id)">
                  <img src="img/pen.png" />
                </v-btn>
                <v-btn text small :loading="idea.deleting" :disabled="idea.saving" @click="deleteIdea(idea.id)">
                  <img src="img/bin.png" />
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <infinite-loading @infinite="infiniteHandler">
      <div slot="no-more"></div>
      <div slot="no-results"></div>
    </infinite-loading>
    <div v-if="isEmptyList" class="empty-list-message">
      <picture>
        <source media="(min-width:768px)" srcset="/img/bulb@2x.png">
        <img src="/img/bulb.png" />
      </picture>
      <p class="mt-6">Got Ideas?</p>
    </div>
    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card class="confirm-delete-dialog">
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text class="text-center">
          This idea will be permanently deleted.
        </v-card-text>
        <v-card-actions class="px-12">
          <v-row>
            <v-col>
              <v-btn
                color="rgba(42,56,66,1)"
                text
                block
                @click="cancelDelete">
                Cancel
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                color="green darken-1"
                text
                block
                @click="deleteIdea(deleteIdx)">
                OK
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

import { initializeListWithModel } from '@/utils/model'
import Idea, {
  IMPACT_VALUE,
  EASE_VALUE,
  CONFIDENCE_VALUE
} from '@/models/Idea'

export default {
  components: {
    InfiniteLoading,
  },
  data: () => ({
    IMPACT_VALUE,
    EASE_VALUE,
    CONFIDENCE_VALUE,
    ideas: [],
    ideasCache: {},
    page: 1,
    isFetching: false,
    deleteDialog: false,
    deleteIdx: null,
  }),
  computed: {
    hasUnsavedNewIdea() {
      return this.ideas.find(i => i.editMode && i.id === null) !== undefined
    },
    isEmptyList() {
      return this.ideas.length === 0 && !this.isFetching
    },
    sortedIdeas() {
      return this.ideas
                 .slice()
                 .sort((a, b) => {
                    if (a.editMode || b.editMode) return 0
                    return b.avgRating - a.avgRating
                 })
    }
  },
  methods: {
    getItemIndex (id) {
      return this.ideas.findIndex(i => i.id === id)
    },
    addNewIdea() {
      if (!this.hasUnsavedNewIdea) {
        this.ideas.splice(0, 0, new Idea({ editMode: true }))
      }
    },
    deleteIdea(id) {
      const idx = this.getItemIndex(id)
      const idea = this.ideas[idx]

      if (idea.id) {
        if (idea.editMode) {
          this.toggleEditMode(idea.id)
          return
        }
        if (this.deleteIdx === null) {
          this.deleteDialog = true
          this.deleteIdx = idx
          return
        }

        idea.deleting = true
        this.deleteDialog = false
        this.$ideasRepository
            .delete(idea.id)
            .then(() => {
              this.deleteIdx = null
            })
            .finally(() => {
              idea.deleting = false
            })
        setTimeout(() => {
          this.ideas.splice(idx, 1)
        }, 300)
      } else {
        this.ideas.splice(idx, 1)
      }
    },
    toggleEditMode(id) {
      const idx = this.getItemIndex(id)
      const idea = this.ideas[idx]

      if (idea.id !== null) {
        if (idea.id in this.ideasCache) {
          const cache = Object.assign({}, this.ideasCache[idea.id])

          idea.impact = cache.impact
          idea.content = cache.content
          idea.ease = cache.ease
          idea.confidence = cache.confidence

          delete this.ideasCache[idea.id]
        } else {
          this.ideasCache[idea.id] = Object.assign({}, idea)
        }
      }

      idea.editMode = !idea.editMode
    },
    cancelDelete() {
      this.deleteDialog = false
      this.deleteIdx = null
    },
    saveIdea(id) {
      const idx = this.getItemIndex(id)
      const idea = this.ideas[idx]

      idea.saving = true

      if (idea.id === null) {
        this.$ideasRepository
            .create(idea.payload)
            .then((res) => {
              idea.id = res.data.id
              idea.created_at = res.data.created_at
              idea.editMode = false
            })
            .finally(() => {
              idea.saving = false
            })
      } else {
        this.$ideasRepository
            .update(idea.id, idea.payload)
            .then((res) => {
              delete this.ideasCache[idea.id]
              idea.editMode = false
            })
            .finally(() => {
              idea.saving = false
            })
      }
    },
    fetchData() {
      return new Promise((resolve, reject) => {
        const query = { page: this.page }

        this.isFetching = true
        this.$ideasRepository
            .fetch(query)
            .then((res) => (resolve(res.data)))
            .catch((err) => (reject(err)))
            .finally(() => {
              this.isFetching = false
            })
      })
    },
    async infiniteHandler($state) {
      try {
        const response = await this.fetchData()

        if (response) {
          this.ideas = this.ideas.concat(initializeListWithModel(response, Idea))

          if (response.length > 0) {
            this.page++
            $state.loaded()
          } else {
            $state.complete()
          }
        }
      } catch {
        $state.complete()
      }
    },
  },
}
</script>

<style lang="scss">
@import "~/assets/components/IdeasList";
</style>
