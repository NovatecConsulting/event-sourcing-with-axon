<script setup lang="ts">
import { type Task } from '../api/task-api'

export interface Props {
  isVisible: boolean
  task?: Task
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false
})

const emit = defineEmits([
  'drawerClosed',
  'assignTask',
  'redescribeTask',
  'renameTask',
  'rescheduleTask',
  'unassignTask'
])

function closeDrawer(value: Boolean) {
  if (value === false) {
    emit('drawerClosed')
  }
}

function getStatusColor(value: String): String {
  if (value === 'COMPLETED') return 'green'
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
            <h2 class="text-h5">Task Details</h2>
          </div>
          <div>
            <v-chip v-if="task?.status" :color="getStatusColor(task?.status)">
              {{ task?.status }}
            </v-chip>
          </div>
        </div>
        <p class="text-caption">ID: {{ task?.identifier }}</p>
      </section>

      <v-divider />

      <section class="py-5">
        <v-row>
          <v-col>
            <p><b>Name:</b></p>
            <div class="d-flex align-center">
              <div class="pr-2">{{ task?.name }}</div>
              <v-icon icon="mdi-pencil" size="x-small" @click="$emit('renameTask')" />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p><b>Description:</b></p>
            <div class="d-flex align-center">
              <div class="pr-2">{{ task?.description }}</div>
              <v-icon icon="mdi-pencil" size="x-small" @click="$emit('redescribeTask')" />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col c>
            <p><b>Start Date:</b></p>
            <div class="d-flex align-center">
              <div class="pr-2">{{ task?.startDate }}</div>
              <v-icon icon="mdi-pencil" size="x-small" @click="$emit('rescheduleTask')" />
            </div>
          </v-col>
          <v-col>
            <p><b>End Date::</b></p>
            <div class="d-flex align-center">
              <div class="pr-2">{{ task?.endDate }}</div>
              <v-icon icon="mdi-pencil" size="x-small" @click="$emit('rescheduleTask')" />
            </div>
          </v-col>
        </v-row>
      </section>

      <v-divider />

      <section class="py-5">
        <v-row>
          <v-col>
            <p><b>Assignee:</b></p>
            <div class="d-flex align-center">
              <div class="pr-2">
                {{ task?.assignee?.user?.firstname }} {{ task?.assignee?.user?.lastname }} ({{
                  task?.assignee?.company?.name
                }})
              </div>
              <v-icon icon="mdi-pencil" size="x-small" @click="$emit('assignTask')" />
              <v-icon icon="mdi-delete" size="x-small" @click="$emit('unassignTask')" />
            </div>
          </v-col>
        </v-row>
      </section>

      <v-divider />

      <section class="py-5">
        <h5 class="text-h6">ToDo's</h5>
      </section>
    </div>
  </v-navigation-drawer>
</template>
