<template>
  <div>
    <div class="flex flex-wrap">
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-line-chart />
      </div>
      <div class="w-full xl:w-4/12 px-4">
        <card-bar-chart />
      </div>
    </div>
    <div class="flex flex-wrap mt-4">
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-page-visits :page-visits="pageVisits" :total-sessions="totalSessions" />
      </div>
      <div class="w-full xl:w-4/12 px-4">
        <card-social-traffic />
      </div>
    </div>
  </div>
</template>
<script>
import CardLineChart from '@/components/Cards/CardLineChart.vue';
import CardBarChart from '@/components/Cards/CardBarChart.vue';
import CardPageVisits from '@/components/Cards/CardPageVisits.vue';
import CardSocialTraffic from '@/components/Cards/CardSocialTraffic.vue';
import axios from 'axios';

export default {
  name: 'dashboard-page',
  components: {
    CardLineChart,
    CardBarChart,
    CardPageVisits,
    CardSocialTraffic,
  },
  data() {
    return {
      dbInformation: [],
      uniqueUsers: [],
      pageVisits: [],
      totalSessions: 0,
    };
  },
  created() {
    this.getAnalytics();
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    getAnalytics() {
      axios
        .get(`${process.env.VUE_APP_API}/tracks/user?id=${this.computedUser.id}`)
        .then((response) => {
          const { data } = response;
          this.dbInformation = data.map((res) => ({
            created: res.created,
            id: res.id,
            mouseEvents: res.mouseEvents ? JSON.parse(res.mouseEvents) : '',
            scrollEvents: res.scrollEvents ? JSON.parse(res.scrollEvents) : '',
            userInfo: res.userInfo ? JSON.parse(res.userInfo) : '',
            keyboardEvents: res.keyboardEvents ? JSON.parse(res.keyboardEvents) : '',
            screenEvents: res.screenEvents ? JSON.parse(res.screenEvents) : '',
            url: res.url,
            device: res.device,
            ownerId: res.ownerId,
            screenHeight: res.screenHeight,
            screenWidth: res.screenWidth,
          }));
          this.uniqueUsers = [...new Set(this.dbInformation.map((item) => item.userInfo.IP))];
          this.calcAnalytics();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    calcAnalytics() {
      const mapedUrl = this.dbInformation.map((res) => ({
        url: res.url,
        ip: res.userInfo.IP,
      }));
      const separatedUrl = [];
      const unique = [];
      const routes = [...new Set(this.dbInformation.map((item) => item.url))];
      routes.forEach((res) => {
        const filtered = mapedUrl.filter((item) => item.url === res);
        filtered.sort((a, b) => a.ip.localeCompare(b.ip));
        const users = [...new Set(filtered.map((item) => item.ip))];
        unique.push({
          url: res,
          users: users.length,
          porcentage: (users.length * 100) / this.uniqueUsers.length,
          visits: filtered.length,
        });
        separatedUrl.push(filtered);
      });
      this.totalSessions = this.dbInformation.length;
      this.pageVisits = unique;
    },
  },
};
</script>
