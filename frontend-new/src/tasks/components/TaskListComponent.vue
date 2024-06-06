<script lang="ts" setup>
import { shallowRef } from 'vue';
import { type Task } from '../api/task-api';

export interface Props {
  loading: boolean
  tasks: Task[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: true,
  tasks: new Array<Task>()
})

const emit = defineEmits(['createTask', 'taskSelected'])

const tableHeight = shallowRef(100)
const tableContainer = shallowRef()

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Status', align: 'start', key: 'status' },
  { title: 'Start Date', align: 'start', key: 'startDate' },
  { title: 'End Date', align: 'start', key: 'endDate' }
]

function onResize() {
  tableHeight.value = window.innerHeight - tableContainer.value.getBoundingClientRect().y - 100
}

function getStatusColor(value: String): String {
  if (value === 'DONE') return 'green'
  else return 'grey'
}
</script>

<template>
  <div v-resize="onResize" ref="tableContainer">
    <v-data-table-virtual
      :height="tableHeight"
      :headers="headers"
      :items="props.tasks"
      :hover="true"
      :loading="props.loading"
      item-value="identifier"
      fixed-header
      density="compact"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      @click:row="
        (item, row) => {
          emit('taskSelected', row.item.identifier)
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
            @click="$emit('createTask')"
          >
            Task
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@4"/>
      </template>
      <template v-slot:item.status="{ value }">
        <v-chip :color="getStatusColor(value)" size="small">
          {{ value }}
        </v-chip>
      </template>
    </v-data-table-virtual>
  </div>
</template>
