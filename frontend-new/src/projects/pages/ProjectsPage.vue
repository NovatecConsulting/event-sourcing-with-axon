<script lang="ts" setup>
import AddParticipantModal from '@/projects/components/AddParticipantModalComponent.vue'
import CreateProjectModal from '@/projects/components/ProjectCreateModalComponent.vue'
import ProjectDrawer from '@/projects/components/ProjectDrawerComponent.vue'
import ProjectList from '@/projects/components/ProjectListComponent.vue'
import RenameProjectModal from '@/projects/components/ProjectRenameModalComponent.vue'
import RescheduleProjectModal from '@/projects/components/ProjectRescheduleModalComponent.vue'
import MainLayout from '@/shared/layout/MainLayout.vue'
import { toUtcDate } from '@/shared/util/date-utils'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import { computed, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  GET_PROJECTS,
  GET_PROJECT_UPDATES,
  type Project,
  type ProjectUpdateResult,
  type ProjectsQueryResults
} from '../api/project-api'

const route = useRoute()
const router = useRouter()

const isCreateProjectModalOpen = ref(false)
const isRenameProjectModalOpen = ref(false)
const isRescheduleProjectModalOpen = ref(false)
const isAddParticipantModalOpen = ref(false)
const isDrawerOpen = ref(false)

const projects: Ref<Project[]> = ref([])

const selectedProjectIdentifier: Ref<string | undefined> = ref(undefined)
const selectedProject: Ref<Project | undefined> = computed(() =>
  selectedProjectIdentifier.value !== ''
    ? projects.value.find((project) => project.identifier === selectedProjectIdentifier.value)
    : undefined
)

watch(
  () => route.params.projectId,
  (newId: string | string[]) => onRouteChanged(newId),
  { immediate: true }
)

function onRouteChanged(newId: string | string[]) {
  if (newId !== undefined) {
    selectedProjectIdentifier.value = newId as string
    isDrawerOpen.value = true
  } else {
    isDrawerOpen.value = false
    selectedProjectIdentifier.value = undefined
  }
}

const projectsQuery = useQuery<ProjectsQueryResults>(GET_PROJECTS)

const projectUpdatesQuery = useSubscription<ProjectUpdateResult>(GET_PROJECT_UPDATES)

projectsQuery.onResult((result, _) => {
  projects.value = result.data.projects
})

projectUpdatesQuery.onResult((result, _) => {
  if (result.data !== undefined && result.data !== null) {
    const tmp = projects.value.filter(
      (project) => project.identifier !== result.data!!.project.identifier
    )
    tmp.push(result.data!!.project)
    projects.value = tmp
  }
})

function onProjectSelected(projectIdentifier: string) {
  router.push({ path: `/projects/${projectIdentifier}` })
}

function onDrawerClosed() {
  isDrawerOpen.value = false
  router.push('/projects')
}

function onCreateProject() {
  isCreateProjectModalOpen.value = true
}

function onCreateProjectCancelled() {
  isCreateProjectModalOpen.value = false
}

function onCreateProjectDone() {
  isCreateProjectModalOpen.value = false
}

function onRenameProject() {
  isRenameProjectModalOpen.value = true
}

function onRenameProjectCancelled() {
  isRenameProjectModalOpen.value = false
}

function onRenameProjectDone() {
  isRenameProjectModalOpen.value = false
}

function onRescheduleProject() {
  isRescheduleProjectModalOpen.value = true
}

function onRescheduleProjectCancelled() {
  isRescheduleProjectModalOpen.value = false
}

function onRescheduleProjectDone() {
  isRescheduleProjectModalOpen.value = false
}

function onAddParticipant() {
  isAddParticipantModalOpen.value = true
}

function onAddParticipantCancelled() {
  isAddParticipantModalOpen.value = false
}

function onAddParticipantDone() {
  isAddParticipantModalOpen.value = false
}

function onRemoveParticipant(identifier: string) {
  alert('This is not yet implemented!')
}
</script>

<template>
  <MainLayout>
    <section class="px-5">
      <h1 class="text-h4 my-5">Projects</h1>
      <v-sheet elevation="2">
        <ProjectList
          :projects="projects"
          @create-project="onCreateProject"
          @project-selected="onProjectSelected"
        />
      </v-sheet>
    </section>
    <ProjectDrawer
      :is-visible="isDrawerOpen"
      :project="selectedProject!"
      @add-participant="onAddParticipant"
      @drawer-closed="onDrawerClosed"
      @remove-participant="onRemoveParticipant"
      @rename-project="onRenameProject"
      @reschedule-project="onRescheduleProject"
    />
    <CreateProjectModal
      v-if="isCreateProjectModalOpen"
      @canceled="onCreateProjectCancelled"
      @done="onCreateProjectDone"
    />
    <RenameProjectModal
      v-if="isRenameProjectModalOpen"
      :project-identifier="selectedProject!.identifier"
      :project-version="selectedProject!.version"
      :project-name="selectedProject!.name"
      @canceled="onRenameProjectCancelled"
      @done="onRenameProjectDone"
    />
    <RescheduleProjectModal
      v-if="isRescheduleProjectModalOpen"
      :project-identifier="selectedProject!.identifier"
      :project-version="selectedProject!.version"
      :planned-start-date="toUtcDate(selectedProject!.startDate)"
      :deadline="toUtcDate(selectedProject!.deadline)"
      @canceled="onRescheduleProjectCancelled"
      @done="onRescheduleProjectDone"
    />
    <AddParticipantModal
      v-if="isAddParticipantModalOpen"
      :project-identifier="selectedProject!.identifier"
      @canceled="onAddParticipantCancelled"
      @done="onAddParticipantDone"
    />
  </MainLayout>
</template>
