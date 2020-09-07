<template>
  <section id="ideas-list">
    <header>
      <v-container class="pb-8">
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
    <v-divider />
    <v-simple-table v-if="!isEmptyList">
      <template v-slot:default>
        <thead>
          <tr>
            <th></th>
            <th>Impact</th>
            <th>Ease</th>
            <th>Confidence</th>
            <th>Avg.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(idea, idx) in ideas" :key="idx">
            <td>
              <v-text-field v-if="idea.editMode" v-model="idea.content" />
              <span v-else>{{ idea.content }}</span>
            </td>
            <td>
              <v-text-field
                v-if="idea.editMode"
                v-model.number="idea.impact"
                :min="IMPACT_VALUE.MIN"
                :max="IMPACT_VALUE.MAX"
                type="number"
              />
              <span v-else>{{ idea.impact }}</span>
            </td>
            <td>
              <v-text-field
                v-if="idea.editMode"
                v-model.number="idea.ease"
                :min="EASE_VALUE.MIN"
                :max="EASE_VALUE.MAX"
                type="number"
              />
              <span v-else>{{ idea.ease }}</span>
            </td>
            <td>
              <v-text-field
                v-if="idea.editMode"
                v-model.number="idea.confidence"
                :min="CONFIDENCE_VALUE.MIN"
                :max="CONFIDENCE_VALUE.MAX"
                type="number"
              />
              <span v-else>{{ idea.confidence }}</span>
            </td>
            <td>{{ idea.avgRating }}</td>
            <td>
              <div v-if="idea.editMode">
                <v-btn text :loading="idea.saving" :disabled="idea.deleting" @click="saveIdea(idx)">
                  <img src="img/Confirm_V.png" />
                </v-btn>
                <v-btn text :loading="idea.deleting" :disabled="idea.saving" @click="deleteIdea(idx)">
                  <img src="img/Cancel_X.png" />
                </v-btn>
              </div>
              <div v-else>
                <v-btn text :disabled="idea.deleting" @click="toggleEditMode(idx)">
                  <img src="img/pen.png" />
                </v-btn>
                <v-btn text :loading="idea.deleting" :disabled="idea.saving" @click="deleteIdea(idx)">
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
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>
        <v-card-text>
          This idea will be permanently deleted.
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="green darken-1"
            text
            @click="cancelDelete">
            Disagree
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="deleteIdea(deleteIdx)">
            Agree
          </v-btn>
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
  },
  methods: {
    addNewIdea() {
      if (!this.hasUnsavedNewIdea) {
        this.ideas.push(new Idea({ editMode: true }))
      }
    },
    deleteIdea(idx) {
      const idea = this.ideas[idx]

      if (idea.id) {
        if (idea.editMode) {
          this.toggleEditMode(idx)
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
              this.ideas.splice(idx, 1)
            })
            .finally(() => {
              idea.deleting = false
            })
      } else {
        this.ideas.splice(idx, 1)
      }
    },
    toggleEditMode(idx) {
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
    saveIdea(idx) {
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

<style lang="scss" scoped>
@import "~/assets/components/IdeasList";
</style>
