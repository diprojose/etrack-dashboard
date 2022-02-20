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
      <div
        class="interations absolute top-0 left-0 w-full h-full"
        v-if="boxWidth > 0 && filteredData.length > 0"
      >
        <div
          :class="computedClass"
          v-for="(place, index) in filteredData"
          :style="{
            left: calcWidth(place.x) + 'px',
            top: place.y - lowerHeight + 'px',
            'animation-delay': (index / 20) + 's'
          }"
          :key="index"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import dummyData from '../../../test-data.json';
import AnalyticsToolbar from '../../components/Analytics/AnalyticsToolbar.vue';

export default {
  components: {
    AnalyticsToolbar,
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
      boxWidth: 0,
      mouseStyles: 'dots',
    };
  },
  methods: {
    calcWidth(place) {
      const sum = (place * this.boxWidth) / dummyData.screenWidth;
      return sum;
    },
    getAnalytics() {
      axios
        .get('http://localhost:3000/tracks')
        .then((response) => {
          const { data } = response;
          data.forEach((element) => {
            const decodedMouseEvents = atob(element.mouseEvents);
            console.log(decodedMouseEvents);
            const jsonMouseEvents = JSON.parse(decodedMouseEvents);
            this.mouseEvents.push(jsonMouseEvents);
          });
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
    // this.getAnalytics();
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
}

.interations {
  pointer-events: none;
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
