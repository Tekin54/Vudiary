import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useDiaryStore } from './diaryStore';

export const useInputStore = defineStore('inputStore', () => {
  const diaryStore = useDiaryStore();
  const $q = useQuasar();

  // ----------------------------
  // State
  // ----------------------------
  const title = ref('');
  const description = ref('');
  const mood = ref(0);
  const ort = ref('');
  const straße = ref('');
  const plz = ref(0);
  const icons = [
    'sentiment_very_dissatisfied',
    'sentiment_dissatisfied',
    'sentiment_satisfied',
    'sentiment_very_satisfied',
  ];
  const changesSaved = ref(false);

  // Datum & Zeit
  const date = ref('');
  const time = ref('');

  const formatDate = (inputDate = new Date()) => {
    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTime = (inputDate = new Date()) => {
    const hours = inputDate.getHours().toString().padStart(2, '0');
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');
    const seconds = inputDate.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
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

  // ----------------------------
  // Actions
  // ----------------------------
  const resetFields = (data = null) => {
    title.value = data?.title || '';
    description.value = data?.description || '';
    mood.value = data?.mood || 0;
    ort.value = data?.ort || '';
    straße.value = data?.straße || '';
    plz.value = data?.plz || 0;
    date.value = formatDate();
    time.value = formatTime();
    changesSaved.value = false;
  };

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
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const { city, street, postcode } = await getLocationDetails(lat, lon);
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
            message: 'Fehler beim Laden der Standortdetails',
            color: 'red-5',
            icon: 'report_problem',
          });
        }
      },
      (err) => {
        console.error(err);
        $q.notify({
          message: 'Fehler bei Geolocation: ' + err.message,
          color: 'red-5',
          icon: 'report_problem',
        });
      },
    );
  };

  const getLocationDetails = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || !data.address) throw new Error('Adressinformationen fehlen');

    return {
      city:
        data.address.city || data.address.town || data.address.village || data.address.hamlet || '',
      street: data.address.road || data.address.pedestrian || '',
      postcode: data.address.postcode || '',
    };
  };

  const markSaved = () => {
    changesSaved.value = true;
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
    icons,
    selectedColor,
    changesSaved,
    resetFields,
    getLocation,
    getLocationDetails,
    markSaved,
  };
});
