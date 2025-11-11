<template>
  <div class="row justify-center q-mt-md">
    <q-card class="my-card" style="">
      <q-card-section>
        <div class="text-h3 text-weight-bolder q-mb-xl">Contact</div>
        <div class="col text-h6 q-gutter-md">
          <span class="row">Creator: {{ aboutViewVariables.name }}</span>
          <span class="row">Mail: {{ aboutViewVariables.mail }}</span>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none"> </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useDiaryStore } from '../stores/diaryStore';
const diaryStore = useDiaryStore();
const aboutViewVariables = diaryStore.variables_functions.views_specific.AboutView.variables;
</script>

<style lang="scss" scoped>
body {
  color: black;
}
</style>
