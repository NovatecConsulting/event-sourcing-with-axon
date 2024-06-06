<script setup lang="ts">
import { type Project } from '../api/project-api'
import ParticipantList from '@/projects/components/ParticipantListComponent.vue'

export interface Props {
  isVisible: boolean
  project?: Project
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false
})

const emit = defineEmits([
  'addParticipant',
  'drawerClosed',
  'renameProject',
  'rescheduleProject',
  'removeParticipant'
])

function closeDrawer(value: Boolean) {
  if (value === false) {
    emit('drawerClosed')
  }
}

function getStatusColor(value: String): String {
  if (value === 'ON_TIME') return 'green'
  if (value === 'DELAYED') return 'red'
  else return 'grey'
}
</script>

<template>
  <v-navigation-drawer
    location="right"
    v-model="props.isVisible"
    temporary
    disable-route-watcher
    width="800"
    @update:model-value="(value: Boolean) => closeDrawer(value)"
  >
    <div class="pa-5">
      <section class="pb-5">
        <div class="d-flex justify-space-between">
          <div>
            <h2 class="text-h5">Project Details</h2>
          </div>
          <div>
            <v-chip v-if="project?.status" :color="getStatusColor(project?.status)">
              {{ project?.status }}
            </v-chip>
          </div>
        </div>
        <p class="text-caption">ID: {{ project?.identifier }}</p>
      </section>

      <v-divider />

      <section class="py-5">
        <v-row>
          <v-col>
            <p><b>Name:</b></p>
            <div class="d-flex align-center">
              <div class="pr-2">{{ project?.name }}</div>
              <v-icon icon="mdi-pencil" size="x-small" @click="$emit('renameProject')" />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p><b>Start Date:</b></p>
            <div class="d-flex align-center">
              <div class="pr-2">{{ project?.startDate }}</div>
              <v-icon icon="mdi-pencil" size="x-small" @click="$emit('rescheduleProject')" />
            </div>
          </v-col>
          <v-col c>
            <p><b>Deadline:</b></p>
            <div class="d-flex align-center">
              <div class="pr-2">{{ project?.deadline }}</div>
              <v-icon icon="mdi-pencil" size="x-small" @click="$emit('rescheduleProject')" />
            </div>
          </v-col>
          <v-col>
            <p><b>Actual End Date::</b></p>
            {{ project?.actualEndDate }}
          </v-col>
        </v-row>
      </section>

      <v-divider />

      <section class="py-5">
        <p class="text-h6 pb-5">Task Statistics</p>
        <v-row>
          <v-col>
            <div class="rounded-pill bg-grey-lighten-4 mx-auto text-center py-2">
              <div class="text-h6">{{ project?.statistics?.tasks?.all }}</div>
              <div class="text-caption">All</div>
            </div>
          </v-col>
          <v-col>
            <div class="rounded-pill bg-grey-lighten-3 mx-auto text-center py-2">
              <div class="text-h6">{{ project?.statistics?.tasks?.planned }}</div>
              <div class="text-caption">Planned</div>
            </div>
          </v-col>
          <v-col>
            <div class="rounded-pill bg-grey-lighten-2 mx-auto text-center py-2">
              <div class="text-h6">{{ project?.statistics?.tasks?.started }}</div>
              <div class="text-caption">Started</div>
            </div>
          </v-col>
          <v-col>
            <div class="rounded-pill bg-grey-lighten-1 mx-auto text-center py-2">
              <div class="text-h6">{{ project?.statistics?.tasks?.completed }}</div>
              <div class="text-caption">Completed</div>
            </div>
          </v-col>
        </v-row>
      </section>

      <section class="pb-5">
        <RouterLink :to="'/projects/' + project?.identifier + '/tasks'">
          <p class="text-decoration-none">Go to tasks</p>
        </RouterLink>
      </section>

      <v-divider />

      <section class="py-5">
        <p class="text-h6 pb-5">Participants</p>
        <v-sheet elevation="2">
          <ParticipantList
            :participants="project?.participants"
            @add-participant="emit('addParticipant')"
            @remove-participant="(value) => emit('removeParticipant', value)"
          />
        </v-sheet>
      </section>
    </div>
  </v-navigation-drawer>
</template>
