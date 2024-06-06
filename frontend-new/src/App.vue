<script lang="ts" setup>
import { provide } from 'vue'
import { apolloClient } from './shared/http/graphql-client'
import { DefaultApolloClient } from '@vue/apollo-composable'

provide(DefaultApolloClient, apolloClient)
</script>

<template>
  <router-view />
</template>
