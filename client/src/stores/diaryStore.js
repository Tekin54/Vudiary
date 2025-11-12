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
        // Cache clearing Funktion
        clearApiCache: async () => {
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'CLEAR_API_CACHE',
            });
          }
        },

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

            await variables_functions.non_specific.functions.clearApiCache(); // ← NEU
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
            await variables_functions.non_specific.functions.clearApiCache(); // ← NEU
            await variables_functions.non_specific.functions.getdata();
          } catch (error) {
            console.error(`Fehler beim Aktualisieren des Eintrags mit ID ${id}:`, error);
          }
        },

        deleteentry: async (id) => {
          try {
            await axios.delete(`/api/eintraege/${id}`);
            await variables_functions.non_specific.functions.clearApiCache(); // ← NEU
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
          filter: '',
          filteredlist: [],
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
      EditInpView: {
        variables: {},
        functions: {},
      },
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

  return {
    variables_functions,
  };
});
