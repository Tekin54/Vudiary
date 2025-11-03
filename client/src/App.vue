<script setup>
import { ref, onMounted } from "vue";

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value);
let update = ref(false);
onMounted(async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    console.log("registration failed!");
    return;
  }
  registration.addEventListener("updatefound", () => (update.value = true));
  if (registration.waiting) update.value = true;
});
let updatepage = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) registration.waiting?.postMessage({ type: "SKIP_WAITING" });
  window.location.reload();
};
</script>

<template>
  <div class="row justify-center full-width z-top fixed q-mt-lg" v-if="update">
    <q-banner
      style="
        width: 90%;
        max-width: 400px;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      "
      class="text-white q-pa-md bg-warning text-center"
    >
      <div style="display: flex; flex-direction: column; align-items: center">
        <span style="font-size: 1.2rem; font-weight: bold"
          >A new Update is available!</span
        >
        <div style="margin-top: 10px">
          <q-btn
            class="text-caption"
            @click="updatepage()"
            label="Restart Now!"
            style="
              background-color: #4a90e2;
              color: white;
              padding: 10px 20px;
              border-radius: 6px;
              border: none;
            "
          />
        </div>
      </div>
    </q-banner>
  </div>

  <q-layout view="hHh lpR fFf">
    <q-header
      style="background-color: #4a90e2; backdrop-filter: blur(5px)"
      elevated
      class="text-white"
      height-hint="98"
    >
      <q-toolbar>
        <q-btn dense flat round @click="toggleLeftDrawer">
          <icon
            class="text-white"
            style="width: 20px; height: 20px"
            icon="ic:baseline-menu"
          ></icon>
        </q-btn>

        <q-toolbar-title>
          <router-link
            to="/"
            class="q-toolbar-title"
            style="text-decoration: none; color: inherit"
          >
            <q-avatar>
              <img src="./assets/images/vudiary_Logo.svg" />
            </q-avatar>
            Vudiary
          </router-link>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="200"
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <padding padding>
          <router-link to="/" class="q-toolbar-title rl-item">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <icon style="width: 25px; height: 25px" icon="ic:baseline-home" />
              </q-item-section>

              <q-item-section> Home </q-item-section>
            </q-item></router-link
          >
          <router-link to="/input" class="q-toolbar-title rl-item">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <icon style="width: 25px; height: 25px" icon="ic:baseline-add" />
              </q-item-section>

              <q-item-section> Input </q-item-section>
            </q-item></router-link
          >
          <router-link to="/edit" class="q-toolbar-title rl-item">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <icon
                  style="width: 25px; height: 25px"
                  icon="material-symbols:edit-rounded"
                />
              </q-item-section>

              <q-item-section> Edit </q-item-section>
            </q-item></router-link
          >
          <router-link to="/about" class="q-toolbar-title rl-item">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <icon style="width: 25px; height: 25px" icon="material-symbols:info" />
              </q-item-section>

              <q-item-section> About </q-item-section>
            </q-item></router-link
          ></padding
        ></q-scroll-area
      ></q-drawer
    >

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
@font-face {
  font-family: "Montserrat";
  src: url("./assets/fonts/Montserrat/Montserrat-Regular.ttf") format("truetype");
}

@font-face {
  font-family: "Lora";
  src: url("./assets/fonts/Lora/Lora-Regular.ttf") format("truetype");
}

@font-face {
  font-family: "LibreBodoni";
  src: url("./assets/fonts/LibreBodoni/LibreBodoni-Regular.ttf") format("truetype");
}

* {
  font-family: "Montserrat";
}

.rl-item {
  color: black;
  text-decoration: none;
}
</style>
