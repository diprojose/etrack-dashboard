<template>
  <div class="psico-container p-4">
    <div class="psico-toolbar bg-white w-full p-4">
      <div id="user-select" class="mouse-event-filter flex items-center">
        <tooltip v-if="tooltips && tooltips.routesSaved && emotionRoutes.length > 0" :tooltip-text="tooltips.routesSaved" class="mr-4" />
        <p class="date-filter-label pr-4" v-if="emotionRoutes.length > 0">Rutas guardadas:</p>
        <select
          v-if="emotionRoutes.length > 0"
          class="select border rounded p-2"
          name="emotion-routes-selected"
          v-model="emotionRoutesSelected"
          id="emotion-routes-selected"
        >
          <option value="empty">Seleccionar...</option>
          <option :value="route" v-for="route in emotionRoutes" :key="route.id">
            {{ route.name }}
          </option>
        </select>
        <tooltip v-if="tooltips && tooltips.howToSaveRoutes && emotionRoutes.length > 0" :tooltip-text="tooltips.howToSaveRoutes" class="ml-4" />
        <button class="download-button mx-4" @click="takeScreenshot" v-if="emotionResults.length > 0">
          <img src="../../assets/download.png" class="download-image" alt="">
        </button>
      </div>
    </div>
    <div class="data-treatments-container flex mt-4" v-if="textPage">
      <div class="explorer-container p-4 bg-white w-1/2 lg:mr-2">
        <h3 class="font-bold first-color">Frustración</h3>
        <p class="py-2 whitespace-pre-line">
          {{ textPage.description }}
        </p>
        <!-- <input
          type="text"
          name="route"
          id="route"
          class="mt-4 w-full rounded border p-2"
          :placeholder="textPage.routePlaceholder"
          v-model="inputRoute"
          @keyup.enter="addRoute(inputRoute)"
        /> -->
        <select class="select border border-gray-500 rounded p-2" name="route" id="route" v-model="inputRoute">
          <option value="empty">Seleccionar...</option>
          <option :value="route" v-for="route in uniqueUrl" :key="route">{{ route }}</option>
        </select>
        <button @click="addRoute(inputRoute)" class="mt-4 button-primary rounded p-2">
          Agregar
        </button>
      </div>
      <div class="explorer-container p-4 bg-white w-1/2 lg:ml-2">
        <h3 class="font-bold first-color">{{ textPage.routeTitle }}</h3>
        <p
          class="py-2 flex items-center justify-between cursor-pointer"
          v-for="(route, index) in routes"
          :key="index"
        >
          {{ route }} <i @click="removeRoute(index)" class="pl-4 fas fa-times"></i>
        </p>
        <p class="py-2">{{ textPage.routeDescription }}</p>
        <div class="save-routes-container" v-if="emotionRoutesSelected === 'empty' || !editNameOfRoutes">
          <input
            v-if="routes.length >= 3"
            type="text"
            name="emotion-routes-name"
            id="emotion-routes-name"
            v-model="emotionRoutesName"
            class="border rounded p-2"
            placeholder="Escribe un nombre para guardar las rutas"
          />
          <button
            class="mt-4 button-primary rounded p-2"
            v-if="routes.length >= 3"
            @click="saveEmotionsRoutes"
          >
            Guardar
          </button>
        </div>
        <div class="next-container">
          <button
            class="mt-4 button-primary rounded p-2"
            v-if="routes.length >= 3"
            @click="calcEmotion"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
    <div class="results-container my-4 p-4 bg-white" v-if="emotionResults.length > 0" ref="printMe">
      <div class="print-logo pb-4 flex items-center flex-col" v-if="takingPicture">
        <img src="../../assets/etrack-logo.png" class="w-1/12" alt="E-track">
      </div>
      <div class="convertion-reason">
        <h4 class="pb-12">Razón de conversión (Porcentaje de usuarios que llegan al final de la ruta respecto de los que la iniciaron): <span class="montserrat-bold">{{ Math.round(emotionResults[emotionResults.length - 1].porcentage.toFixed(2)) }}%</span></h4>
      </div>
      <div class="change-direction-container text-center">
        <button class="button-primary rounded p-2" @click="changePosition">Cambiar dirección</button>
      </div>
      <div class="flex justify-center items-center rounded"
        :class="{
          'horizontal': direction === 'horizontal',
          'vertical': direction === 'vertical'
        }"
        @mouseleave="tooltipStatus = ''">
        <div
          class="conversion-rate relative"
          :style="{
            height: `${calcHeightFunnelChart(result.porcentage)}%`,
            width: direction === 'vertical' ? `${calcHeightFunnelChart(result.porcentage)}%` : '200px'
          }"
          v-for="(result, index) in emotionResults"
          :key="result.url"
        >
          <div
            class="conversion-porcentage relative bg-no-repeat p-6 conversion-first"
            :class="{
              curved: checkPorcentage(result.porcentage, index),
              [`conversion-background-ver-${index}`]: direction === 'vertical',
              [`conversion-background-${index}`]: direction === 'horizontal'
            }"
            @mouseenter="changeTooltipStatus(index)">
            <p class="text-center text-2xl font-bold text-white">{{ Math.round(result.porcentage) }}%</p>
            <p class="text-center drop-color">Caída {{ Math.round(result.droped) }}%</p>
          </div>
          <div class="tooltip-information rounded p-4 bg-stone-300" v-if="tooltipStatus === index">
            <p class="text-xs"><span class="first-color">Página:</span> {{ result.url }}</p>
            <p class="text-xs"><span class="first-color">Visitas:</span> {{ result.visits }}</p>
            <p class="text-xs"><span class="first-color">Usuarios:</span> {{ result.users }}</p>
            <p class="text-xs"><span class="first-color">Caida:</span> {{ Math.round(result.droped) }}%</p>
          </div>
        </div>
      </div>
      <p class="pb-8"><span class="montserrat-bold">Nota:</span> En blanco se encuentra el porcentaje de usuarios que llegaron a esa página. En verde se encuentra el porcentaje de usuarios que se salieron de esa página (la caída).</p>
      <div class="text-results flex" v-if="emotionResults[emotionResults.length - 1].porcentage > 80">
        <div class="hipotesis-container pr-2">
          <h3 class="pb-4 first-color">{{ textPage.results.high.hypoTitle }}</h3>
          <p>{{ textPage.results.high.hypoText }}</p>
        </div>
        <div class="recomendation-container pl-2">
          <h3 class="pb-4 first-color">{{ textPage.results.high.recomendationTitle }}</h3>
          <p>{{ textPage.results.high.recomendationText }}</p>
        </div>
      </div>
      <div class="text-results flex" v-if="emotionResults[emotionResults.length - 1].porcentage > 50 && emotionResults[emotionResults.length - 1].porcentage < 79">
        <div class="hipotesis-container pr-2">
          <h3 class="pb-4 first-color">{{ textPage.results.medium.hypoTitle }}</h3>
          <p>{{ textPage.results.medium.hypoText }}</p>
        </div>
        <div class="recomendation-container pl-2">
          <h3 class="pb-4 first-color">{{ textPage.results.medium.recomendationTitle }}</h3>
          <p>{{ textPage.results.medium.recomendationText }}</p>
        </div>
      </div>
      <div class="text-results flex" v-if="emotionResults[emotionResults.length - 1].porcentage < 50">
        <div class="hipotesis-container pr-2">
          <h3 class="pb-4 first-color">{{ textPage.results.low.hypoTitle }}</h3>
          <p>{{ textPage.results.low.hypoText }}</p>
        </div>
        <div class="recomendation-container pl-2">
          <h3 class="pb-4 first-color">{{ textPage.results.low.recomendationTitle }}</h3>
          <p>{{ textPage.results.low.recomendationText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Tooltip from '../../components/Tooltip/Tooltip.vue';

export default {
  name: 'Emotion',
  components: {
    // VueFunnelGraph,
    Tooltip,
  },
  data() {
    return {
      url: '',
      device: '',
      startTime: '',
      endTime: '',
      timeInWebsite: 0,
      lowerHeight: 0,
      keyboardEvents: {},
      filteredData: [],
      dbInformation: [],
      boxWidth: 0,
      mouseStyles: 'dots',
      userEvents: [],
      eventSelected: '',
      uniqueUrl: [],
      uniqueUsers: [],
      websites: [],
      userSelected: 'empty',
      routes: [],
      inputRoute: 'empty',
      emotionRoutesName: '',
      emotionRoutesSelected: 'empty',
      emotionRoutes: [],
      emotionResults: [],
      emotionSeparatedRoutes: [],
      labels: ['Impressions', 'Add To Cart', 'Buy'],
      values: [1500, 700, 300],
      colors: ['#2864FF', '#96FFFF'],
      direction: 'horizontal',
      gradientDirection: 'horizontal',
      height: 400,
      width: 800,
      tooltipStatus: '',
      textPage: null,
      tooltips: {},
      editNameOfRoutes: false,
      events: {},
      takingPicture: false,
    };
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
  },
  created() {
    this.$store.dispatch('setTitle', 'Frustración');
    this.getTexts();
    this.getTooltips();
    this.getAnalytics();
    this.getWebsites();
    this.getEmotionRoutes();
  },
  destroyed() {
    this.$store.dispatch('setTitleDescription', '');
  },
  watch: {
    emotionRoutesSelected(newValue) {
      this.routes = newValue.routes;
      this.editNameOfRoutes = true;
    },
  },
  methods: {
    getTexts() {
      axios
        .get(`${process.env.VUE_APP_API}/texts/emotion`)
        .then((response) => {
          const { data } = response;
          this.textPage = JSON.parse(data[0].texts);
        });
    },
    getTooltips() {
      axios
        .get(`${process.env.VUE_APP_API}/tooltips/page/emotion`)
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
    getEmotionRoutes() {
      const url = `${process.env.VUE_APP_API}/emotion-routes/user/${this.computedUser.id}`;
      axios
        .get(url)
        .then((response) => {
          const { data } = response;
          this.emotionRoutes = data.map((item) => ({
            id: item.id,
            name: item.name || 'Sin titulo',
            ownerId: item.ownerId,
            routes: JSON.parse(item.routes),
            created: item.created,
          }));
        })
        .catch(() => {
          // handle error
        })
        .then(() => {
          // always executed
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
          this.dbInformation = data.map((res) => ({
            created: res.created,
            id: res.id,
            userInfo: res.userInfo ? JSON.parse(JSON.parse(res.userInfo)) : '',
            url: res.url,
            device: res.device,
            ownerId: res.ownerId,
          }));
          this.uniqueUrl = [...new Set(this.dbInformation.map((item) => item.url))];
          console.log(this.uniqueUrl);
          this.uniqueUsers = [...new Set(this.dbInformation.map((item) => item.userInfo.ip))];
          // this.calcEmotion();
        })
        .catch(() => {
          // handle error
        })
        .then(() => {
          // always executed
        });
    },
    addRoute(route) {
      if (
        new RegExp(
          '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?',
        ).test(route)
      ) {
        if (this.websites.length > 0 && this.routes.length < 6) {
          let found = false;
          this.websites.forEach((website) => {
            const ownUrl = route.includes(website.name);
            if (ownUrl) {
              // this.$swal.fire('Excelente', 'Se ha agregado con éxito', 'success');
              this.inputRoute = 'empty';
              this.routes.push(route);
              found = true;
            }
          });
          if (!found) {
            this.$swal.fire('Error!', 'Debe ser parte de tus páginas web', 'error');
          }
        }
      } else {
        this.$swal.fire('Error!', 'Debe ser una ruta valida', 'error');
      }
    },
    removeRoute(position) {
      this.routes.splice(position, 1);
      this.editNameOfRoutes = false;
    },
    calcEmotion() {
      const mapedUrl = this.dbInformation.map((res) => ({
        url: res.url,
        ip: res.userInfo.ip,
      }));
      const separatedUrl = [];
      const unique = [];
      this.routes.forEach((res) => {
        const filtered = mapedUrl.filter((item) => item.url === res);
        const users = [...new Set(filtered.map((item) => item.ip))];
        unique.push({
          url: res,
          users: users.length,
          porcentage: this.calcPorcentage(users.length),
          visits: filtered.length,
          droped: 0,
        });
        separatedUrl.push(filtered);
      });
      this.emotionResults = unique.map((res, index) => ({
        url: res.url,
        users: res.users,
        porcentage: res.porcentage,
        visits: res.visits,
        droped: (index + 1) < unique.length ? res.porcentage - unique[index + 1].porcentage : 0,
      }));
      const error = this.emotionResults.find((values) => values.droped < 0);
      if (error) {
        this.$swal.fire(
          'Error!',
          'Esta ruta no parece ser habitual en un comprador. Revísala y vuelve a hacer el análisis',
          'error',
        );
      }
      this.labels = unique.map((visits, index) => `#${index + 1}`);
      this.values = unique.map((visits) => visits.visits);
    },
    calcPorcentage(users) {
      return (users * 100) / this.uniqueUsers.length;
    },
    changePosition() {
      this.direction = this.direction === 'horizontal' ? 'vertical' : 'horizontal';
    },
    saveEmotionsRoutes() {
      const postData = {
        ownerId: this.computedUser.id,
        name: this.emotionRoutesName,
        routes: JSON.stringify(this.routes),
      };
      axios
        .post(`${process.env.VUE_APP_API}/emotion-routes`, postData)
        .then(() => {
          this.$swal.fire('¡Exitoso!', 'La zona ha sido guardada con exito.', 'success');
          this.getEmotionRoutes();
          this.getAnalytics();
        })
        .catch(() => {
          this.$swal.fire(
            'Error!',
            'Ha ocurrido un error, vuelve a intentar, si sigue ocurriendo comunicate con nuestro centro de servicio',
            'error',
          );
        });
    },
    changeTooltipStatus(index) {
      this.tooltipStatus = index;
    },
    checkPorcentage(porcentage, index) {
      return this.emotionResults[index + 1] ? porcentage > this.emotionResults[index + 1].porcentage : true;
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
      a.download = 'emotion.jpg';
      a.click();
      a.remove();
      this.takingPicture = false;
    },
    calcHeightFunnelChart(porcentage) {
      return porcentage < 15 ? 15 : porcentage;
    },
  },
};
</script>

<style lang="scss">
.vertical {
  flex-direction: column;
  padding: 20px 0;
  .conversion-porcentage {
    &.curved {
      border-radius: 0 0 20px 20px;
    }
  }
  .tooltip-information {
    position: absolute;
    left: 50%;
    top: 0;
    background-color: white;
    width: 400px;
    z-index: 10;
    -webkit-box-shadow: 2px 2px 10px 1px rgba(0,0,0,0.56);
    box-shadow: 2px 2px 10px 1px rgba(0,0,0,0.56);
  }
}
.horizontal {
  height: 500px;
  .conversion-rate {
    .conversion-porcentage {
      height: 100%;
      width: 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &.curved {
        border-radius: 0 20px 20px 0;
      }
    }
    .tooltip-information {
      position: absolute;
      top: -10%;
      left: -50%;
      background-color: white;
      width: 400px;
      z-index: 10;
      -webkit-box-shadow: 2px 2px 10px 1px rgba(0,0,0,0.56);
      box-shadow: 2px 2px 10px 1px rgba(0,0,0,0.56);
    }
  }
}
.conversion-porcentage {
  position: relative;
  background-image: linear-gradient(to bottom, #2864FF , #14329B);
}

.label__value, .label__title, .label__percentage {
  font-family: Montserrat !important;
}

.label__title {
  color: #96FFFF !important;
  font-size: 14px !important;
}

.label__percentage {
  color: white !important;
  font-size: 14px !important;
}

.dropped {
  display: flex;
  p {
    color: white;
    margin: 0 1rem;
  }
}

.download-button {
  .download-image {
    width: 40px;
  }
}

.drop-color {
  color: #52B788;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
