<template>
  <div class="motivation-container p-4">
    <div class="motivation-description pb-4" v-if="textPage">
      <p class="whitespace-pre-line">{{ textPage.description }}</p>
    </div>
    <div id="motivation-toolbar" class="motivation-toolbar bg-white w-full p-4 mb-4">
      <div id="user-select" class="mouse-event-filter flex items-center flex-wrap">
        <div class="url-selects flex items-center pr-4">
          <p class="date-filter-label pr-4">Páginas:</p>
          <select
            class="select border rounded p-2"
            name="url-selected"
            v-model="urlSelected"
            id="url-selected"
          >
            <option value="empty">Seleccionar...</option>
            <option :value="url" v-for="(url, index) in uniqueUrl" :key="`${url}-${index}`">
              {{ url }}
            </option>
          </select>
        </div>
        <div class="user-selects flex items-center pr-4" v-if="filteredUsers.length > 0 || userSelected.length > 0">
          <p class="date-filter-label pr-4">
            Usuario:
          </p>
          <!-- <tooltip v-if="tooltips && tooltips.userDescription" :tooltip-text="tooltips.userDescription" class="mr-4" /> -->
          <multiselect
            v-model="userSelected"
            :options="filteredUsers"
            track-by="name"
            placeholder="Elige hasta 5"
            :max="10"
            :limit="10"
            label="name"
            :multiple="true"
            :show-pointer="true"
            :close-on-select="true"
            :clear-on-select="false"
            selectLabel="Presiona enter para seleccionar"
          ></multiselect>
          <button
            class="button-primary p-2 rounded mr-4"
            @click="getRandomUsers(5, filteredUsers)">
            Aleatorios
          </button>
          <tooltip v-if="tooltips && tooltips.randomDescription" :tooltip-text="tooltips.randomDescription" class="mr-4" />
        </div>
        <button
          v-if="createdZones.length > 0"
          class="button-primary p-2 rounded"
          @click="generateReport"
        >
          Generar informe
        </button>
        <button class="download-button mx-4" @click="takeScreenshot" v-if="report && textPage">
          <img src="../../assets/download.png" class="download-image" alt="">
        </button>
      </div>
    </div>
    <div class="motivation-text p-4 mb-4 bg-white" v-if="userSelected.length > 0">
      <p>{{ textPage.short }}</p>
    </div>
    <tracks
      v-if="!report"
      :url="url"
      :filtered-data="filteredData"
      :mouse-styles="mouseStyles"
      :max-zones="4"
      :savedZones="zones"
      @zones-selected="zonesCreated($event)"
      @selected-events="eventsSelectedByZones($event)"
    />
    <div class="report flex bg-white p-4" v-if="report && textPage" ref="printMe">
      <button class="button-primary p-2 rounded" @click="closeReport">Volver</button>
      <div class="results w-1/2 pl-4" v-if="motivation < 0.3">
        <div class="print-logo pb-4" v-if="takingPicture">
          <img src="../../assets/etrack-logo.png" class="w-1/6" alt="">
        </div>
        <h3 class="pb-4 first-color">Índice de motivación: {{ motivation }}</h3>
        <p>{{ textPage.results.low.learningResultText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.low.hypoTitle }}</h3>
        <p>{{ textPage.results.low.hypoText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.low.recomendationTitle }}</h3>
        <p>{{ textPage.results.low.recomendationText }}</p>
      </div>
      <div class="results w-1/2 pl-4" v-if="motivation > 0.3 && motivation < 0.6">
        <div class="print-logo pb-4" v-if="takingPicture">
          <img src="../../assets/etrack-logo.png" class="w-1/6" alt="">
        </div>
        <h3 class="pb-4 first-color">Índice de motivación: {{ motivation }}</h3>
        <p>{{ textPage.results.medium.learningResultText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.medium.hypoTitle }}</h3>
        <p>{{ textPage.results.medium.hypoText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.medium.recomendationTitle }}</h3>
        <p>{{ textPage.results.medium.recomendationText }}</p>
      </div>
      <div class="results w-1/2 pl-4" v-if="motivation > 0.6">
        <div class="print-logo pb-4" v-if="takingPicture">
          <img src="../../assets/etrack-logo.png" class="w-1/6" alt="">
        </div>
        <h3 class="pb-4 first-color">Índice de motivación: {{ motivation }}</h3>
        <p>{{ textPage.results.high.learningResultText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.high.hypoTitle }}</h3>
        <p>{{ textPage.results.high.hypoText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.high.recomendationTitle }}</h3>
        <p>{{ textPage.results.high.recomendationText }}</p>
      </div>
      <div class="chart w-1/2 flex justify-center" id="chart">
        <apexchart
          type="bar"
          width="500"
          height="350"
          :options="chartOptions"
          :series="series"
        ></apexchart>
        <p class="text-xs">U: Usuarios</p>
        <p class="text-xs">O: Otras Interacciones</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Multiselect from 'vue-multiselect';
import Tracks from '../../components/Tracks/Tracks.vue';
import Tooltip from '../../components/Tooltip/Tooltip.vue';

export default {
  name: 'Motivation',
  components: {
    Tracks,
    Multiselect,
    Tooltip,
  },
  data() {
    return {
      report: false,
      url: '',
      filteredData: [],
      filteredUsers: [],
      dbInformation: [],
      mouseStyles: 'dots',
      urlSelected: 'empty',
      userSelected: '',
      zoneSelected: 'empty',
      eventsSelected: [],
      events: {},
      zones: [],
      createdZones: [],
      modalStatus: false,
      motivation: 0,
      series: [],
      uniqueUrl: [],
      textPage: null,
      tooltips: {},
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
        },
        colors: ['#4cc9f0', '#4895EF', '#4361EE', '#3F37C9', '#3A0CA3', '#480CA8', '#560BAD', '#7209B7', '#B5179E', '#F72585'],
        plotOptions: {
          bar: {
            colors: {
              ranges: [
                {
                  color: '#14329B',
                },
                {
                  color: '#96FFFF',
                },
              ],
            },
            columnWidth: '80%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          title: {
            text: 'Motivación',
          },
          labels: {
            formatter(y) {
              return y;
            },
          },
          min: -1,
          max: 1,
        },
        xaxis: {
          categories: ['Usuarios'],
          type: 'category',
          labels: {
            rotate: -90,
          },
        },
      },
      takingPicture: false,
    };
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
    computedZones() {
      return this.$store.state.zones;
    },
  },
  created() {
    this.$store.dispatch('setTitle', 'Motivación');
    this.getAnalytics();
    this.getZones();
    this.getTexts();
    this.getTooltips();
  },
  destroyed() {
    this.$store.dispatch('setTitleDescription', '');
  },
  watch: {
    zoneSelected(newValue) {
      this.zoneSelectedEvent(newValue);
    },
    urlSelected(newValue) {
      this.filteredUsers = this.dbInformation.filter((res) => res.url === newValue);
      this.url = newValue;
    },
    userSelected() {
      /* this.url = newValue.url;
      const { interactions } = newValue.mouseEvents;
      this.filteredData = interactions.map((res, index) => ({
        type: res.type,
        x: res.x,
        y: res.y,
        date: res.date,
        permanence: interactions[index + 1]
          ? new Date(interactions[index + 1].date).getTime() - new Date(res.date).getTime()
          : '0',
      })); */
    },
  },
  methods: {
    getZones() {
      this.$store.dispatch('getZones', this.computedUser.id);
    },
    async getEvents(ids) {
      await axios
        .post(`${process.env.VUE_APP_API}/events/multiple-no-image`, ids)
        .then((response) => {
          const { data } = response;
          const mappedData = data.map((res) => ({
            mouseEvents: JSON.parse(res[0].mouseEvents),
          }));
          this.events = mappedData;
        });
    },
    getTexts() {
      axios
        .get(`${process.env.VUE_APP_API}/texts/motivation`)
        .then((response) => {
          const { data } = response;
          this.textPage = JSON.parse(data[0].texts);
        });
    },
    getTooltips() {
      axios
        .get(`${process.env.VUE_APP_API}/tooltips/page/motivation`)
        .then((response) => {
          const { data } = response;
          this.tooltips = {};
          data.forEach((res) => {
            this.tooltips = {
              ...this.tooltips,
              [res.name]: res.text,
            };
          });
          if (this.tooltips && this.tooltips.description) {
            this.$store.dispatch('setTitleDescription', this.tooltips.description);
          }
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
          this.uniqueUrl = [...new Set(this.dbInformation.map((item) => item.url))];
          this.uniqueUsers = [...new Set(this.dbInformation.map((item) => (item.userInfo.ip ? item.userInfo.ip : 'Desconocido')))];
          this.$store.dispatch('setAnalyticsHeaderValues', {
            newUsers: this.uniqueUsers.length,
            views: this.dbInformation.length,
          });
          this.screenWidth = this.dbInformation[0].screenWidth + 1;
          this.screenHeight = this.dbInformation[0].screenHeight + 1;
          this.mouseEvents = this.dbInformation.map((res) => res.mouseEvents.interactions);
        })
        .catch(() => {
          // handle error
        })
        .then(() => {
          // always executed
        });
    },
    async generateReport() {
      this.series = [];
      this.$swal.fire({
        icon: 'info',
        text: 'Espere por favor...',
      });
      this.$swal.showLoading();
      const users = this.userSelected.map((res) => res.id);
      await this.getEvents(users);
      const mapedUsers = this.events.map((res) => ({
        mouseEvents: res.mouseEvents.interactions.map((cursor, index) => ({
          inside: this.getInsideZone(cursor.x, cursor.y),
          type: cursor.type,
          x: cursor.x,
          y: cursor.y,
          date: cursor.date,
          permanence: res.mouseEvents.interactions[index + 1]
            ? new Date(res.mouseEvents.interactions[index + 1].date).getTime() - new Date(cursor.date).getTime()
            : '0',
        })),
      }));
      const mapedUsersWithTotalPermanence = mapedUsers.map((res) => ({
        mouseEvents: res.mouseEvents,
        name: res.name,
        totalPermanence: res.mouseEvents.reduce(
          (previousValue, currentValue) => previousValue + currentValue.permanence,
          0,
        ),
      }));
      const sel = mapedUsersWithTotalPermanence.map((res) => res.mouseEvents.filter((item) => item.inside === true));
      const eventsInsideZone = sel.map((res) => res.length);
      const totalPermanenceFromSelectedEvents = sel.map((res) => res.reduce((previousValue, currentValue) => previousValue + currentValue.permanence, 0));
      const generalMotivation = [];
      mapedUsersWithTotalPermanence.forEach((res, index) => {
        const motivationPerZone = ((eventsInsideZone[index] * totalPermanenceFromSelectedEvents[index])
          / (res.totalPermanence * res.mouseEvents.length)).toFixed(2);
        generalMotivation.push(Number(motivationPerZone));
        const othersPerZone = (Number(motivationPerZone) - 1).toFixed(2);
        const seriesName = (mapedUsersWithTotalPermanence.length * 2) < 5
          ? `Usuario #${this.userSelected[index].name.replace(/[^0-9]/g, '')}`
          : `U${this.userSelected[index].name.replace(/[^0-9]/g, '')}`;
        const seriesOther = (mapedUsersWithTotalPermanence.length * 2) < 5
          ? `Otros #${this.userSelected[index].name.replace(/[^0-9]/g, '')}`
          : `O${this.userSelected[index].name.replace(/[^0-9]/g, '')}`;
        this.series.push(
          {
            name: seriesName,
            data: [Number(motivationPerZone)],
          },
          {
            name: seriesOther,
            data: [Number(othersPerZone)],
          },
        );
      });
      this.motivation = Number((generalMotivation
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0) / mapedUsersWithTotalPermanence.length).toFixed(2));
      this.report = true;
      this.$swal.close();
    },
    getInsideZone(x, y) {
      let inside = false;
      this.createdZones.forEach((res) => {
        if (
          (x >= Math.round(Number(res.left.replace('px', ''))) && x <= Math.round(Number(res.endX.replace('px', ''))))
          && (y >= Math.round(Number(res.top.replace('px', ''))) && y <= Math.round(Number(res.endY.replace('px', ''))))
        ) {
          inside = true;
        }
      });
      return inside;
    },
    zoneSelectedEvent(zone) {
      this.url = this.url === zone.url ? this.url : zone.url;
      this.zoneSelected = zone;
      this.zones = JSON.parse(zone.zones);
    },
    getRandomUsers(times, totalUsers) {
      const users = [];
      const filteredUsersRandoms = totalUsers;
      const iteration = times > totalUsers.length ? totalUsers.length : times;
      for (let index = 0; index < iteration; index += 1) {
        const randomUser = filteredUsersRandoms[Math.floor(Math.random() * filteredUsersRandoms.length)];
        const userIndex = filteredUsersRandoms.indexOf(randomUser);
        if (userIndex !== -1) {
          filteredUsersRandoms.splice(userIndex, 1);
        }
        users.push(randomUser);
      }
      this.userSelected = users;
      this.filteredUsers = this.dbInformation.filter((res) => res.url === this.urlSelected);
    },
    calcPosition(mouseEvent) {
      const container = document.getElementById('motivation-toolbar');
      const positionX = (mouseEvent.x * container.offsetWidth) / mouseEvent.width;
      return Math.round(positionX);
    },
    restartSavedZones() {
      this.zones = [];
    },
    zonesCreated(event) {
      this.createdZones = event.map((res) => ({
        height: res.height,
        left: res.left,
        opacity: res.opacity,
        position: res.position,
        top: res.top,
        width: res.width,
        endX: `${Math.round(Number(res.left.replace('px', '')) + Number(res.width.replace('px', '')))}px`,
        endY: `${Math.round(Number(res.top.replace('px', '')) + Number(res.height.replace('px', '')))}px`,
      }));
    },
    changeModalStatus() {
      this.modalStatus = false;
    },
    eventsSelectedByZones(events) {
      this.eventsSelected[events.zone] = events.events;
    },
    closeReport() {
      this.report = false;
      this.series = [];
    },
    async takeScreenshot() {
      this.takingPicture = true;
      const el = this.$refs.printMe;
      const options = {
        type: 'dataURL',
        imageSmoothingEnabled: false,
      };
      this.output = await this.$html2canvas(el, options);
      const a = document.createElement('a');
      a.href = this.output;
      a.download = 'motivation.jpg';
      a.click();
      a.remove();
      this.takingPicture = false;
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss" scoped>
#chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.download-button {
  .download-image {
    width: 40px;
  }
}
</style>
