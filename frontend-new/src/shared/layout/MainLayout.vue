<script setup lang="ts">
import { ref, type Ref } from 'vue'
import UserName from '@/shared/components/UserNameComponent.vue'
const navigationVisible = ref(false)

type MenuItem = {
  title?: string
  type?: any
  route?: string
  icon?: any
}

const items: Ref<Array<MenuItem>> = ref([
  {
    title: 'Projects',
    route: '/projects',
    icon: 'mdi-flag'
  },
  {
    title: 'Companies',
    route: '/companies',
    icon: 'mdi-chart-gant'
  },
  {
    type: 'divider'
  },
  {
    title: 'Signout',
    route: '/sign-out',
    icon: 'mdi-flag'
  }
])
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="navigationVisible = !navigationVisible"
        ></v-app-bar-nav-icon>
      </template>
      <v-toolbar-title>YATT - Axon Showcase</v-toolbar-title>
      <template v-slot:append>
        <div class="pa-2"><v-icon icon="mdi-account" /><UserName /></div>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="navigationVisible" temporary>
      <v-list>
        <v-list-item
          v-for="item in items"
          v-bind:key="item.route"
          v-bind:title="item.title"
          v-bind:to="item.route"
          v-bind:disabled="item?.route === undefined"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <slot></slot>
    </v-main>
  </v-app>
</template>
