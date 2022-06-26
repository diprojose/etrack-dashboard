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
          <tooltip v-if="tooltips && tooltips.userDescription" class="mr-2" :tooltip-text="tooltips.userDescription" />
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
            selectLabel="Presiona enter para seleccionar"
          >
            <template slot="maxElements">
              <p>Si deseas elegir otro usuario debes remover el actual</p>
            </template>
          </multiselect>
          <button class="button-primary p-2 rounded mr-4" @click="userSelected = getRandomUsers(1)">Aleatorios</button>
          <tooltip v-if="tooltips && tooltips.randomDescription" class="mr-2" :tooltip-text="tooltips.randomDescription" />
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
    <div class="report flex ml-4 bg-white p-4" v-if="report && textPage">
      <button class="button-primary p-2 rounded" @click="closeReport">Volver</button>
      <div class="results w-1/2 pl-4" v-if="learning <= 0">
        <h3 class="pb-4 first-color flex">Indice de aprendizaje: {{ learning }}
          <span class="pr-4"></span>
        </h3>
        <p>{{ textPage.description }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.low.learningResultTitle }}</h3>
        <p>{{ textPage.results.low.learningResultText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.low.hypoTitle }}</h3>
        <p>{{ textPage.results.low.hypoText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.low.recomendationTitle }}</h3>
        <p>{{ textPage.results.low.recomendationText }}</p>
      </div>
      <div class="results w-1/2 pl-4" v-if="learning > 0 && learning < 1">
        <h3 class="pb-4 first-color flex">Indice de aprendizaje: {{ learning }}
          <span class="pr-4"></span>
        </h3>
        <p>{{ textPage.description }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.medium.learningResultTitle }}</h3>
        <p>{{ textPage.results.medium.learningResultText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.medium.hypoTitle }}</h3>
        <p>{{ textPage.results.medium.hypoText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.medium.recomendationTitle }}</h3>
        <p>{{ textPage.results.medium.recomendationText }}</p>
      </div>
      <div class="results w-1/2 pl-4" v-if="learning > 1">
        <h3 class="pb-4 first-color flex">Indice de aprendizaje: {{ learning }}
          <span class="pr-4"></span>
        </h3>
        <p>{{ textPage.description }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.high.learningResultTitle }}</h3>
        <p>{{ textPage.results.high.learningResultText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.high.hypoTitle }}</h3>
        <p>{{ textPage.results.high.hypoText }}</p>
        <h3 class="py-4 first-color">{{ textPage.results.high.recomendationTitle }}</h3>
        <p>{{ textPage.results.high.recomendationText }}</p>
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
import Tooltip from '../../components/Tooltip/Tooltip.vue';

export default {
  name: 'Learning',
  components: {
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
      zones: [],
      createdZones: [],
      modalStatus: false,
      learning: 0,
      series: [],
      uniqueUrl: [],
      textPage: null,
      tooltips: [],
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
          min: 0,
          max: 10,
          tickAmount: 10,
          forceNiceScale: true,
          title: {
            text: 'Velocidad promedio',
          },
        },
        xaxis: {
          type: 'category',
          categories: [],
          labels: {
            rotate: -90,
          },
          title: {
            text: 'Visitas',
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
    this.getTexts();
    this.getTooltips();
  },
  destroyed() {
    this.$store.dispatch('setTitleDescription', '');
  },
  watch: {
    urlSelected(newValue) {
      this.filteredUsers = this.dbInformation.filter((res) => res.url === newValue);
      this.url = newValue;
    },
  },
  methods: {
    getTooltips() {
      axios
        .get(`${process.env.VUE_APP_API}/tooltips/page/learning`)
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
    getTexts() {
      axios
        .get(`${process.env.VUE_APP_API}/texts/learning`)
        .then((response) => {
          const { data } = response;
          this.textPage = JSON.parse(data[0].texts);
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
            mouseEvents: res.mouseEvents ? JSON.parse(res.mouseEvents) : '',
            scrollEvents: res.scrollEvents ? JSON.parse(res.scrollEvents) : '',
            userInfo: res.userInfo ? JSON.parse(JSON.parse(res.userInfo)) : '',
            keyboardEvents: res.keyboardEvents ? JSON.parse(res.keyboardEvents) : '',
            screenEvents: res.screenEvents ? JSON.parse(res.screenEvents) : '',
            url: res.url,
            device: res.device,
            ownerId: res.ownerId,
            screenHeight: res.screenHeight,
            screenWidth: res.screenWidth,
            name: `${index + 1} - Usuario`,
          }));
          this.uniqueUrl = [...new Set(this.dbInformation.map((item) => item.url))];
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
      this.chartOptions.xaxis.categories = [];
      const velocitys = [];
      this.userSelected.forEach((each) => {
        const userEvents = this.dbInformation
          .filter((res) => res.userInfo.ip === each.userInfo.ip)
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
          if (responseIndex < 10) {
            velocitys.push(Number(averageVelocity));
            this.chartOptions.xaxis.categories.push(`${responseIndex + 1}`);
          }
        });
      });
      this.series.push({
        name: 'Velocidad promedio',
        data: velocitys,
      });
      console.log(this.series);
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

<style lang="scss" scoped>
#chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
