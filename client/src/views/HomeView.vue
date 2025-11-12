<template>
  <div class="column items-center q-mt-lg full-width">
    <!-- Header: Titel links, Searchbar rechts -->
    <div class="row items-center justify-between q-mb-xl header-row full-width">
      <div class="text-h4 text-weight-bold header-title">Einträge</div>
      <q-input
        dense
        debounce="300"
        v-model="diaryStore.variables_functions.views_specific.HomeView.variables.filter"
        placeholder="Search"
        outlined
        rounded
        class="header-search gradient-border"
      >
        <template v-slot:append>
          <icon icon="ic:outline-search" />
        </template>
      </q-input>
    </div>

    <!-- Tabelle -->
    <q-table
      flat
      bordered
      grid
      :rows="
        diaryStore.variables_functions.views_specific.HomeView.variables.filter
          ? diaryStore.variables_functions.views_specific.HomeView.variables.filteredlist
          : diaryStore.variables_functions.non_specific.variables.list
      "
      :columns="diaryStore.variables_functions.views_specific.HomeView.variables.columns"
      row-key="name"
      hide-header
      card-container-class="justify-center"
    >
      <template v-slot:item="props">
        <div class="q-pa-md row items-center q-gutter-md">
          <div style="max-width: 280px">
            <q-card class="cursor-pointer my-card">
              <div
                class="column text-h1 text-center justify-center"
                style="width: 280px; height: 180px; border-radius: 20px; position: relative"
                @click="() => $router.push(`/read/${props.row.id}`)"
              >
                <span class="seite">{{ props.row.page }}</span>
              </div>

              <q-card-section class="info-section">
                <div class="info-content">
                  <div class="text-caption text-bold">{{ props.row.title }}</div>
                  <div class="text-caption text-italic">{{ props.row.date }}</div>
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
import { watch } from 'vue';
import { useDiaryStore } from '../stores/diaryStore';

// -- Variablen --
const diaryStore = useDiaryStore();
// -- Funktionen --
diaryStore.variables_functions.non_specific.functions.getdata(true);

// Aktualisiert die gefilterte Liste basierend auf dem Suchbegriff
watch(
  () => diaryStore.variables_functions.views_specific.HomeView.variables.filter,
  (newValue) => {
    diaryStore.variables_functions.views_specific.HomeView.variables.filteredlist =
      diaryStore.variables_functions.non_specific.variables.list.filter((item) =>
        item.title.toLowerCase().includes(newValue.toLowerCase()),
      );
  },
);
</script>

<style scoped lang="scss">
/* Header */
.header-row {
  max-width: 900px;
  padding: 0 10px;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}

.header-title {
  white-space: nowrap;
}

.header-search {
  max-width: 250px;
  width: 100%;

  @media (max-width: 600px) {
    max-width: 100%;
  }
}

/* Gradient-Rahmen für Searchbar */
.gradient-border .q-field__control {
  border: 2px solid transparent;
  border-radius: 12px;
  background-clip: padding-box, border-box;
  border-image-slice: 1;
  border-image-source: linear-gradient(135deg, #4bc281 0%, #4a90e2 50%, #2d9866 100%);
}

.gradient-border.q-field--focused .q-field__control {
  border: 2px solid;
  border-image-source: linear-gradient(135deg, #4bc281 0%, #4a90e2 50%, #2d9866 100%);
}

/* Karten-Stil */
.my-card {
  position: relative;
  width: 100%;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(135deg, #4bc281 0%, #4a90e2 50%, #2d9866 100%);
  transition: transform 0.2s ease;
}

.my-card::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: #fff;
  border-radius: 18px;
  z-index: -1;
}

.seite {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.4em;
  font-weight: bold;
  background: linear-gradient(135deg, #4bc281 0%, #4a90e2 50%, #2d9866 100%);
  box-shadow: 0 10px 20px white;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.35);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.my-card:hover .seite {
  transform: translate(-50%, -50%) scale(1.2) rotateY(10deg) rotateX(10deg);
  box-shadow: 0 15px 25px white;
  text-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
}

.info-section {
  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.3s ease;
  margin-top: 10px;
}

.my-card:hover .info-section {
  opacity: 1;
  transform: translateY(0);
}

.info-content {
  padding: 10px;
  border-radius: 12px;
  text-align: center;
  font-size: 0.95em;
  line-height: 1.3em;
  color: white;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}
</style>
