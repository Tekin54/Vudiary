<template>
  <div class="col justify-center">
    <div class="row justify-between items-end">
      <div class="col">
        <q-input
          color="#4a90e2"
          :class="$q.screen.lt.sm ? 'q-pl-xl q-pt-lg text-h6' : 'q-pl-xl q-pt-lg text-h5'"
          v-model="title"
          label="Titel"
          stack-label
          :dense="dense"
        />
      </div>
      <div class="col text-right">
        <q-btn
          color="grey-2"
          class="text-red text-weight-bold q-mr-xl q-mt-lg"
          @click="getLocation()"
          ><icon
            :class="$q.screen.lt.sm ? '' : 'q-mr-sm'"
            style="width: 20px; height: 20px"
            icon="ic:outline-gps-fixed"
          ></icon
          ><span v-if="!$q.screen.lt.sm">Get Location</span></q-btn
        >
      </div>
    </div>
    <div class="q-ma-xl col">
      <q-input
        :class="$q.screen.lt.sm ? 'text-h7' : 'text-h6'"
        v-model="description"
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
          />
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
          <q-btn
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
                diaryStore.variables_functions.non_specific.functions
                  .postentry(title, description, mood, ort, straße, plz, time)
                  .then(() => $router.push('/'));
              }
            "
          >
            <icon
              :class="$q.screen.lt.sm ? '' : 'q-mr-sm'"
              style="width: 20px; height: 20px"
              icon="material-symbols:save"
            ></icon
            ><span v-if="!$q.screen.lt.sm">Speichern</span></q-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDiaryStore } from '../stores/diaryStore';
import { ref, watch, onBeforeMount, computed } from 'vue';
import { useQuasar } from 'quasar';
let diaryStore = useDiaryStore();
diaryStore.variables_functions.non_specific.functions.getdata();
let leng = diaryStore.variables_functions.non_specific.variables.list;
console.log(leng);
const $q = useQuasar();
let icons = [
  'sentiment_very_dissatisfied',
  'sentiment_dissatisfied',
  'sentiment_satisfied',
  'sentiment_very_satisfied',
];
console.log(diaryStore.variables_functions.non_specific.variables.list.length);
let title = ref('');
let description = ref('');
let mood = ref(0);
let ort = ref('');
let straße = ref('');
let plz = ref(0);
let date = ref('');
let page = ref();
let time = ref('');

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
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);

        try {
          const { city, street, postcode } = await getLocationDetails(latitude, longitude);
          console.log('City:', city);
          console.log('Street:', street);
          console.log('PLZ:', postcode);

          ort.value = city;
          straße.value = street;
          plz.value = postcode;

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

        return { city, street, postcode };
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
date.value = formatDate(new Date());
time.value = formatTime(new Date());
onBeforeMount(() => {
  // Initiale Seitenzahl setzen
  updatePage();
});

const updatePage = () => {
  page.value = diaryStore.variables_functions.non_specific.variables.list.length + 1;
};

watch(
  () => diaryStore.variables_functions.non_specific.variables.list.length,
  () => {
    // Seitenzahl aktualisieren, wenn sich die Länge der Liste ändert
    updatePage();
  },
);
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
