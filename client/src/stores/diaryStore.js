import { defineStore } from 'pinia';
import axios from 'axios';
import { reactive, ref } from 'vue';

// Setze Basis-URL je nach Umgebung
axios.defaults.baseURL = import.meta.env.DEV
  ? 'http://localhost:3000' // Lokales Backend
  : 'https://vudiary.onrender.com'; // Render-Backend

export const useDiaryStore = defineStore('diaryStore', () => {
  const variables_functions = reactive({
    non_specific: {
      variables: {
        list: [],
        detail: {},
      },
      functions: {
        getdata: async () => {
          try {
            const { data } = await axios.get('/api/eintraege');
            // sortieren nach page aufsteigend
            variables_functions.non_specific.variables.list = data.sort(
              (a, b) => Number(a.page) - Number(b.page),
            );
          } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
          }
        },

        getdataById: async (id) => {
          try {
            const { data } = await axios.get(`/api/eintraege/${id}`);
            variables_functions.non_specific.variables.detail = data;
          } catch (error) {
            console.error(`Fehler beim Abrufen des Eintrags mit ID ${id}:`, error);
          }
        },

        postentry: async (title, description, mood, ort, straße, plz, time) => {
          try {
            const currentDate = new Date();
            const formatted_date = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

            await axios.post('/api/eintraege', {
              title,
              page: variables_functions.non_specific.functions.getMaxPage() + 1,
              description,
              date: formatted_date,
              mood,
              ort,
              straße,
              plz,
              time,
            });

            await variables_functions.non_specific.functions.getdata();
          } catch (error) {
            console.error('Fehler beim Erstellen des Eintrags:', error);
          }
        },

        patchtdataById: async (id, title, description, mood) => {
          try {
            const { data: existing } = await axios.get(`/api/eintraege/${id}`);
            const currentDate = new Date();
            const updated = {
              ...existing,
              title,
              description,
              mood,
              last_changed: `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`,
            };

            await axios.patch(`/api/eintraege/${id}`, updated);
            await variables_functions.non_specific.functions.getdata();
          } catch (error) {
            console.error(`Fehler beim Aktualisieren des Eintrags mit ID ${id}:`, error);
          }
        },

        deleteentry: async (id) => {
          try {
            await axios.delete(`/api/eintraege/${id}`);
            await variables_functions.non_specific.functions.getdata();
          } catch (error) {
            console.error(`Fehler beim Löschen des Eintrags mit ID ${id}:`, error);
          }
        },

        getMaxPage: () => {
          const list = variables_functions.non_specific.variables.list;
          if (!list.length) return 0;
          return Math.max(...list.map((item) => Number(item.page) || 0));
        },
      },
    },

    // Views
    views_specific: {
      HomeView: {
        variables: {
          columns: [
            { name: 'seite', label: 'Seite', field: 'page', align: 'center', sortable: true },
            {
              name: 'title',
              label: 'Eintragstitel',
              field: 'title',
              align: 'center',
              sortable: true,
            },
            { name: 'datum', label: 'Datum', field: 'date', align: 'center', sortable: true },
            {
              name: 'lastchangefull',
              label: 'Zuletzt Geändert',
              field: 'last_changed',
              align: 'center',
              sortable: true,
            },
            { name: 'plz', label: 'PLZ', field: 'plz', align: 'center', sortable: true },
            { name: 'ort', label: 'Ort', field: 'ort', align: 'center', sortable: true },
            { name: 'straße', label: 'Straße', field: 'straße', align: 'center', sortable: true },
            { name: 'mood', label: 'Mood', field: 'mood', align: 'center', sortable: true },
            { name: 'aktionen', label: 'Aktionen', align: 'center', sortable: false },
          ],
        },
        functions: {},
      },
      ReadInpView: { variables: {}, functions: {} },
      EditInpView: { variables: {}, functions: {} },
      InputView: { variables: {}, functions: {} },
      AboutView: {
        variables: {
          name: 'Gültekin Öztürk',
          mail: 'oeztuerk.g54@gmail.com',
        },
        functions: {},
      },
      EditView: { variables: {}, functions: {} },
      LoginView: { variables: {}, functions: {} },
    },
  });
  // ----------------------------
  // Grunddaten & Spalten
  // ----------------------------

  // const columns = ref([
  //   { name: 'seite', label: 'Seite', field: 'page', align: 'center', sortable: true },
  //   { name: 'title', label: 'Eintragstitel', field: 'title', align: 'center', sortable: true },
  //   { name: 'datum', label: 'Datum', field: 'date', align: 'center', sortable: true },
  //   {
  //     name: 'lastchangefull',
  //     label: 'Zuletzt Geändert',
  //     field: 'last_changed',
  //     align: 'center',
  //     sortable: true,
  //   },
  //   { name: 'plz', label: 'PLZ', field: 'plz', align: 'center', sortable: true },
  //   { name: 'ort', label: 'Ort', field: 'ort', align: 'center', sortable: true },
  //   { name: 'straße', label: 'Straße', field: 'straße', align: 'center', sortable: true },
  //   { name: 'mood', label: 'Mood', field: 'mood', align: 'center', sortable: true },
  //   { name: 'aktionen', label: 'Aktionen', align: 'center', sortable: false },
  // ]);

  // ----------------------------
  // Reactive State
  // ----------------------------
  // const list = ref([]); // Alle Einträge
  // const detail = ref({}); // Detail eines Eintrags

  // ----------------------------
  // GET: Alle Einträge
  // ----------------------------
  // const getdata = async () => {
  //   try {
  //     const { data } = await axios.get('/api/eintraege');
  //     list.value = data;
  //   } catch (error) {
  //     console.error('Fehler beim Abrufen der Daten:', error);
  //   }
  // };

  // ----------------------------
  // GET: Eintrag nach ID
  // ----------------------------
  // const getdataById = async (id) => {
  //   try {
  //     const { data } = await axios.get(`/api/eintraege/${id}`);
  //     detail.value = data;
  //   } catch (error) {
  //     console.error(`Fehler beim Abrufen des Eintrags mit ID ${id}:`, error);
  //   }
  // };

  // ----------------------------
  // POST: Neuer Eintrag
  // ----------------------------
  // let postentry = async (title, description, mood, ort, straße, plz, time) => {
  //   const currentDate = new Date();
  //   let last_changed_date = currentDate.toLocaleDateString(); // Datum aktualisieren
  //   let last_changed_time = currentDate.toLocaleTimeString(); // Uhrzeit aktualisieren
  //   let formatted_date = `${last_changed_date} ${last_changed_time}`;
  //   console.log(formatted_date);
  //   await axios.post('/api/eintraege', {
  //     title,
  //     page: getMaxPage() + 1,
  //     description,
  //     date: formatted_date,
  //     mood,
  //     ort,
  //     straße,
  //     plz,
  //     time,
  //   });
  // };

  // ----------------------------
  // PATCH: Eintrag bearbeiten
  // ----------------------------
  // const patchtdataById = async (id, title, description, mood) => {
  //   try {
  //     const { data: existing } = await axios.get(`/api/eintraege/${id}`);

  //     const currentDate = new Date();
  //     const updated = {
  //       ...existing,
  //       title,
  //       description,
  //       mood,
  //       last_changed: `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`,
  //     };

  //     await axios.patch(`/api/eintraege/${id}`, updated);

  //     // Daten nach dem Patchen aktualisieren
  //     await getdata();
  //   } catch (error) {
  //     console.error(`Fehler beim Aktualisieren des Eintrags mit ID ${id}:`, error);
  //   }
  // };

  // ----------------------------
  // DELETE: Eintrag löschen
  // ----------------------------
  // const deleteentry = async (id) => {
  //   try {
  //     await axios.delete(`/api/eintraege/${id}`);
  //     await getdata(); // Daten nach Löschen aktualisieren
  //   } catch (error) {
  //     console.error(`Fehler beim Löschen des Eintrags mit ID ${id}:`, error);
  //   }
  // };

  // ----------------------------
  // Hilfsfunktion: Max. Seite berechnen
  // ----------------------------
  // const getMaxPage = () => {
  //   if (!list.value.length) return 0;
  //   return Math.max(...list.value.map((item) => Number(item.page) || 0));
  // };

  // ----------------------------
  // Export State & Funktionen
  // ----------------------------
  return {
    variables_functions,
  };
});
