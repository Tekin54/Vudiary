import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useDiaryStore } from '../stores/diaryStore';

export const useInputStore = defineStore('inputStore', () => {
  const diaryStore = useDiaryStore();
  const $q = useQuasar();

  // ----------------------------
  // Variablen
  // ----------------------------
  const title = ref('');
  const description = ref('');
  const mood = ref(0);
  const ort = ref('');
  const straße = ref('');
  const plz = ref(0);
  const date = ref('');
  const time = ref('');
  const page = ref(1);

  const icons = [
    'sentiment_very_dissatisfied',
    'sentiment_dissatisfied',
    'sentiment_satisfied',
    'sentiment_very_satisfied',
  ];

  // ----------------------------
  // Computed
  // ----------------------------
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

  // ----------------------------
  // Helper Funktionen
  // ----------------------------
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

  const updatePage = () => {
    page.value = diaryStore.variables_functions.non_specific.variables.list.length + 1;
  };

  // Felder zurücksetzen
  const resetFields = () => {
    title.value = '';
    description.value = '';
    mood.value = 0;
    ort.value = '';
    straße.value = '';
    plz.value = 0;
    date.value = formatDate(new Date());
    time.value = formatTime(new Date());
  };

  // ----------------------------
  // Actions
  // ----------------------------
  const getLocation = () => {
    if (!navigator.geolocation) {
      $q.notify({
        message: 'Geolocation wird nicht unterstützt.',
        color: 'yellow-5',
        icon: 'warning',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const { city, street, postcode } = await getLocationDetails(latitude, longitude);
          ort.value = city;
          straße.value = street;
          plz.value = postcode;

          const message = postcode
            ? `Aktuelle Position: ${postcode}, ${city}, ${street}`
            : `Aktuelle Position: ${city}, ${street}`;

          $q.notify({ message, color: '#4a90e2', icon: 'done' });
        } catch (err) {
          console.error(err);
          $q.notify({
            message: 'Fehler bei der Abfrage der Standortdetails',
            color: 'red-5',
            icon: 'report_problem',
          });
        }
      },
      (err) => {
        console.error(err);
        $q.notify({
          message: 'Fehler bei der Geolocation: ' + err.message,
          color: 'red-5',
          icon: 'report_problem',
        });
      },
    );
  };

  const getLocationDetails = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || !data.address) throw new Error('Adressinformationen fehlen');

    const city =
      data.address.city || data.address.town || data.address.village || data.address.hamlet;
    const street = data.address.road || data.address.pedestrian || '';
    const postcode = data.address.postcode || '';
    return { city, street, postcode };
  };
  // ----------------------------
  // POST: Neuer Eintrag
  // ----------------------------

  const postEntry = async () => {
    try {
      const formattedDate = formatDate(new Date());
      const formattedTime = formatTime(new Date());

      await diaryStore.variables_functions.non_specific.functions.postentry(
        title.value,
        description.value,
        mood.value,
        ort.value,
        straße.value,
        plz.value,
        formattedTime,
      );

      resetFields(); // Felder zurücksetzen
      await diaryStore.variables_functions.non_specific.functions.getdata(); // Liste neu laden
      updatePage();

      $q.notify({ message: 'Eintrag erfolgreich gespeichert!', color: 'green-6', icon: 'done' });
    } catch (err) {
      console.error('Fehler beim Posten:', err);
      $q.notify({
        message: 'Fehler beim Speichern des Eintrags!',
        color: 'red-5',
        icon: 'report_problem',
      });
    }
  };

  // ----------------------------
  // Initial Setup
  // ----------------------------
  resetFields();

  return {
    title,
    description,
    mood,
    ort,
    straße,
    plz,
    date,
    time,
    page,
    icons,
    selectedColor,
    getLocation,
    getLocationDetails,
    postEntry,
    updatePage,
    resetFields,
  };
});
