<template>
  <div class="psico-container p-4">
    <div class="psico-toolbar bg-white w-full p-4">
      <div id="user-select" class="mouse-event-filter flex items-center">
        <!-- <p class="date-filter-label pr-4">Usuario:</p>
        <select
          class="select border rounded p-2"
          name="user-selected"
          v-model="userSelected"
          id="user-selected"
        >
          <option value="empty">Seleccionar...</option>
          <option :value="user" v-for="user in dbInformation" :key="user.id">
            {{ user.userInfo.IP }}
          </option>
        </select> -->
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
      </div>
    </div>
    <div class="data-treatments-container flex mt-4">
      <div class="explorer-container p-4 bg-white w-1/2 lg:mr-2">
        <h3 class="font-bold first-color">Emoción</h3>
        <p class="py-2">
          La frustración es una emoción que puede explicar que tus clientes no finalicen una compra.
          Consiste en aquellas situaciones en las que cualquier actividad en la ruta del consumidor
          (e.g. búsqueda de categorías o productos, diligencia de formularios, elección de método de pago)
          se expone a eventos que obstaculizan su desarrollo y que antes no estaban presentes.
        </p>
        <p class="py-2">
          Agrega la ruta que hace tu usuario hasta la página de confirmación de compra
        </p>
        <input
          type="text"
          name="route"
          id="route"
          class="mt-4 w-full rounded border p-2"
          placeholder="Escribe la ruta completa, una por una"
          v-model="inputRoute"
          @keyup.enter="addRoute(inputRoute)"
        />
        <button @click="addRoute(inputRoute)" class="mt-4 button-primary rounded p-2">
          Agregar
        </button>
      </div>
      <div class="explorer-container p-4 bg-white w-1/2 lg:ml-2">
        <h3 class="font-bold first-color">Rutas</h3>
        <p
          class="py-2 flex items-center justify-between cursor-pointer"
          v-for="(route, index) in routes"
          :key="index"
        >
          {{ route }} <i @click="removeRoute(index)" class="pl-4 fas fa-times"></i>
        </p>
        <p class="py-2">Debes agregar minimo 3 Urls para obtener mejores analisis</p>
        <div class="save-routes-container" v-if="emotionRoutesSelected === 'empty'">
          <input
            v-if="routes.length === 3"
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
    <div class="results-container my-4 p-4 bg-white" v-if="emotionResults.length > 0">
      <div class="my-4 flex flex-col items-center py-4 bg-blue-900">
        <button class="background-primary p-2" @click="changePosition">Cambiar posición</button>
        <vue-funnel-graph :width="width" :height="height" :labels="labels"
          :values="values" :colors="colors" :sub-labels="subLabels" :direction="direction"
          :gradient-direction="gradientDirection"
          :animated="true" :display-percentage="true"
        ></vue-funnel-graph>
        <!-- <div class="dropped">
          <p v-for="(result, index) in emotionResults" :key="'dropped' + index">{{ result.porcentage }}% - Caida {{ Math.round(result.droped) }}%</p>
        </div> -->
        <!-- <div
          class="conversion-rate"
          :style="{ width: `${result.porcentage}%` }"
          v-for="(result, index) in emotionResults"
          :key="result.url"
        >
          <div class="conversion-porcentage relative bg-no-repeat overflow-hidden p-6 conversion-first">
            <p class="text-white text-center">#{{ index + 1 }} {{ result.url }}</p>
            <p class="text-center text-2xl third-color">Visitas: {{ result.visits }}</p>
            <p class="text-center text-5xl font-bold text-white">{{ Math.round(result.porcentage) }}%</p>
            <p class="text-center third-color">Caida {{ Math.round(result.droped) }}%</p>
          </div>
        </div> -->
      </div>
      <div class="text-results" v-if="emotionResults[emotionResults.length - 1].porcentage > 80">
        <h3 class="pb-4 first-color">Hipótesis</h3>
        <p>Más del 80% de los clientes llegan a la página de compra de [nombre de url],
          lo que significa un gran índice de conversión. Esto quiere decir que tu tienda
          está optimizada y no produce obstáculos que estimulen la frustración de tus clientes.
        </p>
        <h3 class="py-4 first-color">Recomendación</h3>
        <p>Te recomendamos que mantengas la tienda tal como está. Sin embargo, siempre es posible
          optimizarla más. Realiza una investigación más profunda en la sección “Experimento”.</p>
      </div>
      <div class="text-results" v-if="emotionResults[emotionResults.length - 1].porcentage > 50 && emotionResults[emotionResults.length - 1].porcentage < 79">
        <h3 class="pb-4 first-color">Hipótesis</h3>
        <p>Más de la mitad de tus clientes llegan a la url de compra, pero no supera el 80% de
          conversión. Esto significa que tu tienda tiene un buen nivel de optimización, pero
          probablemente existan algunos obstáculos que estimulen la frustración de tus clientes.
        </p>
        <h3 class="py-4 first-color">Recomendación</h3>
        <p>Te recomendamos que revises si existen algunos eventos en la [nombre de url] que estén
          causando que tus clientes se frustren y se salgan de la tienda en algún punto de la ruta
          de compra si quieres aumentar el nivel conversión a porcentajes más elevados.
          También puedes realizar una investigación más profunda en la sección “Experimento”.</p>
      </div>
      <div class="text-results" v-if="emotionResults[emotionResults.length - 1].porcentage < 50">
        <h3 class="pb-4 first-color">Hipótesis</h3>
        <p>Probablemente tus clientes se están frustrando porque después de un gran avance en la compra,
          han generado mucha expectativa para su consecución. Si existe un obstáculo en una página
          cerca de la compra, es probable que se genere una situación de frustración.
        </p>
        <h3 class="py-4 first-color">Recomendación</h3>
        <p>Te recomendamos que revises los eventos que ocurren en <span class="first-color">{{emotionResults[emotionResults.length - 1].url}}</span>, en el análisis de
          clics o de tiempo de carga de la página en la pestaña Analytics Estandar. También puedes
          realizar un investigación más exhaustiva en la pestaña Experimento.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { VueFunnelGraph } from 'vue-funnel-graph-js';
import { differenceInSeconds } from 'date-fns';

export default {
  name: 'Emotion',
  components: {
    VueFunnelGraph,
  },
  data() {
    return {
      url: '',
      device: '',
      startTime: '',
      endTime: '',
      timeInWebsite: 0,
      screenHeight: 800,
      screenWidth: 0,
      lowerHeight: 0,
      mouseEvents: {},
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
      inputRoute: '',
      emotionRoutesName: '',
      emotionRoutesSelected: 'empty',
      emotionRoutes: [],
      emotionResults: [],
      emotionSeparatedRoutes: [],
      labels: ['Impressions', 'Add To Cart', 'Buy'],
      values: [1500, 700, 300],
      colors: ['#2864FF', '#96FFFF'],
      direction: 'vertical',
      gradientDirection: 'horizontal',
      height: 400,
      width: 800,
    };
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
  },
  created() {
    this.$store.dispatch('setTitle', 'Emoción');
    this.getAnalytics();
    this.getWebsites();
    this.getEmotionRoutes();
  },
  watch: {
    userSelected(newValue) {
      this.screenHeight = newValue.screenHeight;
      this.screenWidth = newValue.screenWidth;
      this.url = newValue.url;
      this.mouseEvents = newValue.mouseEvents;
      this.keyboardEvents = newValue.keyboardEvents;
      this.device = newValue.device;
      const { interactions } = this.mouseEvents;
      this.startTime = interactions[0].date;
      this.endTime = interactions[interactions.length - 1].date;
      this.timeInWebsite = differenceInSeconds(new Date(this.endTime), new Date(this.startTime));
    },
    emotionRoutesSelected(newValue) {
      this.routes = newValue.routes;
    },
  },
  methods: {
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
        .catch((error) => {
          // handle error
          console.log(error);
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
        .catch((error) => {
          // handle error
          console.log(error);
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
          this.uniqueUrl = [...new Set(this.dbInformation.map((item) => item.url))];
          this.uniqueUsers = [...new Set(this.dbInformation.map((item) => item.userInfo.IP))];
          this.screenWidth = this.dbInformation[0].screenWidth;
          this.screenHeight = this.dbInformation[0].screenHeight;
          this.mouseEvents = this.dbInformation.map((res) => res.mouseEvents.interactions);
          // this.calcEmotion();
        })
        .catch((error) => {
          // handle error
          console.log(error);
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
        if (this.websites.length > 0 && this.websites.length < 3) {
          let found = false;
          this.websites.forEach((website) => {
            const ownUrl = route.includes(website.name);
            if (ownUrl) {
              // this.$swal.fire('Excelente', 'Se ha agregado con éxito', 'success');
              this.inputRoute = '';
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
    },
    calcEmotion() {
      const mapedUrl = this.dbInformation.map((res) => ({
        url: res.url,
        ip: res.userInfo.IP,
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
        droped: index + 1 < unique.length ? res.porcentage - unique[index + 1].porcentage : 0,
      }));
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
        })
        .catch((error) => {
          console.log(error);
          this.$swal.fire(
            'Error!',
            'Ha ocurrido un error, vuelve a intentar, si sigue ocurriendo comunicate con nuestro centro de servicio',
            'error',
          );
        });
    },
  },
};
</script>

<style lang="scss">
.conversion-porcentage {
  border-radius: 0 0 20px 20px;
  position: relative;
  &.conversion-first {
    background: linear-gradient(-45deg, #051367, #2D31FA, #14329B, #5D8BF4);
    background-size: 400% 400%;
    animation: gradient 10s ease infinite;
  }
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
