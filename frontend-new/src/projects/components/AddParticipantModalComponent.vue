<script setup lang="ts">
import type { ApolloQueryResult } from '@apollo/client'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref, watch, type Ref } from 'vue'
import {
  COMPANIES_WITH_EMPLOYEES,
  CREATE_PARTICIPANT,
  Employee,
  type CompaniesWithEmployeesQueryResult,
  type CompanyWithEmployees
} from '../api/project-api'

export interface Props {
  projectIdentifier: string
}

const props = withDefaults(defineProps<Props>(), {
  projectIdentifier: ''
})

const emit = defineEmits(['done', 'canceled'])

const companies: Ref<CompanyWithEmployees[]> = ref([])
const employees: Ref<Employee[]> = ref([])

const selectedCompanyIdentifier: Ref<string | null> = ref(null)
const selectedCompanyIdentifierRules = [
  (value: string) => {
    if (value !== null) return true
    return 'Please select a company'
  }
]
const selectedUserIdentifier: Ref<string | null> = ref(null)
const selectedUserIdentifierRules = [
  (value: string) => {
    if (value !== null) return true
    return 'Please select a user'
  }
]

watch(
  () => selectedCompanyIdentifier.value,
  (newId: string | null) => {
    selectedUserIdentifier.value = null
    const employeesForSelectedCompany = companies.value.find(
      (company: CompanyWithEmployees) => company.identifier === newId
    )?.employees
    employees.value = employeesForSelectedCompany === undefined ? [] : employeesForSelectedCompany
  },
  { immediate: true }
)

const dialog = ref(true)
const form = ref()
const isFormValid = ref(false)
const formDisabled = ref(false)

function onOk() {
  if (isFormValid.value) {
    formDisabled.value = true
    createParticipant({
      projectIdentifier: props.projectIdentifier,
      companyIdentifier: selectedCompanyIdentifier.value,
      userIdentifier: selectedUserIdentifier.value
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

const { mutate: createParticipant } = useMutation(CREATE_PARTICIPANT, { fetchPolicy: 'no-cache' })

const companyQueryResult = useQuery(COMPANIES_WITH_EMPLOYEES)

companyQueryResult.onResult((result: ApolloQueryResult<CompaniesWithEmployeesQueryResult>, _) => {
  companies.value = result?.data?.companies
})
</script>

<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-form ref="form" v-model="isFormValid" @submit.prevent>
        <v-card prepend-icon="mdi-plus" title="Participant">
          <v-card-text>
            <v-row>
              <v-col>
                <v-select
                  label="Company"
                  :items="companies"
                  :rules="selectedCompanyIdentifierRules"
                  item-title="name"
                  item-value="identifier"
                  v-model="selectedCompanyIdentifier"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-select
                  label="User"
                  :items="employees"
                  :rules="selectedUserIdentifierRules"
                  :item-title="(item: Employee) => item.user.firstname + ' ' + item.user.lastname"
                  item-value="user.identifier"
                  v-model="selectedUserIdentifier"
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
