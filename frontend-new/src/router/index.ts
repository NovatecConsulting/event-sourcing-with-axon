import { createRouter, createWebHistory } from 'vue-router'
import { useOidcStore } from 'vue3-oidc'

const oidcState = useOidcStore()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/sign-in'
    },
    {
      path: '/sign-in',
      name: 'signin',
      component: () => import('../authentication/SignInPage.vue')
    },
    {
      path: '/sign-out',
      name: 'signout',
      component: () => import('../authentication/SignOutPage.vue')
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../projects/pages/ProjectsPage.vue')
    },
    {
      path: '/projects/:projectId',
      name: 'projectdetails',
      component: () => import('../projects/pages/ProjectsPage.vue')
    },
    {
      path: '/projects/:projectId/tasks',
      name: 'tasks',
      component: () => import('../tasks/pages/TasksPage.vue')
    },
    {
      path: '/projects/:projectId/tasks/:taskId',
      name: 'taskdetails',
      component: () => import('../tasks/pages/TasksPage.vue')
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('../companies/pages/CompaniesPage.vue')
    },
    {
      path: '/oidc-callback',
      name: 'oidccallback',
      component: () => import('../authentication/CallBackPage.vue')
    }
  ]
})

// global guard protecting all views when user is not authenticated except sign-in
router.beforeEach((to, from) => {
  const user = oidcState.state.value.user
  const isAuthenticated = user !== null && user.expired !== true
  console.log('Vue Router: Navigating from ' + from.path + ' to ' + to.path)
  if (to.name === 'oidccallback') {
    return true
  }
  if (!isAuthenticated && to.name !== 'signin') {
    console.log('User is not authenticated, redirecting to /sign-in')
    return { name: 'signin' }
  }
})

export default router
