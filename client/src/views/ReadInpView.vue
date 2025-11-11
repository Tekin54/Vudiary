<template>
  <div class="readonly-view">
    <div class="row wrap justify-between items-end">
      <q-input
        readonly
        color="green-5"
        :class="$q.screen.lt.sm ? 'q-pl-xl q-pt-lg text-h6' : 'q-pl-xl q-pt-lg text-h5'"
        v-model="diaryStore.variables_functions.non_specific.variables.detail.title"
        label="Titel"
        stack-label
        :dense="dense"
      />
    </div>

    <div class="q-ma-xl col">
      <q-input
        readonly
        :class="$q.screen.lt.sm ? 'text-h7' : 'text-h6'"
        v-model="diaryStore.variables_functions.non_specific.variables.detail.description"
        filled
        clearable
        type="textarea"
        label="Eintrag für heute"
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
        readonly
        v-model="diaryStore.variables_functions.non_specific.variables.detail.mood"
        :max="4"
        :icon="icons"
        :color="selectedColor"
      >
      </q-rating>
    </div>
  </div>
</template>

<script setup>
import { useDiaryStore } from '../stores/diaryStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const props = defineProps({ id: String });
const diaryStore = useDiaryStore();
const $q = useQuasar();

// Mood-Icons
const icons = [
  'sentiment_very_dissatisfied',
  'sentiment_dissatisfied',
  'sentiment_satisfied',
  'sentiment_very_satisfied',
];

// Farbe dynamisch je nach Stimmung
const selectedColor = computed(() => {
  const mood = diaryStore.variables_functions.non_specific.variables.detail.mood;
  switch (mood) {
    case 1:
      return 'red-6'; // Sehr unzufrieden
    case 2:
      return 'orange-5'; // Unzufrieden
    case 3:
      return 'light-green-5'; // Zufrieden
    case 4:
      return 'green-6'; // Sehr zufrieden
    default:
      return 'grey-5'; // Fallback
  }
});

// Daten abrufen
diaryStore.variables_functions.non_specific.functions.getdataById(props.id);

const zurück = () => {
  router.push('/');
};
</script>
<style>
.readonly-view .q-field,
.readonly-view .q-field * {
  cursor: default !important;
}
</style>
