<script lang="ts" setup>
import { getCurrentUser } from '@/shared/api/user-api'
import { onBeforeMount, ref } from 'vue'

const name = ref('Empty')

onBeforeMount(() => {
  getCurrentUser().then((response) => {
    name.value = response.data.firstname
  })
})
</script>

<template>Welcome, {{ name }}!</template>
