<script setup lang="ts">
import MainLayout from '@/shared/layout/MainLayout.vue'
import TaskDrawer from '@/tasks/components/TaskDrawerComponent.vue'
import TaskList from '@/tasks/components/TaskListComponent.vue'
import AssignTaskModal from '../components/AssignTaskModalComponent.vue'
import { useQuery } from '@vue/apollo-composable'
import { computed, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  GET_PROJECT_WITH_TASKS,
  type ProjectWithTasksQueryResult,
  type Task
} from '../api/task-api'

const route = useRoute()
const router = useRouter()

const isCreateTasktModalOpen = ref(false)
const isAssignTaskModalOpen = ref(false)
const isDrawerOpen = ref(false)

const selectedTaskIdentifier: Ref<string | undefined> = ref(undefined)
const selectedTask: Ref<Task | undefined> = computed(() =>
  selectedTaskIdentifier.value !== ''
    ? tasks.value.find((task) => task.identifier === selectedTaskIdentifier.value)
    : undefined
)

const tasks: Ref<Task[]> = ref([])
const loading: Ref<boolean> = ref(true)

watch(
  () => route.params.taskId,
  (newId: string | string[]) => onRouteChanged(newId),
  { immediate: true }
)

function onRouteChanged(newId: string | string[]) {
  if (newId !== undefined) {
    selectedTaskIdentifier.value = newId as string
    isDrawerOpen.value = true
  } else {
    isDrawerOpen.value = false
    selectedTaskIdentifier.value = undefined
  }
}

const projectWithTasksQuery = useQuery<ProjectWithTasksQueryResult>(GET_PROJECT_WITH_TASKS, () => ({
  projectIdentifier: route.params.projectId
}))

projectWithTasksQuery.onResult((result, _) => {
  loading.value = false
  tasks.value = result.data.project.tasks
})

function onTaskSelected(taskIdentifier: string) {
  router.push({ path: `/projects/${route.params.projectId}/tasks/${taskIdentifier}` })
}

function onDrawerClosed() {
  isDrawerOpen.value = false
  router.push({ path: `/projects/${route.params.projectId}/tasks` })
}

function onCreateTask() {
  isCreateTasktModalOpen.value = true
}

function onCreateTaskCancelled() {
  isCreateTasktModalOpen.value = false
}

function onCreateTaskDone() {
  isCreateTasktModalOpen.value = false
}

function onAssignTask() {
  isAssignTaskModalOpen.value = true
}

function onAssignTaskDone() {
  isAssignTaskModalOpen.value = false
}

function onAssignTaskCancelled() {
  isAssignTaskModalOpen.value = false
}

function onUnassignTask() {
  alert('Not yet implemented')
}

function onRenameTask() {
  alert('Not yet implemented')
}

function onRedescribeTask() {
  alert('Not yet implemented')
}

function onRescheduleTask() {
  alert('Not yet implemented')
}
</script>

<template>
  <MainLayout>
    <section class="px-5">
      <h1 class="text-h4 my-5">Tasks</h1>
      <v-sheet elevation="2">
        <TaskList
          :tasks="tasks"
          :loading="loading"
          @create-task="onCreateTask"
          @task-selected="onTaskSelected"
        />
      </v-sheet>
    </section>
    <TaskDrawer
      :is-visible="isDrawerOpen"
      :task="selectedTask!"
      @drawer-closed="onDrawerClosed"
      @assign-task="onAssignTask"
      @unassign-task="onUnassignTask"
      @rename-task="onRenameTask"
      @redescribe-task="onRedescribeTask"
      @reschedule-task="onRescheduleTask"
    />
    <AssignTaskModal
      v-if="isAssignTaskModalOpen"
      :project-identifier="route.params.projectId as string"
      :task-identifier="selectedTaskIdentifier"
      @canceled="onAssignTaskCancelled"
      @done="onAssignTaskDone"
    />
  </MainLayout>
</template>
