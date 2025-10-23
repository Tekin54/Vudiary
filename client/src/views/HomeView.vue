<template>
  <div class="column items-center q-mt-md">
    <q-table
      flat
      bordered
      grid
      title="Einträge"
      :rows="filteredlist.length > 0 ? filteredlist : diaryStore.list"
      :columns="diaryStore.columns"
      row-key="name"
      :filter="filter"
      hide-header
      card-container-class="justify-center"
    >
      <template v-slot:top-right>
        <q-input
          @keyup="handleKeyUp"
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <icon icon="ic:outline-search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-md row items-center q-gutter-md">
          <div style="max-width: 300px">
            <q-card
              style="
                border: 2px solid black;
                border-color: #4bc281;
                border-radius: 25px;
                width: 100%;
              "
              class="cursor-pointer"
            >
              <div
                class="column text-h1 text-center justify-center"
                style="
                  width: 300px;
                  height: 200px;
                  border-radius: 25px 25px 0px 0px;
                  position: relative;
                  filter: blur(0px);
                "
                @click="() => $router.push(`/read/${props.row.id}`)"
              >
                <span class="seite">
                  {{ props.row.page }}
                </span>
              </div>

              <q-card-section>
                <div class="text-h6 column items-center">
                  <icon
                    :icon="
                      props.row.showInfo
                        ? 'ic:baseline-keyboard-arrow-up'
                        : 'ic:baseline-keyboard-arrow-down'
                    "
                    @click="toggleInfo(props.row)"
                    class="cursor-pointer"
                    size="2em"
                  />
                </div>
                <q-expand-transition>
                  <div v-if="props.row.showInfo">
                    <div class="text-caption">Title: {{ props.row.title }}</div>
                    <div class="text-caption">Date: {{ props.row.date }}</div>
                  </div>
                </q-expand-transition>
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
const diaryStore = useDiaryStore();
import { ref, watch } from 'vue';
diaryStore.getdata();
let filter = ref('');
let filteredlist = ref([]);
watch(filter, (newValue) => {
  filteredlist.value = diaryStore.list.filter((item) => {
    return item.title.toLowerCase().includes(newValue.toLowerCase());
  });
});
const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
const toggleInfo = (item) => {
  item.showInfo = !item.showInfo;
};
</script>

<style lang="scss" scoped>
.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-radius: 25px 25px 0 0;
}

.image {
  width: 100%;
  height: 100%;
  border-radius: 25px 25px 0 0;
}

.seite {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  color: #4bc281;
  font-size: 2em; /* Ändern Sie die Schriftgröße je nach Bedarf */
  background-color: lightgreen;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 10px;
}
</style>
