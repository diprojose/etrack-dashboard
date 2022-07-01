<template>
  <div class="atention-container p-4" ref="printMe">
    <div class="atention-description pb-4" v-if="textPage">
      {{ textPage.description }}
    </div>
    <div id="atention-toolbar" class="atention-toolbar bg-white w-full p-4">
      <div
        id="user-select"
        :class="{ 'toolbar-fixed': windowTop > 200 }"
        class="mouse-event-filter flex items-center justify-between">
        <div class="user-select-container flex items-center">
          <p class="date-filter-label pr-4">Usuario:</p>
          <tooltip
            v-if="tooltips && tooltips.userDescription"
            :tooltip-text="tooltips.userDescription"
            class="mr-4" />
          <select
            class="select border border-gray-500 rounded p-2"
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
          <button class="download-button mx-4" @click="takeScreenshot" v-if="showAtentionResults">
            <img src="../../assets/download.png" class="download-image" alt="">
          </button>
        </div>
        <div class="legend">
          <p class="text-center pb-2">Gradiente de atención</p>
          <div class="color-container flex align-center items-center">
            <div class="color flex">
              <div class="color-square green"></div>
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
      </div>
      <div class="atention-results" v-if="showAtentionResults && textPage">
        <div class="atention-result-item" v-if="atentionIndex <= 0.33">
          <h3 class="py-4 first-color">Índice de atención: {{ atentionIndex }}</h3>
          <h3 class="pb-4 first-color">{{ textPage.results.low.hypoTitle }}</h3>
          <p class="pb-4">{{ textPage.results.low.hypoText }}</p>
          <h3 class="pb-4 first-color">{{ textPage.results.low.recomendationTitle }}</h3>
          <p class="pb-4">{{ textPage.results.low.recomendationText }}</p>
        </div>
        <div class="atention-result-item" v-if="atentionIndex <= 0.66 && atentionIndex > 0.33">
          <h3 class="py-4 first-color">Índice de atención: {{ atentionIndex }}</h3>
          <h3 class="pb-4 first-color">{{ textPage.results.medium.hypoTitle }}</h3>
          <p class="pb-4">{{ textPage.results.medium.hypoText }}</p>
          <h3 class="pb-4 first-color">{{ textPage.results.medium.recomendationTitle }}</h3>
          <p class="pb-4">{{ textPage.results.medium.recomendationText }}</p>
        </div>
        <div class="atention-result-item" v-if="atentionIndex > 0.66">
          <h3 class="py-4 first-color">Índice de atención: {{ atentionIndex }}</h3>
          <h3 class="pb-4 first-color">{{ textPage.results.high.hypoTitle }}</h3>
          <p class="pb-4">{{ textPage.results.high.hypoText }}</p>
          <h3 class="pb-4 first-color">{{ textPage.results.high.recomendationTitle }}</h3>
          <p class="pb-4">{{ textPage.results.high.recomendationText }}</p>
        </div>
      </div>
    </div>
    <div
      id="iframe-container"
      class="w-full my-4 z-1 bg-white rounded relative"
      v-if="url !== ''"
    >
      <img v-if="image !== ''" :src="'data:image/jpeg;base64,' + image" ref="capture" alt="">
      <iframe
        v-if="image === ''"
        ref="iframe"
        :src="url"
        id="vue-iframe"
        class-name="iframe-styles"
        @load="load"
      ></iframe>
      <div
        v-for="(heatmap, index) in screenCoordinates"
        class="heatmap"
        :class="[
          { color1: heatmap.atentionIndex < 0.05 },
          { color2: heatmap.atentionIndex >= 0.05 && heatmap.atentionIndex < 0.1 },
          { color3: heatmap.atentionIndex >= 0.1 && heatmap.atentionIndex < 0.15 },
          { color4: heatmap.atentionIndex >= 0.15 && heatmap.atentionIndex < 0.2 },
          { color5: heatmap.atentionIndex >= 0.2 && heatmap.atentionIndex < 0.25 },
          { color6: heatmap.atentionIndex >= 0.25 && heatmap.atentionIndex < 0.3 },
          { color7: heatmap.atentionIndex >= 0.3 && heatmap.atentionIndex < 0.35 },
          { color8: heatmap.atentionIndex >= 0.35 && heatmap.atentionIndex < 0.4 },
          { color9: heatmap.atentionIndex >= 0.4 && heatmap.atentionIndex < 0.45 },
          { color10: heatmap.atentionIndex >= 0.45 && heatmap.atentionIndex < 0.5 },
          { color11: heatmap.atentionIndex >= 0.5 && heatmap.atentionIndex < 0.55 },
          { color12: heatmap.atentionIndex >= 0.55 && heatmap.atentionIndex < 0.6 },
          { color13: heatmap.atentionIndex >= 0.6 && heatmap.atentionIndex < 0.65 },
          { color14: heatmap.atentionIndex >= 0.65 && heatmap.atentionIndex < 0.7 },
          { color15: heatmap.atentionIndex >= 0.7 && heatmap.atentionIndex < 0.75 },
          { color16: heatmap.atentionIndex >= 0.75 && heatmap.atentionIndex < 0.8 },
          { color17: heatmap.atentionIndex >= 0.8 && heatmap.atentionIndex < 0.85 },
          { color18: heatmap.atentionIndex >= 0.85 && heatmap.atentionIndex < 0.9 },
          { color19: heatmap.atentionIndex >= 0.9 && heatmap.atentionIndex < 0.95 },
          { color20: heatmap.atentionIndex >= 0.95 && heatmap.atentionIndex <= 1 },
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
import Tooltip from '../../components/Tooltip/Tooltip.vue';

export default {
  name: 'Atention',
  components: {
    Tooltip,
  },
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
      iframeHeight: 5000,
      atentionIndex: 0,
      showAtentionResults: false,
      textPage: null,
      windowTop: 0,
      tooltips: {},
      image: null,
      output: null,
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
      this.image = newValue.image;
      this.loading = true;
      this.startScript = new Date();
      this.screenHeight = newValue.screenHeight;
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
    this.getTooltips();
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll);
  },
  destroyed() {
    this.$store.dispatch('setTitleDescription', '');
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll, true);
  },
  methods: {
    showLoading() {
      this.$swal.fire({
        icon: 'info',
        text: 'Espere por favor...',
      });
      this.$swal.showLoading();
    },
    onScroll() {
      this.windowTop = window.top.scrollY;
    },
    getTooltips() {
      axios
        .get(`${process.env.VUE_APP_API}/tooltips/page/atention`)
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
            name: `Usuario ${index + 1} - ${res.url}`,
            image: res.image,
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
        .catch(() => {
          // handle error
        })
        .then(() => {
          // always executed
        });
    },
    getTexts() {
      axios
        .get(`${process.env.VUE_APP_API}/texts/atention`)
        .then((response) => {
          const { data } = response;
          this.textPage = JSON.parse(data[0].texts);
        });
    },
    async calcAtention(cursor) {
      this.showAtentionResults = false;
      const el = this.$refs.capture;
      const sW = this.image !== '' ? el.clientWidth : this.screenWidth;
      const sH = this.image !== '' ? el.clientHeight : this.screenHeight;
      const cursorX = [...Array(sW).keys()];
      const cursorY = [...Array(sH).keys()];
      const resultX = [];
      const resultY = [];
      cursorY.forEach((res) => {
        if (res % 20 === 0) {
          resultY.push(res);
        }
      });
      cursorX.forEach((res) => {
        if (res % 20 === 0) {
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
      const container = document.getElementById('vue-iframe');
      container.style.height = `${this.screenHeight}px`;
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
    async takeScreenshot() {
      const el = this.$refs.printMe;
      const options = {
        type: 'dataURL',
        imageSmoothingEnabled: false,
      };
      this.output = await this.$html2canvas(el, options);
      const a = document.createElement('a');
      a.href = this.output;
      a.download = 'test.jpg';
      a.click();
      a.remove();
    },
  },
};
</script>

<style lang="scss">
#vue-iframe {
  width: 100%;
  pointer-events: none;
  height: 8000px;
  z-index: 1;
}

.toolbar-fixed {
  position: fixed;
  width: 85%;
  z-index: 20;
  top: 0;
  right: 0;
  background-color: white;
  height: 50px;
  padding-right: 4rem;
  justify-content: flex-end;
  .user-select-container {
    display: none;
  }
  .legend {
    .tooltip {
      top: 150%;
      height: 40px;
    }
  }
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
      &.green {
        background: rgb(3,4,94);
        background: linear-gradient(90deg, #2b9348 0%, #55a630 25%, #80b918 50%, #aacc00 75%, #bfd200 100%);
        border-radius: 20px 0 0 20px;
      }
      &.yellow {
        background: rgb(255,186,8);
        background: linear-gradient(90deg, #d4d700 0%, #ffdd00 10%, #ffd000 20%, #ffc300 30%, #ffb700 40%, #ffaa00 50%, #ffa200 60%, #ff9500 70%, #ff8800 80%, #ff7b00 100%);
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

.download-button {
  .download-image {
    width: 40px;
  }
}

.heatmap {
  width: 20px;
  height: 20px;
  position: absolute;
  opacity: 0.7;
  &.color1 {
    background-color: #2b9348;
  }
  &.color2 {
    background-color: #55a630;
  }
  &.color3 {
    background-color: #80b918;
  }
  &.color4 {
    background-color: #aacc00;
  }
  &.color5 {
    background-color: #bfd200;
  }
  &.color6 {
    background-color: #ffea00;
  }
  &.color7 {
    background-color: #ffdd00;
  }
  &.color8 {
    background-color: #ffd000;
  }
  &.color9 {
    background-color: #ffc300;
  }
  &.color10 {
    background-color: #ffb700;
  }
  &.color11 {
    background-color: #ffaa00;
  }
  &.color12 {
    background-color: #ffa200;
  }
  &.color13 {
    background-color: #ff9500;
  }
  &.color14 {
    background-color: #ff8800;
  }
  &.color15 {
    background-color: #ff7b00;
  }
  &.color16 {
    background-color: #e85d04;
  }
  &.color17 {
    background-color: #dc2f02;
  }
  &.color18 {
    background-color: #d00000;
  }
  &.color19 {
    background-color: #9d0208;
  }
  &.color20 {
    background-color: #6a040f;
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
