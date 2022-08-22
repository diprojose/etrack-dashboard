<template>
  <div>
    <header-stats />
    <div class="flex flex-wrap">
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-line-chart v-if="dataSets.length > 0" :data-sets="dataSets" class="mb-8" />
        <p class="bg-white rounded p-4 mb-8" v-if="dataSets.length === 0">Aún no tiene información</p>
        <dynamic-table :title="'De donde viene tu tráfico'" :columns="pageVisitsColumns" :rows="pageVisits" />
      </div>
      <div class="w-full xl:w-4/12 px-4">
        <dynamic-table :title="'Visitas por dispositivos'" :columns="devicesColumns" :text-center="true" :rows="devices" />
        <card-world-map :countrys="countryData" :legend="countries" :show-world-map="showWorldMap" />
      </div>
    </div>
  </div>
</template>
<script>
import CardLineChart from '@/components/Cards/CardLineChart.vue';
// import CardPageVisits from '@/components/Cards/CardPageVisits.vue';
import DynamicTable from '@/components/Table/Table.vue';
import { differenceInMilliseconds } from 'date-fns';
import axios from 'axios';
import headerStats from '../../components/Headers/HeaderStats.vue';
import CardWorldMap from '../../components/Cards/CardWorldMap.vue';

export default {
  name: 'dashboard-page',
  components: {
    CardLineChart,
    // CardPageVisits,
    DynamicTable,
    CardWorldMap,
    headerStats,
  },
  data() {
    return {
      emptyData: false,
      dbInformation: [],
      uniqueUsers: [],
      pageVisits: [],
      totalSessions: 0,
      usersInformation: [],
      dataSets: [],
      devices: [],
      countryData: {},
      showWorldMap: false,
      devicesColumns: [
        {
          name: 'Dispositivo',
        },
        {
          name: 'Visitas',
        },
      ],
      referrersColumns: [
        {
          name: 'Url',
        },
        {
          name: 'Usuarios',
        },
      ],
      pageVisitsColumns: [
        {
          name: 'Nombre de ruta',
        },
        {
          name: 'Visitas',
        },
        {
          name: 'Tasa de rebote',
        },
        {
          name: 'Usuarios',
        },
        {
          name: 'Tiempo en promedio (seg)',
        },
      ],
      referrers: [],
      websites: [],
      countries: [],
    };
  },
  created() {
    this.$store.dispatch('setTitle', `¡Bienvenido ${this.computedUser.name}! En esta sección puedes ver el resumen de tus Analytics.`);
    this.getWebsites();
    this.getAnalytics();
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    getWebsites() {
      const url = `${process.env.VUE_APP_API}/websites/user/${this.computedUser.id}`;
      axios
        .get(url)
        .then((response) => {
          const { data } = response;
          const sortedList = data
            .slice()
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          this.websites = sortedList;
          this.$store.dispatch('setAnalyticsHeaderWebsites', this.websites.length);
        })
        .catch(() => {
          // handle error
        })
        .then(() => {
          // always executed
        });
    },
    getAnalytics() {
      axios
        .get(`${process.env.VUE_APP_API}/tracks/user?id=${this.computedUser.id}`)
        .then((response) => {
          const { data } = response;
          this.dbInformation = data.map((res) => ({
            created: res.created,
            sended: res.sended,
            id: res.id,
            userInfo: res.userInfo ? this.transformUserInfo(res.userInfo) : '',
            url: res.url,
            device: res.device,
            ownerId: res.ownerId,
            screenHeight: res.screenHeight,
            screenWidth: res.screenWidth,
            referrer: res.referrer,
          }));
          this.uniqueUsers = [...new Set(this.dbInformation.map((item) => item.userInfo.ip))];
          this.devices = this.countForTableOccurrences('device', this.dbInformation);
          this.referrers = this.countForTableOccurrences('referrer', this.dbInformation);
          this.usersInformation = this.dbInformation.map((user) => ({
            ...user.userInfo,
            date: user.created,
          }));
          this.countries = this.countForTableOccurrences('country_name', this.usersInformation);
          const uniqueCountryCodes = [...new Set(this.usersInformation.map((item) => item.country_code2))];
          uniqueCountryCodes.forEach((country) => {
            this.countryData[country] = '#14329B';
          });
          const datesTraffic = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          this.usersInformation.forEach((info) => {
            const infoMonth = new Date(info.date).getMonth();
            datesTraffic[infoMonth] += 1;
          });
          this.dataSets = datesTraffic;
          this.$store.dispatch('setAnalyticsHeaderValues', {
            newUsers: this.uniqueUsers.length,
            views: this.dbInformation.length,
          });
          this.calcAnalytics();
        })
        .catch(() => {
          this.emptyData = true;
        });
    },
    countOccurrences(type, array) {
      const allOccurrences = array.map((occ) => (occ[type] ? occ[type] : 'Desconocido'));
      const OccurrencesValues = allOccurrences.reduce((acc, val) => {
        acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
        return acc;
      }, {});
      return Object.keys(OccurrencesValues).map((key) => {
        const occurrencesArray = {
          title: key,
          value: OccurrencesValues[key],
        };
        return occurrencesArray;
      });
    },
    devicesIcons(key) {
      if (key === 'desktop') {
        return 'fa-desktop';
      }
      return `fa-${key.toLowerCase()}-alt`;
    },
    flagCountry(key, array) {
      const info = array.filter((res) => res.country_name === key);
      const flag = info.length > 0 ? info[0].country_flag : null;
      return flag;
    },
    countForTableOccurrences(type, array) {
      const allOccurrences = array.map((occ) => (occ[type] ? occ[type] : 'Desconocido'));
      const OccurrencesValues = allOccurrences.reduce((acc, val) => {
        acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
        return acc;
      }, {});
      return Object.keys(OccurrencesValues).map((key) => {
        const occurrencesArray = {
          values: [
            {
              value: key,
              icon: type === 'device' ? this.devicesIcons(key) : '',
              flag: type === 'country_name' ? this.flagCountry(key, array) : null,
            },
            {
              value: OccurrencesValues[key],
            },
          ],
        };
        return occurrencesArray;
      });
    },
    convertArrayIntoTableRowsValues(array) {
      const rows = [];
      array.forEach((row) => {
        const tableRow = {
          values: [],
        };
        Object.keys(row).forEach((col) => {
          const rowValue = row[col] >= 0 || row[col] < 0 ? row[col].toFixed(2).replace('.00', '') : row[col];
          tableRow.values.push({ value: rowValue });
        });
        rows.push(tableRow);
      });
      return rows;
    },
    calcAnalytics() {
      const mapedUrl = this.dbInformation.map((res) => ({
        url: res.url,
        ip: res.userInfo.ip ? res.userInfo.ip : 0,
        timeInPage: differenceInMilliseconds(new Date(res.sended), new Date(res.created)) / 1000,
      }));
      const separatedUrl = [];
      const unique = [];
      const routes = [...new Set(this.dbInformation.map((item) => item.url))];
      routes.forEach((res) => {
        const filtered = mapedUrl.filter((item) => item.url === res);
        const timeInPage = this.calcAverage(filtered.map((time) => time.timeInPage));
        const users = [...new Set(filtered.map((item) => item.ip))];
        unique.push({
          url: res,
          users: users.length,
          porcentage: `${(users.length * 100) / this.uniqueUsers.length}%`,
          visits: filtered.length,
          averageTime: timeInPage,
        });
        separatedUrl.push(filtered);
      });
      this.totalSessions = this.dbInformation.length;
      this.pageVisits = this.convertArrayIntoTableRowsValues(unique);
      this.showWorldMap = true;
    },
    calcAverage(array) {
      return array.reduce((a, b) => a + b, 0) / array.length;
    },
    transformUserInfo(userString) {
      const newStrg = JSON.parse(JSON.parse(userString));
      return newStrg;
    },
  },
};
</script>
