<template>
  <div>
    <div class="row wrap justify-between items-end">
      <div class="col">
        <q-input
          :disable="true"
          color="green-5"
          :class="$q.screen.lt.sm ? 'q-pl-xl q-pt-lg text-h6' : 'q-pl-xl q-pt-lg text-h5'"
          v-model="diaryStore.detail.title"
          label="Titel"
          stack-label
          :dense="dense"
        />
      </div>
      <div class="col text-right">
        <q-btn
          :disable="true"
          color="grey-2"
          icon="gps_fixed"
          class="text-red text-weight-bold q-mr-xl q-mt-lg"
          :label="$q.screen.lt.sm ? '' : 'Get Location'"
          @click="getLocation"
        ></q-btn>
      </div>
    </div>
    <div class="q-ma-xl col">
      <q-input
        :disable="true"
        :class="$q.screen.lt.sm ? 'text-h7' : 'text-h6'"
        v-model="diaryStore.detail.description"
        filled
        clearable
        type="textarea"
        color="green-5"
        label="Eintrag für heute"
        hint="Press TAB to autocomplete suggested value or ESC to cancel suggestion"
        :shadow-text="textareaShadowText"
        @keydown="processTextareaFill"
        @focus="processTextareaFill"
        rows="20"
      />
    </div>
    <div class="q-ml-xl text-h5 text-bold">Dein Mood:</div>
    <div class="q-ml-xl q-mt-sm">
      <q-rating
        :size="$q.screen.lt.sm ? '2.5em' : '4.5em'"
        :disable="true"
        v-model="diaryStore.detail.mood"
        :max="4"
        color="green-5"
        :icon="icons"
      />
    </div>
    <div class="absolute-bottom-left row q-mb-md q-ml-md">
      <div>
        <q-btn @click="zurück()" label="Zurück" icon="keyboard_backspace"></q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDiaryStore } from '../stores/diaryStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({ id: String });
const diaryStore = useDiaryStore();

const $q = useQuasar();

let icons = [
  'sentiment_very_dissatisfied',
  'sentiment_dissatisfied',
  'sentiment_satisfied',
  'sentiment_very_satisfied',
];

// FUNKTIONSAUFRUF
diaryStore.fetchDetail(props.id);

let zurück = () => {
  router.push('/');
};
</script>
