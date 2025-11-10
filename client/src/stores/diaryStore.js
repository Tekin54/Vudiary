import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

// ✅ BASE_URL für lokal und online
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let text = ref('');
let textareaModel = ref('');

export const useDiaryStore = defineStore('diaryStore', () => {
  const owner = {
    name: 'Gültekin Öztürk',
    mail: 'oeztuerk.g54@gmail.com',
    tel: '06605800032',
  };
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

  //GET DATA
  let list = ref([]);
  let pollingInterval = null;

  let getdata = async (startPolling = true) => {
    try {
      let { data } = await axios.get(`${BASE_URL}/eintraege`);
      list.value = data;

      if (startPolling && !pollingInterval) {
        pollingInterval = setInterval(async () => {
          try {
            let { data } = await axios.get(`${BASE_URL}/eintraege`);
            list.value = data;
          } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
    }
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  };

  //DETAIL
  let obj = ref({});
  let getdataById = async (id) => {
    let { data } = await axios.get(`${BASE_URL}/eintraege/${id}`);
    obj.value = data;
  };
  const detail = ref({});
  const fetchDetail = async (id) => {
    await getdataById(id);
    detail.value = obj.value;
  };

  //PATCH
  let patchtdataById = async (id, title, description, mood) => {
    try {
      let response = await axios.get(`${BASE_URL}/eintraege/${id}`);
      const currentDate = new Date();
      let obj = response.data;
      obj.title = title;
      obj.description = description;
      obj.mood = mood;
      obj.last_changed_date = currentDate.toLocaleDateString();
      obj.last_changed_time = currentDate.toLocaleTimeString();
      obj.last_changed = `${obj.last_changed_date} ${obj.last_changed_time}`;
      await axios.patch(`${BASE_URL}/eintraege/${id}`, obj);
    } catch (error) {
      console.error(`Fehler beim Patchen des Eintrags mit ID ${id}:`, error);
    }
  };

  //POST
  let posteintrag = async (title, description, date, mood, ort, straße, plz, time) => {
    const currentDate = new Date();
    let last_changed_date = currentDate.toLocaleDateString();
    let last_changed_time = currentDate.toLocaleTimeString();
    let formatted_date = `${last_changed_date} ${last_changed_time}`;
    console.log(formatted_date);
    await axios.post(`${BASE_URL}/eintraege`, {
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
    // 🔹 Direkt nach POST die Liste neu laden, damit maxPage korrekt bleibt
    await getdata(false);
  };

  const getMaxPage = () => {
    if (list.value.length === 0) return 0;
    return Math.max(...list.value.map((item) => Number(item.page) || 0));
  };

  let deleteeintrag = async (id) => {
    await axios.delete(`${BASE_URL}/eintraege/${id}`);
    await getdata(false); // Liste sofort aktualisieren
  };

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
