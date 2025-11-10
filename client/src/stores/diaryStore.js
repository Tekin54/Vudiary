import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
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

  // Daten abrufen mit optionalem Polling-Start
  let getdata = async (startPolling = true) => {
    try {
      let { data } = await axios.get('/api/eintraege');
      list.value = data;

      // Starte Polling nur wenn gewünscht und noch nicht aktiv
      if (startPolling && !pollingInterval) {
        pollingInterval = setInterval(async () => {
          try {
            let { data } = await axios.get('/api/eintraege');
            list.value = data;
          } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
          }
        }, 2000); // Alle 2 Sekunden aktualisieren
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
    }
  };

  // Polling stoppen wenn die App/Komponente beendet wird
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  };

  //DETAIL
  let obj = ref({});
  let getdataById = async (id) => {
    let { data } = await axios.get(`/api/eintraege/${id}`);
    obj.value = data;
  };
  const detail = ref({});
  const fetchDetail = async (id) => {
    await getdataById(id);
    // Die Daten sind jetzt in obj.value verfügbar
    detail.value = obj.value;
  };

  //PATCH
  let patchtdataById = async (id, title, description, mood) => {
    try {
      let response = await axios.get(`/api/eintraege/${id}`);
      const currentDate = new Date();
      let obj = response.data;
      obj.title = title;
      obj.description = description;
      obj.mood = mood;
      obj.last_changed_date = currentDate.toLocaleDateString(); // Datum aktualisieren
      obj.last_changed_time = currentDate.toLocaleTimeString(); // Uhrzeit aktualisieren
      obj.last_changed = `${obj.last_changed_date} ${obj.last_changed_time}`; // Kombinieren von Datum und Uhrzeit
      await axios.patch(`/eintraege/${id}`, obj);
    } catch (error) {
      console.error(`Fehler beim Patchen des Eintrags mit ID ${id}:`, error);
    }
  };

  //POST
  let posteintrag = async (title, description, date, mood, ort, straße, plz, time) => {
    const currentDate = new Date();
    let last_changed_date = currentDate.toLocaleDateString(); // Datum aktualisieren
    let last_changed_time = currentDate.toLocaleTimeString(); // Uhrzeit aktualisieren
    let formatted_date = `${last_changed_date} ${last_changed_time}`;
    console.log(formatted_date);
    await axios.post('/api/eintraege', {
      title,
      page: getMaxPage() + 1,
      description,
      date: formatted_date, // Hier 'date' verwenden, nicht 'formatted_date'
      mood,
      ort,
      straße,
      plz,
      time,
    });
  };
  const getMaxPage = () => {
    if (list.value.length === 0) return 0; // keine Einträge, dann 0
    return Math.max(...list.value.map((item) => Number(item.page) || 0));
  };
  let deleteeintrag = async (id) => {
    await axios.delete(`/api/eintraege/${id}`);
    getdata();
  };

  //TO Path Variable
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
