<template>
  <!-- Header -->
  <div class="relative pb-8 pt-4">
    <div class="mx-auto w-full">
      <div>
        <!-- Card stats -->
        <div class="flex flex-wrap">
          <div
            class="md:w-1/3 lg:w-1/3 sm:w-full w-full px-4"
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
          statPercentColor: 'text-green-500',
          statDescripiron: 'Desde el ultimo mes',
          statIconName: 'far fa-chart-bar',
          statIconColor: 'bg-red-500',
          active: true,
        },
        {
          statSubtitle: 'PÁGINAS VISTAS',
          statTitle: '0',
          statArrow: 'down',
          statPercent: '3.48',
          statPercentColor: 'text-red-500',
          statDescripiron: '',
          statIconName: 'fas fa-chart-pie',
          statIconColor: 'bg-yellow-500',
          active: true,
        },
        {
          statSubtitle: 'PÁGINAS REGISTRADAS',
          statTitle: '0',
          statArrow: 'up',
          statPercent: '',
          statPercentColor: 'text-green-500',
          statDescripiron: '',
          statIconName: 'fas fa-globe',
          statIconColor: 'bg-blue-500',
          active: true,
        },
      ],
    };
  },
  computed: {
    computedAnalyticsheaderValues() {
      return this.$store.state.analyticsHeaderValues;
    },
  },
  watch: {
    computedAnalyticsheaderValues(newValue) {
      this.headerStats[0].statTitle = newValue.newUsers.toString();
      this.headerStats[1].statTitle = newValue.views.toString();
      this.headerStats[2].statTitle = newValue.websites.toString();
    },
  },
};
</script>
