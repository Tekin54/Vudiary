<script setup>
import { useDiaryStore } from '../stores/diaryStore';
import { onMounted, watch } from 'vue';

let icons = [
  'sentiment_very_dissatisfied',
  'sentiment_dissatisfied',
  'sentiment_satisfied',
  'sentiment_very_satisfied',
];

const diaryStore = useDiaryStore();

onMounted(() => {
  diaryStore.getdata();
});

let isDataLoading = false; // Flag, um zu überprüfen, ob Daten bereits geladen werden

watch(
  () => diaryStore.list,
  () => {
    if (!isDataLoading) {
      console.log('s');
      isDataLoading = true;
      diaryStore.getdata().then(() => {
        isDataLoading = false;
      });
    }
  },
);
</script>

<template>
  <div class="column items-center q-mt-md">
    <q-table
      :grid="$q.screen.lt.md"
      class="q-ma-lg"
      style="border-radius: 18px"
      flat
      bordered
      title="Meine Einträge"
      :rows="diaryStore.list"
      :columns="diaryStore.columns"
      row-key="name"
    >
      <template v-slot:header="props">
        <q-tr>
          <q-th class="text-bold" :props="props" :key="col.name" v-for="col in props.cols">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body-cell-mood="props">
        <q-td class="q-gutter-xs" :props="props">
          <q-rating
            size="2.5em"
            v-model="props.row.mood"
            :max="4"
            color="green-5"
            :icon="icons"
            readonly
          />
        </q-td>
      </template>
      <template v-slot:body-cell-lastchange="props">
        <q-td class="q-gutter-xs" :props="props">
          <div>{{ new Date(props.row.last_changed_date).toLocaleDateString() }}</div>
          <div>{{ new Date(props.row.last_changed_time).toLocaleTimeString() }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-aktionen="props">
        <q-td class="q-gutter-xs" :props="props">
          <q-btn
            style="border-radius: 15px; height: 50px; background-color: #4bc281"
            class="shadow-4"
            stack
            size="sm"
            :to="`/edit/input/${props.row.id}`"
            ><icon
              style="width: 20px; height: 20px; color: white"
              icon="material-symbols:edit-rounded"
            ></icon
          ></q-btn>
          <q-btn
            class="shadow-4 q-ml-sm"
            style="border-radius: 15px; height: 50px"
            @click="diaryStore.deleteeintrag(props.row.id)"
            stack
            size="sm"
            color="red"
            ><icon style="width: 20px; height: 20px" icon="ic:sharp-delete"></icon
          ></q-btn>
        </q-td>
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <div style="min-width: 250px">
            <q-card flat bordered class="q-mx-xs q-my-xs" style="border-radius: 10px">
              <q-card-section class="text-center">
                "{{ props.row.title }}"
                <br />
                <strong>{{ props.row.name }}</strong>
              </q-card-section>
              <q-separator />
              <q-card-section
                align="right"
                class="flex flex-center"
                :style="{ fontSize: props.row.calories / 2 + 'px' }"
              >
                <div>
                  <q-rating
                    v-model="props.row.mood"
                    :max="4"
                    size="3.5em"
                    color="green-5"
                    :icon="icons"
                    readonly
                  />
                </div>
              </q-card-section>
              <q-card-section class="row" :style="{ fontSize: props.row.calories / 2 + 'px' }">
                <div align="left" class="col" style="overflow-wrap: break-word">
                  <span class="text-weight-bolder">{{ props.row.ort }}</span
                  >, {{ props.row.date }}
                </div>
                <div align="right" class="col">Seite {{ props.row.page }}</div>
              </q-card-section>

              <q-card-section class="row justify-end">
                <q-btn
                  class="shadow-4"
                  style="border-radius: 18px; height: 50px"
                  stack
                  size="sm"
                  :to="`/edit/input/${props.row.id}`"
                >
                  <icon
                    style="width: 20px; height: 20px"
                    icon="material-symbols:edit-rounded"
                  ></icon>
                </q-btn>
                <q-btn
                  class="shadow-4"
                  style="border-radius: 18px; height: 50px; margin-left: 8px"
                  @click="diaryStore.deleteeintrag(props.row.id)"
                  label=""
                  stack
                  size="sm"
                  color="red"
                  ><icon style="width: 20px; height: 20px" icon="ic:sharp-delete"></icon
                ></q-btn>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>
