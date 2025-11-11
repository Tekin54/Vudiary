import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

// Axios Basis-URL abhängig von Dev/Prod
axios.defaults.baseURL = import.meta.env.DEV
  ? 'http://localhost:3000' // Lokales Backend
  : 'https://vudiary.onrender.com'; // Dein Render Backend

// Reaktive Variablen
let text = ref('');
let textareaModel = ref('');

export const useDiaryStore = defineStore('diaryStore', () => {
  // Benutzerinfo
  const owner = {
    name: 'Gültekin Öztürk',
    mail: 'oeztuerk.g54@gmail.com',
  };

  // Tabellen-Spalten
  const columns = ref([
    { name: 'seite', align: 'center', label: 'Seite', field: 'page', sortable: true },
    { name: 'title', align: 'center', label: 'Eintragstitel', field: 'title', sortable: true },
    { name: 'datum', align: 'center', label: 'Datum', field: 'date', sortable: true },
    {
      name: 'lastchangefull',
      align: 'center',
      label: 'Zuletzt Geändert',
      field: 'last_changed',
      sortable: true,
    },
    { name: 'plz', align: 'center', label: 'PLZ', field: 'plz', sortable: true },
    { name: 'ort', align: 'center', label: 'Ort', field: 'ort', sortable: true },
    { name: 'straße', align: 'center', label: 'Straße', field: 'straße', sortable: true },
    { name: 'mood', align: 'center', label: 'Mood', field: 'mood', sortable: true },
    { name: 'aktionen', align: 'center', label: 'Aktionen', sortable: false },
  ]);

  // =========================
  // GET DATA + POLLING
  // =========================
  let list = ref([]);
  let pollingInterval = null;

  const getdata = async (startPolling = true) => {
    try {
      const { data } = await axios.get('/api/eintraege');
      list.value = data;

      // Polling starten, falls noch nicht aktiv
      if (startPolling && !pollingInterval) {
        pollingInterval = setInterval(async () => {
          try {
            const { data } = await axios.get('/api/eintraege');
            list.value = data;
          } catch (err) {
            console.error('Fehler beim Abrufen der Daten:', err);
          }
        }, 2000); // alle 2 Sekunden
      }
    } catch (err) {
      console.error('Fehler beim Abrufen der Daten:', err);
    }
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  };

  // =========================
  // DETAIL
  // =========================
  let obj = ref({});
  const getdataById = async (id) => {
    try {
      const { data } = await axios.get(`/api/eintraege/${id}`);
      obj.value = data;
    } catch (err) {
      console.error(`Fehler beim Abrufen des Eintrags ${id}:`, err);
    }
  };

  const detail = ref({});
  const fetchDetail = async (id) => {
    await getdataById(id);
    detail.value = obj.value;
  };

  // =========================
  // PATCH
  // =========================
  const patchtdataById = async (id, title, description, mood) => {
    try {
      const { data } = await axios.get(`/api/eintraege/${id}`);
      const currentDate = new Date();

      const updatedObj = {
        ...data,
        title,
        description,
        mood,
        last_changed_date: currentDate.toLocaleDateString(),
        last_changed_time: currentDate.toLocaleTimeString(),
        last_changed: `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`,
      };

      await axios.patch(`/api/eintraege/${id}`, updatedObj);

      // Liste aktualisieren
      await getdata(false);
    } catch (err) {
      console.error(`Fehler beim Patchen des Eintrags ${id}:`, err);
    }
  };

  // =========================
  // POST
  // =========================
  const getMaxPage = () => {
    if (list.value.length === 0) return 0;
    return Math.max(...list.value.map((item) => Number(item.page) || 0));
  };

  const posteintrag = async (title, description, date, mood, ort, straße, plz, time) => {
    try {
      const currentDate = new Date();
      const formatted_date = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

      await axios.post('/api/eintraege', {
        title,
        page: getMaxPage() + 1,
        description,
        date: formatted_date,
        mood,
        ort,
        straße,
        plz,
        time,
      });

      // Liste aktualisieren
      await getdata(false);
    } catch (err) {
      console.error('Fehler beim Erstellen des Eintrags:', err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteeintrag = async (id) => {
    try {
      await axios.delete(`/api/eintraege/${id}`);
      await getdata(false);
    } catch (err) {
      console.error(`Fehler beim Löschen des Eintrags ${id}:`, err);
    }
  };

  // =========================
  // Sonstiges
  // =========================
  let pathTO = ref();

  return {
    deleteeintrag,
    patchtdataById,
    stopPolling,
    list,
    getdata,
    obj,
    getdataById,
    owner,
    columns,
    text,
    textareaModel,
    detail,
    fetchDetail,
    posteintrag,
    pathTO,
  };
});
