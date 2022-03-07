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
            v-if="routes.length === 3"
            @click="saveEmotionsRoutes"
          >
            Guardar
          </button>
        </div>
        <div class="next-container">
          <button
            class="mt-4 button-primary rounded p-2"
            v-if="routes.length === 3"
            @click="calcEmotion"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
    <div class="results-container my-4 p-4 bg-white" v-if="emotionResults.length > 0">
      <h3>Resultados</h3>
      <div class="flex my-4">
        <div
          class="conversion-rate border border-black mb-4 w-1/3 mx-1"
          v-for="(result, index) in emotionResults"
          :key="result.url"
        >
          <div class="conversion-title button-primary text-sm p-1">
            #{{ index + 1 }} {{ result.url }}
          </div>
          <div class="conversion-counts flex justify-between p-1 border-b-2 border-black">
            <p>Visitas</p>
            <p>{{ result.visits }}({{ result.porcentage }}%)</p>
          </div>
          <div class="conversion-porcentage relative bg-no-repeat overflow-hidden">
            <div class="wave" :style="{ left: `${result.porcentage}%` }"></div>
            <!-- <div class="progress h-full absolute bg-blue-500 opacity-50 top-0 left-0" :style="{ width: `${result.porcentage}%` }"></div> -->
            <p class="text-center text-3xl font-bold p-6">{{ result.porcentage }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { differenceInSeconds } from 'date-fns';

export default {
  name: 'PsychologicalAnalytics',
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
    };
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
  },
  created() {
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
        filtered.sort((a, b) => a.ip.localeCompare(b.ip));
        const users = [...new Set(filtered.map((item) => item.ip))];
        unique.push({
          url: res,
          users: users.length,
          porcentage: this.calcPorcentage(users.length),
          visits: filtered.length,
        });
        separatedUrl.push(filtered);
      });
      this.emotionResults = unique;
    },
    calcPorcentage(users) {
      return (users * 100) / this.uniqueUsers.length;
    },
    saveEmotionsRoutes() {
      const postData = {
        ownerId: this.computedUser.id,
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
  background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
  background-size: cover;
}

.wave {
  width: 500px;
  height: 500px;
  position: absolute;
  top: -50%;
  border-radius: 35%;
  background: rgba(255, 255, 255, .75);
  animation: wave 15s infinite linear;
}

@keyframes wave {
  from { transform: rotate(0deg);}
  from { transform: rotate(360deg);}
}
</style>
