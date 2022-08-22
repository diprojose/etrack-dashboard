<template>
  <div
    class="w-full z-1 p-4 bg-white rounded relative"
    v-if="url !== ''"
    @mouseup="dragSelection"
    ref="printMe"
  >
    <!-- <div class="print-logo px-4 flex items-center flex-col" v-if="takingPicture">
      <img src="../../assets/etrack-logo.png" class="w-1/12" alt="E-track">
    </div> -->
    <img v-if="image !== ''" :src="'data:image/jpeg;base64,' + image" alt="">
    <vue-friendly-iframe
      v-if="image === ''"
      ref="iframe"
      :src="url"
      class-name="iframe-styles"
      @load="load"
    ></vue-friendly-iframe>
    <div class="svg-container">
      <svg class="w-full h-full" v-if="mouseStyles === 'line' && play">
        <line
          v-for="(place, index) in filteredData"
          :key="'svg' + index"
          :x1="place.x"
          :y1="place.y"
          :x2="(index + 1) !== filteredData.length ? filteredData[index + 1].x : place.x"
          :y2="(index + 1) !== filteredData.length ? filteredData[index + 1].y : place.y"
          :style="{
            'animation-delay': (index / 20) + 's',
            'animation-duration': filteredData.length + 's',
          }"
          :class="[
            { 'show-line': mouseStyles === 'line' },
            { movement: place.type === 'Movements' },
            { clicks: place.type === 'Clicks' },
          ]" />
      </svg>
    </div>
    <drag-select
      @change="selectedEvents($event, zones.length)"
      attribute="attr"
      id="interactions"
      class="interations absolute z-2 top-0 left-0 w-full h-full"
    >
      <template v-slot="{ selected }" v-if="mouseStyles !== 'line'">
        <div
          v-for="(zone, index) in zones"
          :key="`zone-${index}`"
          class="zone-item"
          :style="{
            'background-color': zone.backgroundColor,
            height: zone.height,
            width: zone.width,
            opacity: zone.opacity,
            position: zone.position,
            top: zone.top,
            left: zone.left,
            'z-index': 1,
          }"
        >
          <i class="fas fa-times" @click="restartZones(index)"></i>
        </div>
        <div
          v-for="(zone, index) in savedZones"
          :key="`saved-zone-${index}`"
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
        >
        </div>
        <div
          v-for="(place, index) in filteredData"
          :class="[
            computedClass,
            { all: place.type === 'Movements' },
            { all: place.type === 'all' },
            { clicks: place.type === 'Clicks' },
            { animated: mouseStyles === 'video' && play },
            { 'animated-click': mouseStyles === 'video' && place.type === 'Clicks' },
            { 'item-selected-class': selected.includes(String(place.date)) },
          ]"
          :style="{
            left: place.x + 'px',
            top: place.y + 'px',
            'animation-delay': index / 20 + 's',
          }"
          :key="`interaction-${index}`"
          :attr="place"
        />
      </template>
    </drag-select>
  </div>
</template>

<script>
import DragSelect from 'drag-select-vue';
import * as html2canvas from 'html2canvas';

export default {
  name: 'Tracks',
  components: {
    DragSelect,
  },
  props: {
    url: {
      type: String,
      default: '',
    },
    mouseStyles: {
      type: String,
      default: 'dots',
    },
    filteredData: {
      type: Array,
      default: () => [],
    },
    savedZones: {
      type: Array,
      default: () => [],
    },
    maxZones: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dragContainer: '',
      zones: [],
      selected: [],
      play: true,
      output: null,
      modalStatus: false,
      takingPicture: false,
    };
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
    computedPlayEvent() {
      return this.$store.state.playEvent;
    },
    computedDownloadEvent() {
      return this.$store.state.downloadEvent;
    },
    computedClass() {
      const retClass = ['interaction-place', 'rounded'];
      return retClass;
    },
  },
  watch: {
    computedPlayEvent(event) {
      if (event) {
        this.play = false;
        this.$store.commit('setPlayEvent', false);
        setTimeout(() => {
          this.play = true;
        }, 500);
      }
    },
    computedDownloadEvent(event) {
      if (event) {
        this.$store.commit('setDownloadEvent', false);
        this.takeScreenshot();
      }
    },
  },
  methods: {
    dragSelection() {
      this.dragContainer = document.getElementById('interactions');
      const att = document.getElementById('interactions').firstChild.getAttribute('style');
      const cssSelection = this.css2Object(att);
      if (cssSelection.width === '0px' || cssSelection.height === '0px') {
        return;
      }
      if (this.zones.length < this.maxZones) {
        this.zones.push(cssSelection);
        this.$emit('zones-selected', this.zones);
      }
    },
    selectedEvents(events, zoneNumber) {
      this.selected = events;
      const selectedNumber = this.selected.length.toString();
      const porcentage = (this.selected.length * 100) / this.filteredData.length;
      const eventObj = {
        events: selectedNumber,
        porcentage: Math.round(porcentage),
      };
      const selectsEmitted = {
        events,
        zone: zoneNumber,
      };
      this.$emit('selected-events', selectsEmitted);
      this.$store.dispatch('setSelectedEvents', eventObj);
    },
    load() {
      // const container = document.querySelector('.vue-friendly-iframe');
    },
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
    restartZones(index) {
      this.zones.splice(index, 1);
      this.$emit('zones-selected', this.zones);
    },
    async takeScreenshot() {
      this.takingPicture = true;
      const el = this.$refs.printMe;
      await html2canvas(el)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          this.output = imgData;
          const a = document.createElement('a');
          a.href = this.output;
          a.download = 'test.jpg';
          a.click();
          a.remove();
        })
        .catch(() => {
          this.takingPicture = false;
        });
      this.takingPicture = false;
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

.show-line {
  stroke: transparent;
  stroke-width: 3;
  animation-name: linePath;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  &.clicks {
    stroke-width: 15;
    border: 1px solid red;
  }
}

.svg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@keyframes appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes linePath {
  from {
    stroke:rgb(0,0,255);
    stroke-width: 5;
  }
  to {
    stroke:rgb(0,0,255);
    stroke-width: 5;
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
