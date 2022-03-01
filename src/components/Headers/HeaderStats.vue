<template>
  <!-- Header -->
  <div class="relative pb-4 pt-4">
    <div class="px-4 md:px-10 mx-auto w-full">
      <div>
        <!-- Card stats -->
        <div class="flex flex-wrap">
          <div
            class="w-1/4 px-4"
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
          statSubtitle: 'TRAFFIC',
          statTitle: '350,897',
          statArrow: 'up',
          statPercent: '3.48',
          statPercentColor: 'text-emerald-500',
          statDescripiron: 'Since last month',
          statIconName: 'far fa-chart-bar',
          statIconColor: 'bg-red-500',
          active: true,
        },
        {
          statSubtitle: 'NEW USERS',
          statTitle: '2,356',
          statArrow: 'down',
          statPercent: '3.48',
          statPercentColor: 'text-red-500',
          statDescripiron: 'Since last week',
          statIconName: 'fas fa-chart-pie',
          statIconColor: 'bg-orange-500',
          active: true,
        },
        {
          statSubtitle: 'SALES',
          statTitle: '0',
          statArrow: 'down',
          statPercent: '1.10',
          statPercentColor: 'text-orange-500',
          statDescripiron: 'Since yesterday',
          statIconName: 'fas fa-users',
          statIconColor: 'bg-pink-500',
          active: true,
        },
        {
          statSubtitle: 'PERFORMANCE',
          statTitle: '49,65%',
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
          active: false,
        },
      ],
    };
  },
  created() {
    const { path } = this.$route;
    this.route = path.split('/').filter((i) => i);
    this.getAnalyticsHeaderStats(this.route[1]);
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
      this.headerStats[3].statTitle = newValue;
    },
    computedPorcentageEvents(newValue) {
      this.headerStats[3].statPercent = newValue.toString();
    },
  },
  methods: {
    getAnalyticsHeaderStats(path) {
      if (path === 'analytics') {
        console.log('Entra aqui');
        this.headerStats.splice(2, 1);
        this.headerStats[3].active = true;
      }
    },
  },
};
</script>
