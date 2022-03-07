<template>
  <!-- Header -->
  <div class="relative pb-4 pt-4">
    <div class="mx-auto w-full">
      <div>
        <!-- Card stats -->
        <div class="flex flex-wrap">
          <div
            class="md:w-1/4 lg:w-1/4 sm:w-full w-full px-4"
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
          statSubtitle: 'USUARIOS NUEVOS',
          statTitle: '0',
          statArrow: 'up',
          statPercent: '3.48',
          statPercentColor: 'text-emerald-500',
          statDescripiron: 'Desde el ultimo mes',
          statIconName: 'far fa-chart-bar',
          statIconColor: 'bg-red-500',
          active: true,
        },
        {
          statSubtitle: 'URLS VISTAS',
          statTitle: '0',
          statArrow: 'down',
          statPercent: '3.48',
          statPercentColor: 'text-red-500',
          statDescripiron: 'Desde la semana pasada',
          statIconName: 'fas fa-chart-pie',
          statIconColor: 'bg-orange-500',
          active: true,
        },
        {
          statSubtitle: 'PÁGINAS REGISTRADAS',
          statTitle: '0',
          statArrow: 'up',
          statPercent: '12',
          statPercentColor: 'text-emerald-500',
          statDescripiron: 'Since last month',
          statIconName: 'fas fa-percent',
          statIconColor: 'bg-blue-500',
          active: true,
        },
        {
          statSubtitle: 'SELECCIONES',
          statTitle: '0',
          statArrow: 'up',
          statPercent: '0',
          statPercentColor: 'text-emerald-500',
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
    computedAnalyticsheaderValues() {
      return this.$store.state.analyticsHeaderValues;
    },
  },
  watch: {
    computedSelectedEvents(newValue) {
      this.headerStats[3].statTitle = newValue;
    },
    computedPorcentageEvents(newValue) {
      this.headerStats[3].statPercent = newValue.toString();
    },
    computedAnalyticsheaderValues(newValue) {
      this.headerStats[0].statTitle = newValue.newUsers.toString();
      this.headerStats[1].statTitle = newValue.views.toString();
      this.headerStats[2].statTitle = newValue.websites.toString();
    },
  },
};
</script>
