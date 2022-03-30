<template>
  <div class="motivation-container">
    <div id="motivation-toolbar" class="motivation-toolbar bg-white w-full p-4 mx-4 mb-4">
      <div id="user-select" class="mouse-event-filter flex items-center flex-wrap">
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
        <div class="user-selects flex items-center" v-if="filteredUsers.length > 0">
          <p class="date-filter-label px-4">Usuario:</p>
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
            :close-on-select="false"
            :clear-on-select="false"
          ></multiselect>
          <button class="button-primary p-2 rounded mr-4" @click="userSelected = getRandomUsers(5)">Aleatorios</button>
        </div>
        <!-- <div class="zones-selects flex items-center" v-if="computedZones.length > 0">
          <label for="zones-saved" class="lg:ml-4 lg:mr-2 mb-4 md:mb-0 text-center md:text-left"
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
        </div> -->
        <!-- <button
          v-if="zoneSelected !== 'empty'"
          class="button-primary p-2 rounded"
          @click="restartSavedZones"
        >
          Restablecer
        </button> -->
        <button
          v-if="createdZones.length > 0"
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
      :max-zones="4"
      :savedZones="zones"
      @zones-selected="zonesCreated($event)"
      @selected-events="eventsSelectedByZones($event)"
    />
    <div class="report flex ml-4 bg-white p-4" v-if="report">
      <button class="button-primary p-2 rounded" @click="closeReport">Volver</button>
      <div class="results w-1/2 pl-4" v-if="motivation < 0.3">
        <h3 class="pb-4 first-color">Indice de motivación: {{ motivation }}</h3>
        <h3 class="pb-4 first-color">Hipótesis</h3>
        <p>
          La página no genera motivación para la compra. Poca(baja) proporción de acciones y tiempo
          estuvieron dirigidas a la compra. Quizá se deba al tamaño o variedad de imágenes.
        </p>
        <h3 class="py-4 first-color">Recomendación</h3>
        <p>
          Quizá podrías probar variando el tamaño y la variedad de imágenes en tu E-commerce.
          Recuerda: “Locura es hacer lo mismo una y otra vez esperando obtener resultados
          diferentes” (Albert Eintein).
        </p>
      </div>
      <div class="results w-1/2 pl-4" v-if="motivation > 0.3 && motivation < 0.6">
        <h3 class="pb-4 first-color">Indice de motivación: {{ motivation }}</h3>
        <h3 class="pb-4 first-color">Hipótesis</h3>
        <p>
          La página genera una motivación media para la compra. Mediana proporción de acciones y
          tiempo estuvieron dirigidas a la compra. Quizá se deba al tamaño o variedad de imágenes.
        </p>
        <h3 class="py-4 first-color">Recomendación</h3>
        <p>
          Quizá podrías probar variando el tamaño o la variedad de imágenes en tu E-commerce.
          Recuerda: “Locura es hacer lo mismo una y otra vez esperando obtener resultados
          diferentes” (Albert Eintein).
        </p>
      </div>
      <div class="results w-1/2 pl-4" v-if="motivation > 0.6">
        <h3 class="pb-4 first-color">Indice de motivación: {{ motivation }}</h3>
        <h3 class="pb-4 first-color">Hipótesis</h3>
        <p>
          La página genera una gran motivación para la compra. Gran(alta) proporción de acciones y
          tiempo estuvieron dirigidas a la compra.
        </p>
        <h3 class="py-4 first-color">Recomendación</h3>
        <p>
          Excelente! Sigue así y harás(lograrás) que tu E-commerce sea legendario (todo un éxito).
        </p>
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
  name: 'Motivation',
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
      motivation: 0,
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
          title: 'Usuarios',
          type: 'category',
          categories: ['0 a 10s'],
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
    this.$store.dispatch('setTitle', 'Motivación');
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
            name: res.userInfo ? `${index + 1} - Usuario` : '',
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
      const mapedUsers = this.userSelected.map((res) => ({
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
        const motivationPerZone = (eventsInsideZone[index] * totalPermanenceFromSelectedEvents[index])
          / (res.totalPermanence * res.mouseEvents.length);
        generalMotivation.push(motivationPerZone);
        const othersPerZone = motivationPerZone - 1;
        this.series.push(
          {
            name: `Usuario #${index + 1}`,
            data: [motivationPerZone],
          },
          {
            name: `Otros #${index + 1}`,
            data: [othersPerZone],
          },
        );
      });
      this.motivation = generalMotivation
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0) / mapedUsersWithTotalPermanence.length;
      this.report = true;
      /* const sel = this.eventsSelected.map((res) => res.map((item) => JSON.parse(item)));
      const eventsInsideZone = sel.map((res) => res.length);
      const totalPermanenceFromSelectedEvents = sel.map((res) => res.reduce((previousValue, currentValue) => previousValue + currentValue.permanence, 0));
      const totalPermanence = this.filteredData.reduce(
        (previousValue, currentValue) => previousValue + currentValue.permanence,
        0,
      );
      const generalMotivation = [];
      eventsInsideZone.forEach((res, index) => {
        const motivationPerZone = (res * totalPermanenceFromSelectedEvents[index])
          / (totalPermanence * this.filteredData.length);
        generalMotivation.push(motivationPerZone);
        const othersPerZone = motivationPerZone - 1;
        this.series.push(
          {
            name: `Motivación #${index + 1}`,
            data: [motivationPerZone],
          },
          {
            name: `Otros #${index + 1}`,
            data: [othersPerZone],
          },
        );
      });
      this.motivation = generalMotivation
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
        .toFixed(3);
      this.report = true; */
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
    getRandomUsers(times) {
      const users = [];
      for (let index = 0; index < times; index += 1) {
        users.push(this.filteredUsers[Math.floor(Math.random() * this.filteredUsers.length)]);
      }
      return users;
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
