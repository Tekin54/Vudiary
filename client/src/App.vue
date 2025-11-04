<script setup>
import { ref, onMounted } from 'vue';

const leftDrawerOpen = ref(false);
const update = ref(false);

const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value);

const updatePage = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
};

onMounted(async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  registration.addEventListener('updatefound', () => (update.value = true));
  if (registration.waiting) update.value = true;
});
</script>

<template>
  <div class="update-banner row justify-center full-width z-top fixed q-mt-lg" v-if="update">
    <q-banner class="update-banner-content text-white q-pa-md bg-warning text-center">
      <div class="update-banner-inner">
        <span class="update-title">A new Update is available!</span>
        <div class="q-mt-sm">
          <q-btn class="update-btn text-caption" @click="updatePage" label="Restart Now!" />
        </div>
      </div>
    </q-banner>
  </div>

  <q-layout view="hHh lpR fFf">
    <q-header elevated class="header text-white q-pa-sm" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round @click="toggleLeftDrawer">
          <icon class="text-white icon_drawer" icon="ic:baseline-menu"></icon>
        </q-btn>

        <q-toolbar-title>
          <router-link to="/" class="q-toolbar-title" style="text-decoration: none; color: inherit">
            <q-avatar>
              <img src="./assets/images/vudiary_Logo.svg" />
            </q-avatar>
            Vudiary
          </router-link>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :width="200" :breakpoint="500" bordered class="bg-grey-3">
      <q-scroll-area class="fit">
        <router-link to="/" class="q-toolbar-title rl-item">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <icon class="icon_drawer" icon="ic:baseline-home" />
            </q-item-section>
            <q-item-section>Home</q-item-section>
          </q-item>
        </router-link>

        <router-link to="/input" class="q-toolbar-title rl-item">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <icon class="icon_drawer" icon="ic:baseline-add" />
            </q-item-section>
            <q-item-section>Input</q-item-section>
          </q-item>
        </router-link>

        <router-link to="/edit" class="q-toolbar-title rl-item">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <icon class="icon_drawer" icon="material-symbols:edit-rounded" />
            </q-item-section>
            <q-item-section>Edit</q-item-section>
          </q-item>
        </router-link>

        <router-link to="/about" class="q-toolbar-title rl-item">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <icon class="icon_drawer" icon="material-symbols:info" />
            </q-item-section>
            <q-item-section>About</q-item-section>
          </q-item>
        </router-link>
      </q-scroll-area></q-drawer
    >

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
@font-face {
  font-family: 'Montserrat';
  src: url('./assets/fonts/Montserrat/Montserrat-Regular.ttf') format('truetype');
}

* {
  font-family: 'Montserrat';
}

.rl-item {
  color: black;
  text-decoration: none;
}

.header {
  background: linear-gradient(135deg, #4bc281 0%, #4a90e2 50%, #2d9866 100%);
  backdrop-filter: blur(5px);
}

.icon_drawer {
  width: 25px;
  height: 25px;
}
</style>
