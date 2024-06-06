<script lang="ts" setup>
import { ref } from 'vue'
import { type Participant } from '../api/project-api'

export interface Props {
  participants: Participant[]
}

const props = withDefaults(defineProps<Props>(), {
  participants: new Array<Participant>()
})

const emit = defineEmits(['addParticipant', 'removeParticipant'])

const tableHeight = ref(100)
const tableContainer = ref()

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'E-Mail', align: 'start', key: 'email' },
  { title: 'Company', align: 'start', key: 'company' },
  { title: 'Actions', align: 'end', key: 'actions', sortable: false }
]

function onResize() {
  const calculated = window.innerHeight - tableContainer.value.getBoundingClientRect().y - 120
  tableHeight.value = calculated > 200 ? calculated : 200
}
</script>

<template>
  <div v-resize="onResize" ref="tableContainer">
    <v-data-table-virtual
      :height="tableHeight"
      :headers="headers"
      :items="props.participants"
      :hover="true"
      item-value="identifier"
      fixed-header
      density="compact"
      :sort-by="[{ key: 'name', order: 'asc' }]"
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
            @click="emit('addParticipant')"
          >
            Participant
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.user.firstname }} {{ item.user.lastname }}</td>
          <td>{{ item.user.email }}</td>
          <td>{{ item.company.name }}</td>
          <td class="text-right">
            <v-icon
              icon="mdi-delete"
              size="x-small"
              @click="emit('removeParticipant', item.identifier)"
            />
          </td>
        </tr>
      </template>
    </v-data-table-virtual>
  </div>
</template>
