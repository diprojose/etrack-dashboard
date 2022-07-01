<template>
  <!-- Header -->
  <div class="relative pb-4 pt-4">
    <div class="mx-auto w-full">
      <div>
        <!-- Card stats -->
        <div class="flex flex-wrap">
          <div
            class="md:w-full lg:w-full sm:w-full w-full px-4"
            v-for="(stats, index) in headerStats"
            :key="index">
            <card-stats
              v-show="stats.active"
              :statSubtitle="stats.statSubtitle"
              :statTitle="stats.statTitle"
              :statArrow="stats.statArrow"
              :statPercent="stats.statPercent"
              :statPercentColor="stats.statPercentColor"
              :statDescripiron="stats.statDescripiron"
              :statIconName="stats.statIconName"
              :statIconColor="stats.statIconColor"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardStats from '@/components/Cards/CardStats.vue';

export default {
  components: {
    CardStats,
  },
  data() {
    return {
      route: '',
      selected: 0,
      headerStats: [
        {
          statSubtitle: 'SELECCIONES',
          statTitle: '0',
          statArrow: 'up',
          statPercent: '0',
          statPercentColor: 'text-green-500',
          statDescripiron: 'Interacciones',
          statIconName: 'fas fa-percent',
          statIconColor: 'bg-blue-500',
          active: true,
        },
      ],
    };
  },
  computed: {
    computedSelectedEvents() {
      return this.$store.state.selectedEvents;
    },
    computedPorcentageEvents() {
      return this.$store.state.porcentageEvents;
    },
  },
  watch: {
    computedSelectedEvents(newValue) {
      this.headerStats[0].statTitle = newValue;
    },
    computedPorcentageEvents(newValue) {
      this.headerStats[0].statPercent = newValue.toString();
    },
  },
};
</script>
