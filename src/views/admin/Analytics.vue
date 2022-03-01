<template>
  <div class="flex flex-wrap">
    <analytics-toolbar
      @events-updated="eventsUpdated($event)"
      @date-range-updated="eventsUpdated($event)"
      @mouse-styles="changeMouseStyle($event)"
    />
    <div class="w-full mx-4 z-10 p-4 bg-white rounded relative">
      <vue-friendly-iframe
        ref="iframe"
        :src="url"
        class-name="iframe-styles"
        @load="load"
      ></vue-friendly-iframe>
      <drag-select
        @change="selectedEvents($event)"
        attribute="customAttribute"
        class="interations absolute top-0 left-0 w-full h-full">
        <div
          :class="computedClass"
          v-for="(place, index) in filteredData"
          :style="{
            left: calcWidth(place.x) + 'px',
            top: place.y - lowerHeight + 'px',
            'animation-delay': (index / 20) + 's'
          }"
          :key="index"
          :customAttribute="place.type" />
      </drag-select>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import DragSelect from 'drag-select-vue';
import dummyData from '../../../test-data.json';
import AnalyticsToolbar from '../../components/Analytics/AnalyticsToolbar.vue';

export default {
  components: {
    AnalyticsToolbar,
    DragSelect,
  },
  data() {
    return {
      url: 'https://ideiasjournal.com/',
      testData: dummyData.interactions,
      screenHeight: dummyData.screenHeight ? dummyData.screenHeight : 800,
      screenWidth: dummyData.screenWidth,
      lowerHeight: 0,
      mouseEvents: [],
      keyboardEvents: [],
      filteredData: [],
      dbInformation: [],
      boxWidth: 0,
      mouseStyles: 'dots',
    };
  },
  methods: {
    calcWidth(place) {
      const sum = (place * this.boxWidth) / dummyData.screenWidth;
      return sum;
    },
    selectedEvents(events) {
      const selected = events;
      const selectedNumber = selected.length.toString();
      const porcentage = (selected.length * 100) / this.filteredData.length;
      const eventObj = {
        events: selectedNumber,
        porcentage: Math.round(porcentage),
      };
      this.$store.dispatch('setSelectedEvents', eventObj);
    },
    getAnalytics() {
      axios
        .get('http://localhost:3000/tracks')
        .then((response) => {
          const { data } = response;
          data.forEach((res) => {
            this.dbInformation.push(this.formatJson(res));
          });
          this.mouseEvents = this.dbInformation.map((res) => res.mouseEvents.interactions);
          console.log(this.mouseEvents);
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
    },
    formatJson(data) {
      return {
        created: data.created,
        id: data.id,
        mouseEvents: data.mouseEvents ? JSON.parse(data.mouseEvents) : '',
        scrollEvents: data.scrollEvents ? JSON.parse(data.scrollEvents) : '',
        userInfo: data.userInfo ? JSON.parse(data.userInfo) : '',
        keyboardEvents: data.keyboardEvents ? JSON.parse(data.keyboardEvents) : '',
        screenEvents: data.screenEvents ? JSON.parse(data.screenEvents) : '',
      };
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
      this.boxWidth = container.offsetWidth;
    },
    eventsUpdated(event) {
      const filteredEvents = this.testData.filter((element) => element.type === event.event);
      const filteredByDates = filteredEvents.filter((element) => new Date(element.date) >= new Date(event.startDate)
        && new Date(element.date) <= new Date(event.endDate));
      this.filteredData = filteredByDates;
      // este codigo es para filtrar los diferentes usuarios
      // const users = this.filteredData.filter((x, i, a) => a.indexOf(x) == i);
    },
    changeMouseStyle(style) {
      this.mouseStyles = style;
    },
  },
  computed: {
    computedClass() {
      const retClass = ['interaction-place', 'rounded'];
      if (this.mouseStyles === 'dots') {
        retClass.push('all');
      }
      if (this.mouseStyles === 'video') {
        retClass.push('animated');
      }
      return retClass;
    },
  },
  created() {
    this.getAnalytics();
  },
  mounted() {
    this.lowerValue(this.testData);
    const iframeContainer = document.querySelector('iframe');
    const width = iframeContainer.offsetWidth;
    const calc = (width * this.screenWidth) / this.screenHeight;
    console.log(calc);
  },
};
</script>

<style lang="scss">
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
    &.animated {
      width: 24px;
      height: 24px;
      background-image: url('../../assets/cursor.png');
      opacity: 0;
      animation-name: appear;
      animation-duration: 0.1s;
    }
    &.all {
      width: 5px;
      height: 5px;
      background-color: red;
    }
  }
}

@keyframes appear {
  from {opacity: 0;}
  to {opacity: 1;}
}
</style>
