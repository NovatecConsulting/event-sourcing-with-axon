<script setup lang="ts">
import { useAuth } from 'vue3-oidc'

const { signinRedirect } = useAuth()
</script>

<template>
  <v-app>
    <v-main class="d-flex align-center justify-center">
      <v-sheet class="pa-5 text-center" rounded="lg" elevation="5" width="400">
        <h1 class="text-h5 mb-6">Welcome to YATT!</h1>
        <p class="mb-6">Please sign-in to authenticate yourself.</p>
        <v-divider class="mb-4"></v-divider>
        <div class="text-center">
          <v-btn color="primary" rounded="lg" @click="signinRedirect()">Signin</v-btn>
        </div>
      </v-sheet>
    </v-main>
  </v-app>
</template>
