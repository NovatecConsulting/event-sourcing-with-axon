<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed, nextTick, ref, watch, type Ref } from 'vue'

const emit = defineEmits(['done', 'canceled'])

const dialog = ref(true)
const form = ref()
const isFormValid = ref(false)
const formDisabled = ref(false)

const projectName: Ref<String> = ref('')
const projectNameRules = [
  (value: String) => {
    if (value?.length > 0) return true
    return 'Project name must not be empty'
  }
]

function formatDate(date: Date): String {
  return date.toJSON().substring(0, 10)
}

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const plannedStartDate: Ref<Date> = ref(today)
const plannedStartDateFormated: Ref<String> = computed(() => formatDate(plannedStartDate.value))
const plannedStartDateRules = [
  (value: string) => {
    if (new Date(Date.parse(value)) < deadlineDate.value) return true
    return 'Planned start must be before deadline'
  }
]
watch(plannedStartDate, () => nextTick(form.value.validate()))

const deadlineDate: Ref<Date> = ref(tomorrow)
const deadlineDateFormated: Ref<String> = computed(() => formatDate(deadlineDate.value))
const deadlineDateRules = [
  (value: string) => {
    if (new Date(Date.parse(value)) > plannedStartDate.value) return true
    return 'Deadline must be after planned start date'
  }
]
watch(deadlineDate, () => nextTick(form.value.validate()))

const companyIdentifier: Ref<String> = ref('')
const companyIdentifierRules = [
  (value: string) => {
    if (value) return true
    return 'Please select a company'
  }
]

function onOk() {
  if (isFormValid.value) {
    createProject({
      name: projectName.value,
      plannedStartDate: plannedStartDateFormated.value,
      deadline: deadlineDateFormated.value,
      companyId: companyIdentifier.value
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

const { mutate: createProject } = useMutation(
  gql`
    mutation createProject(
      $name: String!
      $plannedStartDate: Date!
      $deadline: Date!
      $companyId: String!
    ) {
      createProject(
        projectName: $name
        plannedStartDate: $plannedStartDate
        deadline: $deadline
        companyId: $companyId
      )
    }
  `,
  { fetchPolicy: 'no-cache' }
)

type Company = {
  identifier: string
  name: string
  status: string
  startDate: string
  actualEndDate: string
  deadline: string
}

type CompaniesQueryResult = {
  companies: Company[]
}

const companiesQuery = useQuery<CompaniesQueryResult>(gql`
  query getCompanies {
    companies(userAllowedToCreateProjectFor: true) {
      identifier
      name
    }
  }
`)

const companies: Ref<Company[]> = ref([])

companiesQuery.onResult((result, _) => {
  companies.value = result.data.companies
})
</script>

<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-form ref="form" v-model="isFormValid" :disabled="formDisabled" @submit.prevent>
        <v-card prepend-icon="mdi-plus" title="New Project">
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  label="Project Name *"
                  v-model="projectName"
                  :rules="projectNameRules"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-date-input
                  label="Planned Start Date *"
                  v-model="plannedStartDate"
                  :rules="plannedStartDateRules"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                ></v-date-input>
              </v-col>
              <v-col>
                <v-date-input
                  label="Deadline Date *"
                  v-model="deadlineDate"
                  :rules="deadlineDateRules"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                ></v-date-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-select
                  label="Company"
                  v-model="companyIdentifier"
                  :rules="companyIdentifierRules"
                  :items="companies"
                  item-value="identifier"
                  item-title="name"
                />
              </v-col>
            </v-row>

            <small class="text-caption text-medium-emphasis">*indicates required field</small>
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
