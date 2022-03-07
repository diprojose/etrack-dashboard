<template>
  <div class="analytics-container relative">
    <header-stats />
    <div class="flex flex-wrap">
      <analytics-toolbar
        :usersMovements="dbInformation"
        :urls="uniqueUrl"
        :zones="zones.length"
        @events-updated="eventsUpdated($event)"
        @date-range-updated="eventsUpdated($event)"
        @mouse-styles="changeMouseStyle($event)"
        @user-updated="userUpdated($event)"
        @delete-zones="zones = []"
        @save-zones="saveZones($event)"
        @zone-selected="zoneSelectedEvent($event)"
        @delete-zone-from-db="deleteZonesFromDB()"
      />
      <div
        class="empty-state w-full mx-4 z-1 p-4 bg-white rounded relative h-screen"
        v-if="url === ''"
      >
        <h3 class="text-3xl font-bold mb-4 text-center py-4">
          Empieza a filtrar para ver mas información
        </h3>
        <p class="text-center">Haz click en el icono a la izquierda para empezar</p>
      </div>
      <div
        class="w-full mx-4 z-1 p-4 bg-white rounded relative"
        v-if="url !== ''"
        @mouseup="dragSelection"
      >
        <vue-friendly-iframe
          ref="iframe"
          :src="url"
          class-name="iframe-styles"
          @load="load"
        ></vue-friendly-iframe>
        <drag-select
          @change="selectedEvents($event)"
          attribute="customAttribute"
          id="interactions"
          class="interations absolute z-2 top-0 left-0 w-full h-full"
        >
          <div
            v-for="(zone, index) in zones"
            :key="`zone${index}`"
            class="zone-item"
            :style="{
              'background-color': zone.backgroundColor,
              height: zone.height,
              width: zone.width,
              opacity: zone.opacity,
              position: zone.position,
              top: zone.top,
              left: zone.left,
            }"
            :customAttribute="zone"
            :attr="zone"
          ><i class="fas fa-times" @click="zones.splice(index, 1)"></i></div>
          <div
            v-for="(place, index) in filteredData"
            :attr="place.date"
            :class="[
              computedClass,
              { all: place.type === 'Movements' },
              { all: place.type === 'all' },
              { clicks: place.type === 'Clicks' },
              { animated: mouseStyles === 'video' },
              { 'animated-click': mouseStyles === 'video' && place.type === 'Clicks' },
              { 'item-selected-class': selected.includes(String(place.date)) },
            ]"
            :style="{
              left: place.x + 'px',
              top: place.y + 'px',
              'animation-delay': index / 20 + 's',
            }"
            :key="index"
            :customAttribute="place.date"
          />
        </drag-select>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import DragSelect from 'drag-select-vue';
import AnalyticsToolbar from '../../components/Analytics/AnalyticsToolbar.vue';
import headerStats from '../../components/Headers/HeaderStats.vue';

export default {
  components: {
    AnalyticsToolbar,
    DragSelect,
    headerStats,
  },
  data() {
    return {
      url: '',
      mouseDown: {
        x: 0,
        y: 0,
      },
      mouseUp: {
        x: 0,
        y: 0,
      },
      selected: [],
      screenHeight: 800,
      screenWidth: 0,
      lowerHeight: 0,
      mouseEvents: [],
      keyboardEvents: [],
      filteredData: [],
      dbInformation: [],
      boxWidth: 0,
      mouseStyles: 'dots',
      userEvents: [],
      eventSelected: '',
      uniqueUrl: [],
      uniqueUsers: [],
      websites: [],
      dragContainer: '',
      zones: [],
      zoneSelected: {},
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
    this.getAnalytics();
    this.getWebsites();
    this.getZones();
  },
  mounted() {},
  methods: {
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
      this.zones.push(cssSelection);
    },
    calcWidth(place) {
      const sum = (place * this.boxWidth) / this.screenWidth;
      return sum;
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
    getZones() {
      this.$store.dispatch('getZones', this.computedUser.id);
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
            'La zona ha sido guardada con exito.',
            'success',
          );
          this.getZones();
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
          this.$store.dispatch('setAnalyticsHeaderValues', {
            newUsers: this.uniqueUsers.length,
            views: this.dbInformation.length,
          });
          this.screenWidth = this.dbInformation[0].screenWidth;
          this.screenHeight = this.dbInformation[0].screenHeight;
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
    lowerValue(array) {
      let lower = array[0].y;
      for (let i = 0; i < array.length; i += 1) {
        if (lower > array[i].y) {
          lower = array[i].y;
        }
      }
      this.lowerHeight = lower;
    },
    load() {
      const container = document.querySelector('.vue-friendly-iframe');
      if (this.url !== '' && container) {
        this.boxWidth = container.offsetWidth;
      }
    },
    eventsUpdated(event) {
      let interactions = [];
      this.selected = [];
      if (event.filterType === 'user') {
        interactions = event.user.mouseEvents.interactions;
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
      this.url = this.url === zone.url ? this.url : zone.url;
      this.zoneSelected = zone;
      this.zones = JSON.parse(zone.zones);
    },
    deleteZonesFromDB() {
      axios.delete(`${process.env.VUE_APP_API}/zones-selections/${this.zoneSelected.id}`)
        .then(() => {
          this.$swal.fire(
            'Zona eliminada con exito!',
            'La zona ha sido eliminada',
            'success',
          );
          this.zones = [];
          this.getZones();
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
#selected-area {
  border: 1px dotted #000;
  position: absolute;
  z-index: 9999;
}
.iframe-styles {
  width: 100%;
  height: 5000px;
  pointer-events: none;
  z-index: 1;
}

.interations {
  position: absolute !important;
  overflow-y: scroll;
  .interaction-place {
    position: absolute;
    &.all {
      width: 5px;
      height: 5px;
      background-color: red;
    }
    &.clicks {
      border-radius: 50%;
      margin: 10px;
      height: 20px;
      width: 20px;
      transform: scale(1);
      background-color: rgba(255, 82, 82, 1);
      box-shadow: 0 0 0 0 rgba(255, 82, 82, 1);
      animation: pulse-red 2s infinite;
    }
    &.animated {
      width: 24px;
      height: 24px;
      background-image: url('../../assets/cursor.png');
      background-color: transparent;
      opacity: 0;
      animation-name: appear;
      animation-duration: 0.1s;
    }
    &.animated-click {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-image: url('../../assets/cursor.png');
      background-color: transparent;
      opacity: 0;
      animation-name: appearClick;
      animation-duration: 1s;
    }
    &.item-selected-class {
      background-color: blue;
    }
  }
}

.zone-item {
  display: flex;
  justify-content: flex-end;
  .fa-times {
    color: white;
    cursor: pointer;
    font-size: 20px;
    padding: 2px 5px;
  }
}

@keyframes appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes appearClick {
  0% {
    opacity: 0;
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
  }

  70% {
    opacity: 0.7;
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
  }

  100% {
    opacity: 1;
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
  }
}

@keyframes pulse-red {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
  }
}
</style>
