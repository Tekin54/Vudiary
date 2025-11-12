<template>
  <div>
    <div class="row wrap justify-between items-end">
      <div class="col">
        <q-input
          color="#4a90e2"
          :class="$q.screen.lt.sm ? 'q-pl-xl q-pt-lg text-h6' : 'q-pl-xl q-pt-lg text-h5'"
          v-model="tt"
          label="Titel"
          stack-label
          :dense="dense"
        />
      </div>
      <div class="col text-right">
        <q-btn
          :disabled="true"
          color="grey-2"
          class="text-red text-weight-bold q-mr-xl q-mt-lg"
          @click="getLocation"
          ><icon
            class="q-mr-sm"
            style="width: 20px; height: 20px"
            icon="ic:outline-gps-fixed"
          ></icon>
          <span v-if="!$q.screen.lt.sm">Get Location</span></q-btn
        >
      </div>
    </div>
    <div class="q-ma-xl col">
      <q-input
        :class="$q.screen.lt.sm ? 'text-h7' : 'text-h6'"
        v-model="tam"
        filled
        clearable
        type="textarea"
        color="#4a90e2"
        label="Eintrag für heute"
        hint="Press TAB to autocomplete suggested value or ESC to cancel suggestion"
        :shadow-text="textareaShadowText"
        @keydown="processTextareaFill"
        @focus="processTextareaFill"
        rows="20"
      />
    </div>
    <div class="row justify-between q-ml-xl q-mr-xl">
      <div>
        <div class="text-h5 text-bold">Dein Mood:</div>
        <div class="q-mt-sm">
          <q-rating
            :size="$q.screen.lt.sm ? '2.5em' : '4.5em'"
            v-model="mood"
            :max="4"
            :icon="icons"
            :color="selectedColor"
          >
          </q-rating>
        </div>
      </div>
      <div
        align="center"
        :class="
          $q.screen.lt.sm
            ? 'row q-gutter-md q-mb-md justify-center q-mt-lg'
            : 'fixed-bottom-right absolute-bottom-right row q-gutter-md q-mb-md q-mr-xl'
        "
      >
        <div>
          <q-btn @click="alertver()"
            ><icon
              :class="$q.screen.lt.sm ? '' : 'q-mr-sm'"
              style="width: 20px; height: 20px"
              icon="ic:twotone-clear"
            ></icon
            ><span v-if="!$q.screen.lt.sm">Verwerfen</span></q-btn
          >
        </div>
        <div>
          <q-btn
            @click="
              () => {
                showNotif();
                diaryStore.variables_functions.non_specific.functions.patchtdataById(
                  props.id,
                  tt,
                  tam,
                  mood,
                  last_changed_date,
                  last_changed_time,
                );
                $router.push(`/edit/`);
              }
            "
            class=""
            ><icon
              :class="$q.screen.lt.sm ? '' : 'q-mr-sm'"
              style="width: 20px; height: 20px"
              icon="material-symbols:save"
            ></icon
            ><span v-if="!$q.screen.lt.sm">Speichern</span></q-btn
          >
        </div>
      </div>
    </div>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h5 column items-center text-center">
            <q-icon name="warning" size="3em" class="row" color="#4a90e2" />
            <span class="row">Achtung !</span>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none text-center">
          Es sieht so aus, als ob Sie Ihre Fortschritte nicht gespeichert haben. Möchten Sie
          fortfahren, ohne zu speichern?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="abbrechen" style="color: black" v-close-popup />
          <q-btn
            flat
            label="Fortsetzen"
            style="color: #4a90e2"
            @click="fortsetzen()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { useDiaryStore } from '../stores/diaryStore';
import { date, useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const props = defineProps({ id: String });
const diaryStore = useDiaryStore();
let changesSaved = ref(false);
let alert = ref();
let gesp = ref(false);
const $q = useQuasar();
let icons = [
  'sentiment_very_dissatisfied',
  'sentiment_dissatisfied',
  'sentiment_satisfied',
  'sentiment_very_satisfied',
];
let tt = ref(diaryStore.variables_functions.non_specific.variables.detail.title);
let tam = ref(diaryStore.variables_functions.non_specific.variables.description);
let mood = ref(diaryStore.variables_functions.non_specific.variables.mood);
const formatDate = (inputDate) => {
  const day = inputDate.getDate().toString().padStart(2, '0');
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
  const year = inputDate.getFullYear();
  return `${day}.${month}.${year}`;
};
const formatTime = (inputDate) => {
  const hours = inputDate.getHours().toString().padStart(2, '0');
  const minutes = inputDate.getMinutes().toString().padStart(2, '0');
  const seconds = inputDate.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};
let last_changed_date = formatDate(new Date());
let last_changed_time = formatTime(new Date());
console.log(`${last_changed_date} - ${last_changed_time}`);

let cont = ref();
// FUNKTIONSAUFRUF
diaryStore.variables_functions.non_specific.functions.getdataById(props.id);

// FUNKTIONEN
let fortsetzen = () => {
  cont.value = true;
  alert.value = false;
  if (diaryStore.pathTO) {
    router.push(diaryStore.pathTO);
    diaryStore.pathTO = '';
  } else {
    router.push('/edit');
    diaryStore.pathTO = '';
  }
};

let alertver = () => {
  if (
    !changesSaved.value &&
    (tt.value !== diaryStore.variables_functions.non_specific.variables.detail.title ||
      tam.value !== diaryStore.variables_functions.non_specific.variables.detail.description ||
      mood.value !== diaryStore.variables_functions.non_specific.variables.detail.mood)
  ) {
    alert.value = true;
  } else {
    alert.value = false;
    router.push('/edit/');
  }
};

onBeforeRouteLeave((to, from) => {
  if (
    !cont.value &&
    !changesSaved.value &&
    (tt.value !== diaryStore.variables_functions.non_specific.variables.detail.title ||
      tam.value !== diaryStore.variables_functions.non_specific.variables.detail.description ||
      mood.value !== diaryStore.variables_functions.non_specific.variables.detail.mood)
  ) {
    diaryStore.pathTO = to.path;
    alert.value = true;
    return false;
  } else {
    return true;
  }
});

let showNotif = function () {
  gesp.value = true;
  $q.notify({
    message: 'Gespeichert',
    color: '#4a90e2',
    icon: 'done',
  });
  changesSaved.value = true;
};

onMounted(async () => {
  await diaryStore.variables_functions.non_specific.functions.getdata(props.id);
  tt.value = diaryStore.variables_functions.non_specific.variables.detail.title;
  tam.value = diaryStore.variables_functions.non_specific.variables.detail.description;
  mood.value = diaryStore.variables_functions.non_specific.variables.detail.mood;
});

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);

        try {
          const { city, street, postcode, county } = await getLocationDetails(latitude, longitude);
          console.log('City:', city);
          console.log('Street:', street);

          const message = postcode
            ? `Aktuelle Position: ${postcode}, ${city}, ${street}`
            : `Aktuelle Position: ${city}, ${street}`;

          $q.notify({
            message: message,
            color: '#4a90e2',
            icon: 'done',
          });
        } catch (error) {
          console.error('Fehler bei der Abfrage der Standortdetails:', error.message);
          $q.notify({
            message: 'Fehler bei der Abfrage der Standortdetails: ' + error.message,
            color: 'red-5',
            icon: 'report_problem',
          });
        }
      },
      (error) => {
        console.error('Geolocation Fehler:', error.message);
        $q.notify({
          message: 'Fehler bei der Geolocation: ' + error.message,
          color: 'red-5',
          icon: 'report_problem',
        });
      },
    );
  } else {
    console.error('Geolocation wird nicht unterstützt.');
    $q.notify({
      message: 'Geolocation wird nicht unterstützt.',
      color: 'yellow-5',
      icon: 'warning',
    });
  }
};

const getLocationDetails = async (latitude, longitude) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      if (data.address) {
        const city =
          data.address.city || data.address.town || data.address.village || data.address.hamlet;
        const street = data.address.road || data.address.pedestrian;
        const postcode = data.address.postcode; // Postleitzahl
        const county = data.address.county; // Bezirk

        return { city, street, postcode, county };
      } else {
        throw new Error('Adressinformationen fehlen');
      }
    } else {
      throw new Error('Ungültige API-Antwort');
    }
  } catch (error) {
    console.error('Fehler beim Reverse-Geocoding:', error.message);
    throw error;
  }
};
const selectedColor = computed(() => {
  switch (mood.value) {
    case 1:
      return 'red-6';
    case 2:
      return 'orange-5';
    case 3:
      return 'light-green-5';
    case 4:
      return 'green-6';
    default:
      return 'grey-5';
  }
});
</script>

<style lang="scss" scoped></style>
