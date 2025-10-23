<template>
  <div class="row justify-center q-mt-md">
    <q-card class="my-card text-white" style="background: #4bc281">
      <q-card-section>
        <div class="text-h3 text-weight-bolder q-mb-xl">Contact</div>
        <div class="col text-h6 q-gutter-md">
          <span class="row">Creator: {{ diaryStore.owner.name }} </span
          ><span class="row">Mail: {{ diaryStore.owner.mail }}</span
          ><span class="row">Tel.: {{ diaryStore.owner.tel }}</span>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ lorem }}
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useDiaryStore } from '../stores/diaryStore';
const diaryStore = useDiaryStore();
console.log(`The OWNER of this project ist the student '${diaryStore.owner.name}' `);
</script>

<style lang="scss" scoped></style>
