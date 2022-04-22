<template>
  <div class="atention-container p-4">
    <div id="atention-toolbar" class="atention-toolbar bg-white w-full p-4">
      <div id="user-select" class="mouse-event-filter flex items-center justify-between">
        <div class="user-select-container flex items-center">
          <p class="date-filter-label pr-4">Usuario:</p>
          <select
            class="select border rounded p-2"
            name="user-selected"
            v-model="userSelected"
            id="user-selected"
          >
            <option value="empty">Seleccionar...</option>
            <option :value="user" v-for="user in dbInformation" :key="user.id">
              {{ user.name }}
            </option>
          </select>
          <button class="button-primary p-2 rounded" v-if="userSelected !== 'empty'" @click="calcRelativeDistance()">
            Calcular
          </button>
        </div>
        <div class="legend flex align-center">
          <div class="color flex">
            <div class="color-square blue"></div>
            <div class="tooltip p-2" v-if="textPage">
              <span class="triangle"></span>
              {{ textPage.legend.low }}
            </div>
          </div>
          <div class="color flex">
            <div class="color-square yellow"></div>
            <div class="tooltip p-2" v-if="textPage">
              <span class="triangle"></span>
              {{ textPage.legend.medium }}
            </div>
          </div>
          <div class="color flex">
            <div class="color-square red"></div>
            <div class="tooltip p-2" v-if="textPage">
              <span class="triangle"></span>
              {{ textPage.legend.high }}
            </div>
          </div>
        </div>
      </div>
      <div class="atention-results" v-if="showAtentionResults && textPage">
        <div class="atention-result-item" v-if="atentionIndex < 0.31">
          <h3 class="py-4 first-color">Atención: {{ atentionIndex }}</h3>
          <h3 class="pb-4 first-color">{{ textPage.results.low.hypoTitle }}</h3>
          <p class="pb-4">{{ textPage.results.low.hypoText }}</p>
          <h3 class="pb-4 first-color">{{ textPage.results.low.recomendationTitle }}</h3>
          <p class="pb-4">{{ textPage.results.low.recomendationText }}</p>
        </div>
        <div class="atention-result-item" v-if="atentionIndex < 0.66 && atentionIndex > 0.3">
          <h3 class="py-4 first-color">Atención: {{ atentionIndex }}</h3>
          <h3 class="pb-4 first-color">{{ textPage.results.medium.hypoTitle }}</h3>
          <p class="pb-4">{{ textPage.results.medium.hypoText }}</p>
          <h3 class="pb-4 first-color">{{ textPage.results.medium.recomendationTitle }}</h3>
          <p class="pb-4">{{ textPage.results.medium.recomendationText }}</p>
        </div>
        <div class="atention-result-item" v-if="atentionIndex > 0.66">
          <h3 class="py-4 first-color">Atención: {{ atentionIndex }}</h3>
          <h3 class="pb-4 first-color">{{ textPage.results.high.hypoTitle }}</h3>
          <p class="pb-4">{{ textPage.results.high.hypoText }}</p>
          <h3 class="pb-4 first-color">{{ textPage.results.high.recomendationTitle }}</h3>
          <p class="pb-4">{{ textPage.results.high.recomendationText }}</p>
        </div>
      </div>
    </div>
    <div
      id="iframe-container"
      class="w-full my-4 z-1 p-4 bg-white rounded relative"
      v-if="url !== ''"
    >
      <vue-friendly-iframe
        ref="iframe"
        :src="url"
        class-name="iframe-styles"
        :style="{ height: iframeHeight + 'px' }"
        @load="load"
      ></vue-friendly-iframe>
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
      />
      <!-- <div
        class="centroid-item"
        :style="{
          'background-color': 'blue',
          height: '5px',
          width: '5px',
          'border-radius': '100%',
          position: 'absolute',
          top: centroid.y + 'px',
          left: centroid.x + 'px',
        }"
      /> -->
      <div
        v-for="(place, index) in filteredData"
        :class="[
          computedClass,
          { all: place.type === 'Movements' },
          { all: place.type === 'all' },
          { clicks: place.type === 'Clicks' },
          { animated: mouseStyles === 'video' },
          { 'animated-click': mouseStyles === 'video' && place.type === 'Clicks' },
        ]"
        :style="{
          left: place.x + 'px',
          top: place.y + 'px',
          'animation-delay': index / 20 + 's',
        }"
        :key="index"
      />
      <div
        v-for="(heatmap, index) in screenCoordinates"
        class="heatmap"
        :class="[
          { color1: heatmap.atentionIndex < 0.1 },
          { color2: heatmap.atentionIndex > 0 && heatmap.atentionIndex < 0.1 },
          { color3: heatmap.atentionIndex > 0.1 && heatmap.atentionIndex < 0.2 },
          { color4: heatmap.atentionIndex > 0.2 && heatmap.atentionIndex < 0.3 },
          { color5: heatmap.atentionIndex > 0.3 && heatmap.atentionIndex < 0.4 },
          { color6: heatmap.atentionIndex > 0.4 && heatmap.atentionIndex < 0.5 },
          { color7: heatmap.atentionIndex > 0.5 && heatmap.atentionIndex < 0.6 },
          { color8: heatmap.atentionIndex > 0.6 && heatmap.atentionIndex < 0.7 },
          { color9: heatmap.atentionIndex > 0.7 && heatmap.atentionIndex < 0.8 },
          { color10: heatmap.atentionIndex > 0.8 && heatmap.atentionIndex < 0.9 },
          { color11: heatmap.atentionIndex > 0.9 && heatmap.atentionIndex < 1.1 },
        ]"
        :style="{
          left: heatmap.x + 'px',
          top: heatmap.y + 'px',
          'animation-delay': index / 20 + 's',
        }"
        :key="'heatmap' + index"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Atention',
  data() {
    return {
      url: '',
      screenHeight: 800,
      screenWidth: 0,
      mouseEvents: [],
      dbInformation: [],
      filteredData: [],
      boxWidth: 0,
      mouseStyles: 'dots',
      uniqueUrl: [],
      uniqueUsers: [],
      zones: [],
      zoneSelected: {},
      centroid: {},
      dMaxTopLeft: [],
      dMaxBottomRight: [],
      screenCoordinates: [],
      userSelected: 'empty',
      loading: false,
      maxDistance: [],
      startScript: '',
      endScript: '',
      iframeHeight: 150,
      atentionIndex: 0,
      showAtentionResults: false,
      textPage: null,
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
    computedZones() {
      return this.$store.state.zones;
    },
  },
  watch: {
    zoneSelected(newValue) {
      this.zoneSelectedEvent(newValue);
    },
    userSelected(newValue) {
      this.showLoading();
      const container = document.getElementById('atention-toolbar');
      this.url = newValue.url;
      this.loading = true;
      this.startScript = new Date();
      this.screenHeight = Math.round((newValue.screenHeight * container.offsetWidth) / newValue.screenWidth);
      this.screenWidth = container.offsetWidth;
      const { interactions } = newValue.mouseEvents;
      setTimeout(() => {
        this.calcAtention(interactions);
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch('setTitle', 'Atención');
    this.getAnalytics();
    this.getZones();
    this.getTexts();
  },
  methods: {
    showLoading() {
      this.$swal.fire({
        icon: 'info',
        text: 'Espere por favor...',
      });
      this.$swal.showLoading();
    },
    calcPosition(mouseEvent) {
      const container = document.getElementById('atention-toolbar');
      const positionX = (mouseEvent.x * container.offsetWidth) / mouseEvent.width;
      return Math.round(positionX);
    },
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
            name: `Usuario ${index + 1}`,
          }));
          this.uniqueUrl = [...new Set(this.dbInformation.map((item) => item.url))];
          this.uniqueUsers = [...new Set(this.dbInformation.map((item) => item.userInfo.IP))];
          this.$store.dispatch('setAnalyticsHeaderValues', {
            newUsers: this.uniqueUsers.length,
            views: this.dbInformation.length,
          });
          this.screenWidth = this.dbInformation[0].screenWidth + 1;
          this.screenHeight = this.dbInformation[0].screenHeight + 1;
          this.saveMaxDistance(this.screenWidth, this.screenHeight);
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
    getTexts() {
      axios
        .get('http://localhost:3000/texts/atention')
        .then((response) => {
          const { data } = response;
          this.textPage = JSON.parse(data[0].texts);
          console.log(this.textPage);
        });
    },
    async calcAtention(cursor) {
      this.showAtentionResults = false;
      const cursorX = [...Array(this.screenWidth).keys()];
      const cursorY = [...Array(this.screenHeight).keys()];
      const resultX = [];
      const resultY = [];
      cursorY.forEach((res) => {
        if (res % 10 === 0) {
          resultY.push(res);
        }
      });
      cursorX.forEach((res) => {
        if (res % 10 === 0) {
          resultX.push(res);
        }
      });
      const posiblesCoordinates = resultX.flatMap((d) => resultY.map((v) => ({ x: d, y: v })));
      this.screenCoordinates = await this.calcAbsoluteDistance(posiblesCoordinates, cursor);
      const atention = this.screenCoordinates.reduce((previousValue, currentValue) => previousValue + currentValue.atentionIndex, 0);
      this.atentionIndex = Number(atention / this.screenCoordinates.length).toFixed(2);
      this.$swal.close();
      this.endScript = new Date();
      this.showAtentionResults = true;
      // console.log(this.screenCoordinates);
    },
    calcAbsoluteDistance(screenSize, cursor) {
      const result = screenSize;
      return new Promise((resolve) => {
        screenSize.forEach((screen, index) => {
          const coordinate = [];
          const permaneceList = [];
          cursor.forEach((mouse, mouseIndex) => {
            const nextDate = mouseIndex + 1 < cursor.length ? new Date(cursor[mouseIndex + 1].date).getTime() : 0;
            const permanence = nextDate - new Date(mouse.date).getTime();
            const coordinateResult = this.pitagoras(mouse, screen, permanence);
            permaneceList.push(permanence > 0 ? permanence : 0);
            coordinate.push(coordinateResult);
          });
          const sumOfResults = coordinate.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
          const sumOfPermanences = permaneceList.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
          const atentionIndex = sumOfResults / sumOfPermanences;
          // console.log(`${sumOfResults} / ${sumOfPermanences} = ${atentionIndex}`);
          result[index].atentionIndex = 1 - atentionIndex;
          coordinate.splice(0, coordinate.length);
        });
        this.loading = false;
        resolve(result);
      });
    },
    zoneSelectedEvent(zone) {
      this.url = this.url === zone.url ? this.url : zone.url;
      this.zoneSelected = zone;
      this.zones = JSON.parse(zone.zones);
      const filteredByUrl = this.dbInformation.filter((res) => res.url === zone.url);
      const mouseEventsUrl = filteredByUrl.map((res) => res.mouseEvents.interactions.map((int) => ({
        ...int,
        width: res.screenWidth,
        height: res.screenHeight,
      })));
      const interactions = mouseEventsUrl.flat();
      this.filteredData = interactions.map((res) => ({
        x: this.calcPosition(res),
        y: Math.round(res.y),
        type: res.type,
        width: res.width,
        height: res.height,
      }));
      this.getCentroid(this.zones[0]);
    },
    restartZones() {
      this.zones = [];
      this.centroid = [];
    },
    calcPitagoras(endX, startX, endY, startY) {
      return Math.hypot(endX - startX, endY - startY);
    },
    pitagoras(mouse, screen, permanence) {
      const result = this.calcPitagoras(mouse.x, screen.x, mouse.y, screen.y);
      let max = 0;
      this.maxDistance.forEach((dis) => {
        const maxResult = this.calcPitagoras(dis.x, screen.x, dis.y, screen.y);
        max = max >= maxResult ? max : maxResult;
      });
      return permanence > 0 ? (result / max) * permanence : 0;
    },
    load() {
      const container = document.querySelector('iframe');
      container.height = this.userSelected.screenHeight;
      const containerDimensions = container.getBoundingClientRect();
      this.dMaxTopLeft = [containerDimensions.top, containerDimensions.left];
      this.dMaxBottomRight = [containerDimensions.bottom, containerDimensions.right];
      if (this.url !== '' && container) {
        this.boxWidth = container.offsetWidth;
      }
    },
    saveMaxDistance(screenWidth, screenHeight) {
      this.maxDistance = [
        {
          x: 0,
          y: 0,
        },
        {
          x: screenWidth,
          y: 0,
        },
        {
          x: 0,
          y: screenHeight,
        },
        {
          x: screenWidth,
          y: screenHeight,
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.iframe-styles {
  width: 100%;
  pointer-events: none;
  z-index: 1;
}

.legend {
  .color {
    position: relative;
    &:hover {
      .tooltip {
        display: block;
      }
    }
    .tooltip {
      width: 200px;
      background: #14329B;
      color: #ffffff;
      text-align: center;
      border-radius: 10px;
      bottom: calc(100% + 11px);
      left: 70%;
      transform: translateX(-50%);
      position: absolute;
      display: none;
      z-index: 11;
      .triangle {
        border-width: 0 6px 6px;
        border-color: transparent;
        border-bottom-color: #14329B;
        position: absolute;
        bottom: -6px;
        transform: rotate(180deg);
        left: calc(50% - 12px);
      }
    }
    .color-square {
      width: 100px;
      height: 10px;
      &.red {
        background: rgb(255,109,0);
        background: linear-gradient(90deg, rgba(255,109,0,1) 0%, rgba(255,84,0,1) 50%, rgba(255,0,0,1) 100%);
        border-radius: 0 20px 20px 0;
      }
      &.blue {
        background: rgb(3,4,94);
        background: linear-gradient(90deg, rgba(3,4,94,1) 0%, rgba(2,62,138,1) 25%, rgba(0,119,182,1) 50%, rgba(0,150,199,1) 75%, rgba(0,180,216,1) 100%);
        border-radius: 20px 0 0 20px;
      }
      &.yellow {
        background: rgb(255,186,8);
        background: linear-gradient(90deg, rgba(255,186,8,1) 0%, rgba(250,163,7,1) 50%, rgba(255,133,0,1) 100%);
      }
    }
  }
}

.interaction-place {
  position: absolute;
  &.all {
    width: 5px;
    height: 5px;
    background-color: red;
  }
  &.clicks {
    margin: 10px;
    height: 10px;
    width: 10px;
    transform: scale(1);
    background-color: blue;
    box-shadow: 0 0 0 0 blue;
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

.heatmap {
  width: 10px;
  height: 10px;
  position: absolute;
  opacity: 0.7;
  &.color1 {
    background-color: #03045E;
  }
  &.color2 {
    background-color: #023E8A;
  }
  &.color3 {
    background-color: #0077B6;
  }
  &.color4 {
    background-color: #0096C7;
  }
  &.color5 {
    background-color: #00B4D8;
  }
  &.color6 {
    background-color: #ffba08;
  }
  &.color7 {
    background-color: #faa307;
  }
  &.color8 {
    background-color: #FF8500;
  }
  &.color9 {
    background-color: #FF6D00;
  }
  &.color10 {
    background-color: #FF5400;
  }
  &.color11 {
    background-color: red;
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
