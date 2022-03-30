<template>
  <div class="learning-container">
    <div id="learning-toolbar" class="learning-toolbar bg-white w-full p-4 mx-4 mb-4">
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
            placeholder="Elige uno"
            :max="1"
            :limit="1"
            label="name"
            :multiple="true"
            :show-pointer="true"
            :close-on-select="true"
            :clear-on-select="false"
          ></multiselect>
          <button class="button-primary p-2 rounded mr-4" @click="userSelected = getRandomUsers(1)">Aleatorios</button>
        </div>
        <button
          v-if="userSelected.length > 0"
          class="button-primary p-2 rounded"
          @click="generateReport"
        >
          Generar informe
        </button>
      </div>
    </div>
    <div class="report flex ml-4 bg-white p-4" v-if="report">
      <button class="button-primary p-2 rounded" @click="closeReport">Volver</button>
      <div class="results w-1/2 pl-4" v-if="learning <= 0">
        <h3 class="pb-4 first-color">Indice de aprendizaje: {{ learning }}</h3>
        <h3 class="pb-4 first-color">Lectura de resultado</h3>
        <p>
          Es probable que a tu(s) cliente(s) le(s) está costando bastante aprender la dinámica de tu E-commerce
        </p>
        <h3 class="py-4 first-color">Hipotesis</h3>
        <p>
          La página (puede estar generando) genera problemas de aprendizaje en las dinámicas de compra.
          Quizá se deba a que(la) falta información que oriente a tus clientes.
        </p>
        <h3 class="py-4 first-color">Recomendaciones</h3>
        <p>
          Podríamos incluir todos los empujoncitos de aprendizaje que puedas que le informen sobre las
          funciones de tu E-commerce(Quizá podrías incluir información sobre las funciones de tu E-Commerce
          que facilite el aprendizaje de tus clientes). Recuerda: “Locura es hacer lo mismo una y otra vez
          esperando obtener resultados diferentes” (Albert Eintein).
        </p>
      </div>
      <div class="results w-1/2 pl-4" v-if="learning > 0 && learning < 1">
        <h3 class="pb-4 first-color">Indice de aprendizaje: {{ learning }}</h3>
        <h3 class="pb-4 first-color">Lectura de resultado</h3>
        <p>
          Es probable que a tu(s) cliente(s) le(s) está costando ligeramente(un poco) aprender la dinámica de tu E-commerce. Todavía puedes mejorar.
        </p>
        <h3 class="py-4 first-color">Hipotesis</h3>
        <p>
          La (complejidad de la no facilita) página no está siendo tan sencilla para facilitar el aprendizaje en las dinámicas de compra. Quizá se
          deba a que(la) falta información que oriente a tus clientes.
        </p>
        <h3 class="py-4 first-color">Recomendaciones</h3>
        <p>
          Podríamos probar incluyendo algunos empujoncitos de aprendizaje que le informen sobre las funciones de tu
          E-commerce(Quizá podrías incluir información sobre las funciones de tu E-Commerce que facilite el
          aprendizaje de tus clientes). Recuerda: “Locura es hacer lo mismo una y otra vez esperando obtener
          resultados diferentes” (Albert Eintein).
        </p>
      </div>
      <div class="results w-1/2 pl-4" v-if="learning > 1">
        <h3 class="pb-4 first-color">Indice de aprendizaje: {{ learning }}</h3>
        <h3 class="pb-4 first-color">Lectura de resultado</h3>
        <p>
          Es probable que tu(s) cliente(s) que se pasean(naveguen y compren) por tu E-commerce con mucha facilidad.
        </p>
        <h3 class="py-4 first-color">Hipotesis</h3>
        <p>
          La página genera un gran aprendizaje en las dinámicas de compra. En cada visita tus clientes hacen(realizan)
          sus actividades a gran velocidad.
        </p>
        <h3 class="py-4 first-color">Recomendaciones</h3>
        <p>
          ¡Excelente! Sigue así y harás(lograrás) que tu E-commerce sea legendario (todo un éxito).
        </p>
      </div>
      <div class="chart w-1/2 flex justify-center" id="chart">
        <apexchart
          type="line"
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

export default {
  name: 'Learning',
  components: {
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
      learning: 0,
      series: [],
      uniqueUrl: [],
      chartOptions: {
        chart: {
          type: 'line',
          height: 350,
        },
        plotOptions: {
          bar: {
            distributed: true,
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
          categories: [],
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
    this.$store.dispatch('setTitle', 'Aprendizaje');
    this.getAnalytics();
  },
  watch: {
    urlSelected(newValue) {
      this.filteredUsers = this.dbInformation.filter((res) => res.url === newValue);
      this.url = newValue;
    },
  },
  methods: {
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
      const velocitys = [];
      this.userSelected.forEach((each) => {
        const userEvents = this.dbInformation
          .filter((res) => res.userInfo.IP === each.userInfo.IP)
          .map((response) => response.mouseEvents.interactions);
        userEvents.forEach((response, responseIndex) => {
          const resultEvent = response.map((calc, index) => ({
            velocity: response[index + 1]
              ? this.calcVelocity(
                this.calcPitagoras(response[index + 1].x, calc.x, response[index + 1].y, calc.y),
                new Date(response[index + 1].date).getTime() - new Date(calc.date).getTime(),
              )
              : '0',
          }));
          const averageVelocity = (resultEvent.reduce(
            (previousValue, currentValue) => previousValue + currentValue.velocity,
            0,
          ) / resultEvent.length).toFixed(2);
          velocitys.push(Number(averageVelocity));
          this.chartOptions.xaxis.categories.push(`${responseIndex + 1}`);
        });
      });
      this.series.push({
        name: 'Velocidad promedio',
        data: velocitys,
      });
      this.learning = Number(velocitys.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0,
      ) / this.series.length).toFixed(2);
      this.report = true;
    },
    calcPitagoras(endX, startX, endY, startY) {
      return Math.hypot(endX - startX, endY - startY);
    },
    calcVelocity(distance, permanence) {
      return permanence === 0 ? 0 : (distance / permanence);
    },
    getRandomUsers(times) {
      const users = [];
      for (let index = 0; index < times; index += 1) {
        users.push(this.filteredUsers[Math.floor(Math.random() * this.filteredUsers.length)]);
      }
      return users;
    },
    changeModalStatus() {
      this.modalStatus = false;
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
