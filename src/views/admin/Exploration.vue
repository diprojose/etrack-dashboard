<template>
  <div class="exploration-container">
    <div id="exploration-toolbar" class="exploration-toolbar bg-white w-full p-4 mx-4 mb-4">
      <div id="user-select" class="mouse-event-filter flex items-center flex-wrap">
        <div class="web-selects flex items-center p-2" v-if="uniqueUrl.length > 0">
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
        <div class="user-selects flex items-center p-2" v-if="filteredUsers.length > 0">
          <p class="date-filter-label pr-4">Usuario:</p>
          <multiselect
            v-model="userSelected"
            :options="filteredUsers"
            track-by="name"
            placeholder="Elige hasta 5"
            :max="5"
            :limit="5"
            label="name"
            :multiple="true"
            :show-pointer="true"
            :close-on-select="false"
            :clear-on-select="false"
          ></multiselect>
          <button class="button-primary p-2 rounded mr-4" @click="userSelected = getRandomUsers(3)">Aleatorios</button>
        </div>
        <div class="zones-selects flex items-center p-2" v-if="computedZones.length > 0">
          <label for="zones-saved" class="pr-4"
            >Zonas guardadas</label
          >
          <select
            name="zones-saved"
            class="rounded border p-2 lg:mx-2 mb-4 md:mb-0"
            id="zones-saved"
            v-model="zoneSelected"
          >
            <option value="empty">Seleccionar...</option>
            <option :value="zone" v-for="zone in computedZones" :key="zone.id">
              {{ zone.name }}
            </option>
          </select>
        </div>
        <!-- <button
          v-if="zoneSelected !== 'empty'"
          class="button-primary p-2 rounded"
          @click="restartSavedZones"
        >
          Restablecer
        </button> -->
        <button
          v-if="userSelected.length > 0"
          class="button-primary p-2 rounded"
          @click="generateReport"
        >
          Generar informe
        </button>
      </div>
    </div>
    <tracks
      v-if="!report"
      :url="url"
      :filtered-data="filteredData"
      :mouse-styles="mouseStyles"
      :max-zones="1"
      :savedZones="zones"
      @zones-selected="zonesCreated($event)"
      @selected-events="eventsSelectedByZones($event)"
    />
    <div class="report flex ml-4 bg-white p-4" v-if="report">
      <button class="button-primary p-2 rounded" @click="closeReport">Volver</button>
      <div class="results w-1/2 pl-4">
        <h3 class="pb-4 first-color">Indice de exploración: {{ exploration }}</h3>
        <h3 class="pb-4 first-color">Sugerencias</h3>
        <p class="pb-4">
          Si usted requiere que haya más exploración, aumente la cantidad, variedad y distancia entre objetos.
        </p>
        <p class="pb-4">En el caso del tamaño, los diferentes objetos deben de tener tamaños similares o iguales.</p>
        <p class="pb-4">En el caso de la atracción visual, si usted requiere que el cliente explore menos en esa pantalla o zona, utilice imágenes más llamativas y con colores más intensos sobre un objeto específico. Por el contrario, si usted requiere que el cliente explore más en esa pantalla o zona, utilice imágenes similares y con una gama de colores estándar.</p>
      </div>
      <div class="chart w-1/2 flex justify-center" id="chart">
        <apexchart
          type="bar"
          width="500"
          height="350"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Multiselect from 'vue-multiselect';
import Tracks from '../../components/Tracks/Tracks.vue';

export default {
  name: 'Exploration',
  components: {
    Tracks,
    Multiselect,
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
      zones: [],
      createdZones: [],
      modalStatus: false,
      exploration: 0,
      series: [],
      uniqueUrl: [],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
        },
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
          labels: {
            formatter(y) {
              return y;
            },
          },
        },
        xaxis: {
          type: 'category',
          categories: ['Usuarios'],
          labels: {
            rotate: -90,
          },
        },
      },
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
    this.$store.dispatch('setTitle', 'Exploración');
    this.getAnalytics();
    this.getZones();
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
    getAnalytics() {
      axios
        .get(`${process.env.VUE_APP_API}/tracks/user?id=${this.computedUser.id}`)
        .then((response) => {
          const { data } = response;
          this.dbInformation = data.map((res, index) => ({
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
            name: res.userInfo ? `${index + 1} - ${JSON.parse(res.userInfo).IP}` : '',
          }));
          this.uniqueUrl = [...new Set(this.dbInformation.map((item) => item.url))];
          this.uniqueUsers = [...new Set(this.dbInformation.map((item) => (item.userInfo.IP ? item.userInfo.IP : 'Desconocido')))];
          this.$store.dispatch('setAnalyticsHeaderValues', {
            newUsers: this.uniqueUsers.length,
            views: this.dbInformation.length,
          });
          this.screenWidth = this.dbInformation[0].screenWidth + 1;
          this.screenHeight = this.dbInformation[0].screenHeight + 1;
          this.mouseEvents = this.dbInformation.map((res) => res.mouseEvents.interactions);
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
    },
    generateReport() {
      this.series = [];
      const mapedUsers = this.userSelected.map((res) => res.mouseEvents.interactions.map((cursor) => ({
        inside: this.getInsideZone(cursor.x, cursor.y),
        type: cursor.type,
        x: cursor.x,
        y: cursor.y,
        date: cursor.date,
        screenHeight: res.screenHeight,
        screenWidth: res.screenWidth,
      })));
      const sel = mapedUsers.map((res) => res.filter((item) => item.inside === true));
      const zoneToCheck = this.createdZones && this.createdZones.length > 0 ? this.createdZones : [{
        left: '0px',
        top: '0px',
        endX: '1500px',
        endY: '3000px',
      }];
      const resultsSin = [];
      const results = [];
      sel.forEach((res, index) => {
        zoneToCheck.forEach((zone) => {
          const calcR = (res.length / (Math.round(Number(zone.endX.replace('px', ''))) * Math.round(Number(zone.endY.replace('px', '')))));
          resultsSin.push(calcR);
          const calc = (res.length / (Math.round(Number(zone.endX.replace('px', ''))) * Math.round(Number(zone.endY.replace('px', ''))))).toFixed(2);
          const calcResult = parseFloat(calc) === 0.00 ? 0.10 : parseFloat(calc);
          results.push(calcResult);
          this.series.push(
            {
              name: `Usuario #${index + 1}`,
              data: [calcR],
            },
          );
        });
      });
      this.exploration = results.reduce((previousValue, currentValue) => previousValue + currentValue, 0) / mapedUsers.length;
      this.report = true;
    },
    getInsideZone(x, y) {
      let inside = false;
      const zoneToCheck = this.createdZones && this.createdZones.length > 0 ? this.createdZones : [{
        left: '0px',
        top: '0px',
        endX: '1500px',
        endY: '5000px',
      }];
      zoneToCheck.forEach((res) => {
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
      this.urlSelected = this.url;
      this.zones = JSON.parse(zone.zones);
      this.createdZones = this.zones.map((res) => ({
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
    getRandomUsers(times) {
      const users = [];
      for (let index = 0; index < times; index += 1) {
        users.push(this.filteredUsers[Math.floor(Math.random() * this.filteredUsers.length)]);
      }
      return users;
    },
    calcPosition(mouseEvent) {
      const container = document.getElementById('exploration-toolbar');
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
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
#chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
