<script lang="ts" setup>
import { ref } from 'vue'
import { type Project } from '../api/project-api'

export interface Props {
  projects: Project[]
}

const props = withDefaults(defineProps<Props>(), {
  projects: new Array<Project>()
})

const emit = defineEmits(['createProject', 'projectSelected'])

const tableHeight = ref(100)
const tableContainer = ref()

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Status', align: 'start', key: 'status' },
  { title: 'Start Date', align: 'start', key: 'startDate' },
  { title: 'Deadline', align: 'start', key: 'deadline' },
  { title: 'Actual End Date', align: 'start', key: 'actualEndDate' }
]

function onResize() {
  tableHeight.value = window.innerHeight - tableContainer.value.getBoundingClientRect().y - 100
}

function getStatusColor(value: String): String {
  if (value === 'ON_TIME') return 'green'
  if (value === 'DELAYED') return 'red'
  else return 'grey'
}
</script>

<template>
  <div v-resize="onResize" ref="tableContainer">
    <v-data-table-virtual
      :height="tableHeight"
      :headers="headers"
      :items="props.projects"
      :hover="true"
      item-value="identifier"
      fixed-header
      density="compact"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      @click:row="
        (item, row) => {
          emit('projectSelected', row.item.identifier)
        }
      "
    >
      <template v-slot:top>
        <v-toolbar density="compact" class="pr-2">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            density="comfortable"
            elevation="2"
            prepend-icon="mdi-plus"
            rounded="lg"
            @click="$emit('createProject')"
          >
            Project
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.status="{ value }">
        <v-chip :color="getStatusColor(value)" size="small">
          {{ value }}
        </v-chip>
      </template>
    </v-data-table-virtual>
  </div>
</template>
