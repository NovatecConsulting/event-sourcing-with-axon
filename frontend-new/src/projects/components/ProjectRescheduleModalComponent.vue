<script setup lang="ts">
import { toUtcDate } from '@/shared/util/date-utils'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed, nextTick, ref, watch, type Ref } from 'vue'

export interface Props {
  projectIdentifier: string
  projectVersion: number
  plannedStartDate: Date
  deadline: Date
}

const props = withDefaults(defineProps<Props>(), {
  projectIdentifier: '',
  projectName: ''
})

const emit = defineEmits(['done', 'canceled'])

const dialog = ref(true)

const form = ref()
const isFormValid = ref(false)
const formDisabled = ref(false)

function formatDate(date: Date): String {
  const tzoffset = date.getTimezoneOffset() * 60000 //offset in milliseconds
  const withoutTimezone = new Date(date.valueOf() - tzoffset)
  return withoutTimezone.toJSON().substring(0, 10)
}

const plannedStartDate: Ref<Date> = ref(props.plannedStartDate)
const plannedStartDateFormated: Ref<String> = computed(() => formatDate(plannedStartDate.value))
const plannedStartDateRules = [
  (value: string) => {
    if (toUtcDate(value) < deadlineDate.value) return true
    return 'Planned start must be before deadline'
  }
]
watch(plannedStartDate, () => nextTick(form.value.validate()))

const deadlineDate: Ref<Date> = ref(props.deadline)
const deadlineDateFormated: Ref<String> = computed(() => formatDate(deadlineDate.value))
const deadlineDateRules = [
  (value: string) => {
    if (toUtcDate(value) > plannedStartDate.value) return true
    return 'Deadline must be after planned start date'
  }
]
watch(deadlineDate, () => nextTick(form.value.validate()))

function onOk() {
  if (isFormValid.value) {
    rescheduleProject({
      identifier: props.projectIdentifier,
      version: props.projectVersion,
      startDate: plannedStartDateFormated.value,
      deadline: deadlineDateFormated.value
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
    formDisabled.value = true
  }
}

function onCancel() {
  dialog.value = false
  emit('canceled')
}
const { mutate: rescheduleProject } = useMutation(
  gql`
    mutation rescheduleProject(
      $identifier: ID!
      $version: Int!
      $startDate: Date!
      $deadline: Date!
    ) {
      rescheduleProject(
        identifier: $identifier
        version: $version
        startDate: $startDate
        deadline: $deadline
      )
    }
  `,
  { fetchPolicy: 'no-cache' }
)
</script>

<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-form ref="form" v-model="isFormValid" :disabled="formDisabled" @submit.prevent>
        <v-card prepend-icon="mdi-pen" title="Reschedule Project">
          <v-card-text>
            <v-row>
              <v-col>
                <v-date-input
                  label="Planned Start Date"
                  v-model="plannedStartDate"
                  :rules="plannedStartDateRules"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                ></v-date-input>
              </v-col>
              <v-col>
                <v-date-input
                  label="Deadline Date"
                  v-model="deadlineDate"
                  :rules="deadlineDateRules"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                ></v-date-input>
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
