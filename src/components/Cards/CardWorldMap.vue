<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
            Usuarios
          </h6>
          <h2 class="text-blueGray-700 text-xl font-semibold">
            Por país
          </h2>
        </div>
      </div>
    </div>
    <div class="flex-auto">
      <div class="relative h-350-px" v-if="showMap">
        <div class="px-4">
          <VueWorldMap :country-data="countrys" >
            <template v-slot:overlay>
              <p>Test</p>
            </template>
          </VueWorldMap>
        </div>
        <div class="legend">
          <dynamic-table :columns="columns" :shadow-border="false" :rows="legend" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueWorldMap from 'world-map-vue';
import DynamicTable from '@/components/Table/Table.vue';

export default {
  name: 'WorldMap',
  components: {
    VueWorldMap,
    DynamicTable,
  },
  props: {
    countrys: {
      type: Object,
      default: () => {},
    },
    showWorldMap: {
      type: Boolean,
      default: false,
    },
    legend: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      worldData: {},
      showMap: false,
      columns: [
        {
          name: 'País',
        },
        {
          name: 'Visitas',
        },
      ],
    };
  },
  watch: {
    showWorldMap: {
      deep: true,
      handler(newValue) {
        this.showMap = newValue;
      },
    },
  },
  mounted() {
  },
};
</script>
