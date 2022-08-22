<template>
  <div class="analytics-container relative">
    <div class="learning-description px-4 pb-4" v-if="textPage">
      <p>{{ textPage.description }}</p>
    </div>
    <analytics-stats />
    <div class="flex flex-wrap">
      <analytics-toolbar
        :usersMovements="usersInformation"
        :urls="uniqueUrl"
        :zones="zones.length"
        @events-updated="eventsUpdated($event)"
        @date-range-updated="eventsUpdated($event)"
        @mouse-styles="changeMouseStyle($event)"
        @user-updated="userUpdated($event)"
        @delete-zones="restartZones()"
        @save-zones="saveZones($event)"
        @zone-selected="zoneSelectedEvent($event)"
        @delete-zone-from-db="deleteZonesFromDB()"
        @filter-users-by-date="filterUsersByDates($event)"
      />
      <div
        class="empty-state w-full mx-4 z-1 p-4 bg-white rounded relative h-screen"
        v-if="url === ''"
      >
        <h3 class="text-3xl font-bold mb-4 text-center py-4">
          Empieza a filtrar para ver mas información
        </h3>
        <p class="text-center">Haz click en el icono a la izquierda <i class="fas fa-align-left"></i> para empezar tu análisis</p>
      </div>
      <div class="mx-4 w-full">
        <tracks
          :url="url"
          :filtered-data="filteredData"
          :mouse-styles="mouseStyles"
          :max-zones="2"
          :savedZones="zones"
          :image="pageImage"
          @zones-selected="zonesEvent($event)" />
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import Tracks from '../../components/Tracks/Tracks.vue';
import AnalyticsToolbar from '../../components/Analytics/AnalyticsToolbar.vue';
import AnalyticsStats from '../../components/Analytics/AnalyticsStats.vue';

export default {
  components: {
    AnalyticsToolbar,
    AnalyticsStats,
    Tracks,
  },
  data() {
    return {
      url: '',
      selected: [],
      screenHeight: 800,
      screenWidth: 0,
      mouseEvents: [],
      keyboardEvents: [],
      filteredData: [],
      dbInformation: [],
      usersInformation: [],
      boxWidth: 0,
      mouseStyles: 'dots',
      userEvents: [],
      events: {},
      eventSelected: '',
      uniqueUrl: [],
      uniqueUsers: [],
      websites: [],
      dragContainer: '',
      zones: [],
      zoneSelected: {},
      pageImage: '',
      tooltips: {},
      textPage: null,
      progress: 0,
    };
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
    computedClass() {
      const retClass = ['interaction-place', 'rounded'];
      return retClass;
    },
  },
  created() {
    this.$store.dispatch('setTitle', 'Analytics interactivos');
    this.getAnalytics();
    this.getWebsites();
    this.getZones();
    this.getTexts();
  },
  mounted() {},
  methods: {
    getTexts() {
      axios
        .get(`${process.env.VUE_APP_API}/texts/analytics`)
        .then((response) => {
          const { data } = response;
          this.textPage = JSON.parse(data[0].texts);
        });
    },
    onUploadProgress(ev) {
      this.progress = Math.floor((ev.loaded * 100) / ev.total);
      console.log(this.progress);
      // do your thing here
    },
    async getEvents(id) {
      this.progress = 0;
      this.$swal.fire({
        icon: 'info',
        text: 'Espere por favor...',
        html: `<progress id="progress" value="${this.progress}" max="100"> ${this.progress}% </progress>`,
      });
      this.$swal.showLoading();
      await axios
        .get(`${process.env.VUE_APP_API}/events/${id}`, {
          onDownloadProgress: this.onUploadProgress,
        })
        .then((response) => {
          const { data } = response;
          this.$swal.close();
          const mappedData = [data].map((res) => ({
            mouseEvents: JSON.parse(res.mouseEvents),
            image: res.image,
          }));
          [this.events] = mappedData;
        });
    },
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
          this.dbInformation = data.map((res, index) => ({
            created: res.created,
            id: res.id,
            userInfo: res.userInfo ? JSON.parse(res.userInfo) : '',
            url: res.url,
            device: res.device,
            ownerId: res.ownerId,
            screenHeight: res.screenHeight,
            screenWidth: res.screenWidth,
            name: `${index + 1} - Usuario`,
          }));
          const startDate = new Date();
          const endDate = new Date();
          startDate.setDate(startDate.getDate() - 6);
          const filteredByDates = this.dbInformation.filter(
            (element) => new Date(element.created) >= new Date(startDate)
              && new Date(element.created) <= new Date(endDate),
          );
          this.usersInformation = filteredByDates;
          this.uniqueUrl = [...new Set(this.dbInformation.map((item) => item.url))];
          this.uniqueUsers = [...new Set(this.dbInformation.map((item) => item.userInfo.IP))];
          this.$store.dispatch('setAnalyticsHeaderValues', {
            newUsers: this.uniqueUsers.length,
            views: this.dbInformation.length,
          });
          this.screenWidth = this.dbInformation[0].screenWidth;
          this.screenHeight = this.dbInformation[0].screenHeight;
          this.mouseEvents = this.dbInformation.map((res) => res.mouseEvents.interactions);
        })
        .catch(() => {
          // handle error
        })
        .then(() => {
          // always executed
        });
    },
    getZones() {
      this.$store.dispatch('getZones', this.computedUser.id);
    },
    css2Object(css) {
      const obj = {};
      const s = css
        .toLowerCase()
        .replace(/-(.)/g, (m, g) => g.toUpperCase())
        .replace(/;\s?$/g, '')
        .split(/:|;/g);
      for (let i = 0; i < s.length; i += 2) obj[s[i].replace(/\s/g, '')] = s[i + 1].replace(/^\s+|\s+$/g, '');
      return obj;
    },
    dragSelection() {
      this.dragContainer = document.getElementById('interactions');
      const att = document.getElementById('interactions').firstChild.getAttribute('style');
      const cssSelection = this.css2Object(att);
      if (cssSelection.width === '0px' || cssSelection.height === '0px') {
        return;
      }
      if (this.zones.length === 0) {
        this.zones.push(cssSelection);
      }
    },
    selectedEvents(events) {
      this.selected = events;
      const selectedNumber = this.selected.length.toString();
      const porcentage = (this.selected.length * 100) / this.filteredData.length;
      const eventObj = {
        events: selectedNumber,
        porcentage: Math.round(porcentage),
      };
      this.$store.dispatch('setSelectedEvents', eventObj);
    },
    saveZones(zoneName) {
      const postData = {
        ownerId: this.computedUser.id,
        name: zoneName || 'Sin titulo',
        url: this.url,
        zones: JSON.stringify(this.zones),
      };
      axios.post(`${process.env.VUE_APP_API}/zones-selections`, postData)
        .then(() => {
          this.$swal.fire(
            '¡Exitoso!',
            'La zona ha sido guardada con éxito.',
            'success',
          );
          this.getZones();
        })
        .catch(() => {
          this.$swal.fire(
            'Error!',
            'Ha ocurrido un error, vuelve a intentar, si sigue ocurriendo comunicate con nuestro centro de servicio',
            'error',
          );
        });
    },
    load() {
      const container = document.querySelector('.vue-friendly-iframe');
      if (this.url !== '' && container) {
        this.boxWidth = container.offsetWidth;
      }
    },
    async eventsUpdated(event) {
      let interactions = [];
      this.selected = [];
      if (event.filterType === 'user') {
        await this.getEvents(event.user.id);
        interactions = this.events.mouseEvents.interactions;
        this.pageImage = this.events.image;
        this.url = event.user.url;
      }
      if (event.filterType === 'url') {
        const filteredByUrl = this.dbInformation.filter((res) => res.url === event.url);
        const mouseEventsUrl = filteredByUrl.map((res) => res.mouseEvents.interactions);
        interactions = mouseEventsUrl.flat();
        this.url = event.url;
      }
      this.mouseStyles = event.showType;
      this.eventSelected = event.mouseEvents;
      const filteredEvents = interactions.filter((element) => (event.mouseEvents === 'all' ? element : element.type === event.mouseEvents));
      const filteredByDates = filteredEvents.filter(
        (element) => new Date(element.date) >= new Date(event.startDate)
          && new Date(element.date) <= new Date(event.endDate),
      );
      this.filteredData = filteredByDates;
      this.load();
      this.screenWidth = this.userEvents.screenHeight;
    },
    zoneSelectedEvent(zone) {
      if (zone !== 'empty') {
        this.url = this.url === zone.url ? this.url : zone.url;
        this.zoneSelected = zone;
        this.zones = JSON.parse(zone.zones);
      } else {
        this.url = '';
        this.zoneSelected = zone;
        this.zones = [];
      }
    },
    zonesEvent(zone) {
      this.zones = zone;
    },
    restartZones() {
      this.zones = [];
    },
    deleteZonesFromDB() {
      axios.delete(`${process.env.VUE_APP_API}/zones-selections/${this.zoneSelected.id}`)
        .then(() => {
          this.$swal.fire(
            'Zona eliminada con éxito!',
            'La zona ha sido eliminada',
            'success',
          );
          this.restartZones();
          this.getZones();
        })
        .catch(() => {
          this.$swal.fire(
            'Error!',
            'Ha ocurrido un error, vuelve a intentar, si sigue ocurriendo comunícate con nuestro centro de servicio',
            'error',
          );
        });
    },
    filterUsersByDates(dates) {
      this.usersInformation = this.dbInformation.filter(
        (element) => new Date(element.created) >= new Date(dates.startDate)
          && new Date(element.created) <= new Date(dates.endDate),
      );
    },
  },
};
</script>

<style lang="scss">
</style>
