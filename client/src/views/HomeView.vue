<template>
  <div class="column items-center q-mt-md">
    <q-table
      flat
      bordered
      grid
      title="Einträge"
      title-class="text-h4 text-weight-bold  q-py-sm"
      :rows="filteredlist.length > 0 ? filteredlist : diaryStore.list"
      :columns="diaryStore.columns"
      row-key="name"
      :filter="filter"
      hide-header
      card-container-class="justify-center"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <icon icon="ic:outline-search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-md row items-center q-gutter-md">
          <div style="max-width: 300px">
            <q-card class="cursor-pointer my-card">
              <div
                class="column text-h1 text-center justify-center"
                style="
                  width: 300px;
                  height: 200px;
                  border-radius: 25px;
                  position: relative;
                  filter: blur(0px);
                "
                @click="() => $router.push(`/read/${props.row.id}`)"
              >
                <span class="seite">
                  {{ props.row.page }}
                </span>
              </div>

              <q-card-section class="info-section">
                <div class="info-content">
                  <div class="text-caption">Title: {{ props.row.title }}</div>
                  <div class="text-caption">Date: {{ props.row.date }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { useDiaryStore } from '../stores/diaryStore';
import { ref, watch, onUnmounted } from 'vue';

const diaryStore = useDiaryStore();
const filter = ref('');
const filteredlist = ref([]);

// Lade Daten beim Start mit aktiviertem Polling
diaryStore.getdata(true);

// Cleanup beim Verlassen der Komponente
onUnmounted(() => {
  diaryStore.stopPolling();
});

// Filtere Liste wenn sich der Suchbegriff ändert
watch(filter, (newValue) => {
  filteredlist.value = diaryStore.list.filter((item) =>
    item.title.toLowerCase().includes(newValue.toLowerCase()),
  );
});
</script>

<style lang="scss" scoped>
/* Ungenutzte Styles entfernt */

.seite {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  color: #4a90e2;
  font-size: 2em;
  background-color: #a1cdff;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 10px;
}

.info-section {
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.q-card:hover .info-section {
  opacity: 1;
  transform: translateY(0);
}

.info-content {
  padding: 8px;
  background: #a1cdff;
  border-radius: 8px;
}

.my-card {
  border: 2px solid black;
  border-color: #4a90e2;
  border-radius: 25px;
  width: 100%;
  color: #4a90e2;
  transition: transform 0.2s ease;
}

.my-card:hover {
  transform: translateY(-5px);
}
</style>
