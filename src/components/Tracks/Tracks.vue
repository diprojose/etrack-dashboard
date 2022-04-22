<template>
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
      @change="selectedEvents($event, zones.length)"
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
      >
        <i class="fas fa-times" @click="restartZones(index)"></i>
      </div>
      <div
        v-for="(zone, index) in savedZones"
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
      >
      </div>
      <div class="dots-container" v-if="mouseStyles !== 'line'">
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
          :customAttribute="JSON.stringify(place)"
        />
      </div>
      <svg class="w-full h-full" v-if="mouseStyles === 'line'">
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
          :class="{ 'show-line': mouseStyles === 'line' }" />
      </svg>
    </drag-select>
  </div>
</template>

<script>
import DragSelect from 'drag-select-vue';

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
  },
  data() {
    return {
      dragContainer: '',
      zones: [],
      selected: [],
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
    selectedEvents(events, zonesNumber) {
      this.selected = events;
      const selectedNumber = this.selected.length.toString();
      const porcentage = (this.selected.length * 100) / this.filteredData.length;
      const eventObj = {
        events: selectedNumber,
        porcentage: Math.round(porcentage),
      };
      const selectsEmitted = {
        events,
        zone: zonesNumber,
      };
      this.$emit('selected-events', selectsEmitted);
      this.$store.dispatch('setSelectedEvents', eventObj);
    },
    load() {
      const container = document.querySelector('.vue-friendly-iframe');
      console.log(container);
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
    stroke:rgb(255,0,0);
    stroke-width: 3;
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
