<script setup lang="ts">
import type { Participant } from '@/projects/api/project-api'
import { gql, type ApolloQueryResult } from '@apollo/client'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref, type Ref } from 'vue'
import {
  GET_PROJECT_WITH_PARTICIPANTS,
  type ProjectWithParticipantsQueryResult
} from '../api/task-api'

export interface Props {
  projectIdentifier: string
  taskIdentifier: string
}

const props = withDefaults(defineProps<Props>(), {
  projectIdentifier: '',
  taskIdentifier: ''
})

const emit = defineEmits(['done', 'canceled'])

const participants: Ref<Participant[]> = ref([])
const selectedParticipantIdentifier: Ref<string | null> = ref(null)
const selectedParticipantIdentifierRules = [
  (value: string) => {
    if (value !== null) return true
    return 'Please select a participant'
  }
]

const dialog = ref(true)
const form = ref()
const isFormValid = ref(false)
const formDisabled = ref(false)

function onOk() {
  if (isFormValid.value) {
    formDisabled.value = true
    assignTask({
      identifier: props.taskIdentifier,
      assignee: selectedParticipantIdentifier.value
    })
      .then(
        () => {
          console.info('Done')
        },
        () => {
          console.error('Rejected')
        }
      )
      .finally(() => {
        dialog.value = false
        emit('done')
      })
  }
}

function onCancel() {
  dialog.value = false
  emit('canceled')
}

const { mutate: assignTask } = useMutation(
  gql`
    mutation assignTask($identifier: ID!, $assignee: ID!) {
      assignTask(identifier: $identifier, assignee: $assignee)
    }
  `,
  { fetchPolicy: 'no-cache' }
)

const projectWithParticipantsQuery = useQuery(GET_PROJECT_WITH_PARTICIPANTS, () => ({
  projectIdentifier: props.projectIdentifier
}))

projectWithParticipantsQuery.onResult(
  (result: ApolloQueryResult<ProjectWithParticipantsQueryResult>, _) => {
    participants.value = result?.data?.project?.participants
  }
)

function participantDisplayName(item: Participant): string {
  return item.user.firstname + ' ' + item.user.lastname + ' (' + item.company.name + ')'
}
</script>

<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-form ref="form" v-model="isFormValid" @submit.prevent>
        <v-card prepend-icon="mdi-rotate-3d-variant" title="Assign Task">
          <v-card-text>
            <v-row>
              <v-col>
                <v-select
                  label="Participant"
                  :items="participants"
                  :rules="selectedParticipantIdentifierRules"
                  :item-title="(item: Participant) => participantDisplayName(item)"
                  item-value="identifier"
                  v-model="selectedParticipantIdentifier"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn text="Cancel" @click="onCancel" />
            <v-btn text="Save" type="submit" :disabled="!isFormValid" @click="onOk" />
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
