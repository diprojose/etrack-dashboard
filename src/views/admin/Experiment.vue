<template>
  <div class="p-4">
    <p class="flex mb-4">
      ¿Qué es un experimento?
      <!-- <tooltip :tooltip-text="tooltips.description" class="ml-2" /> -->
    </p>
    <div class="description mb-4" v-if="textPage">
      {{ textPage.description }}
    </div>
    <a class="button-primary px-4 py-2 rounded" href="https://e-trackanalytics.com/contact/" target="_blank">Contáctanos aquí</a>
    <div class="image-container my-4" v-if="textPage && textPage.images">
      <img class="w-full" v-for="(image, imageIndex) in textPage.images" :key="'image' + imageIndex" :src="image.url" alt="">
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// import Tooltip from '../../components/Tooltip/Tooltip.vue';

export default {
  name: 'Experiment',
  components: {
    // Tooltip,
  },
  data() {
    return {
      textPage: null,
      showPdf: false,
      tooltips: {},
      config: {
        toolbar: {
          toolbarViewerRight: {
            presentationMode: true,
            openFile: false,
            print: false,
            download: true,
            viewBookmark: true,
          },
        },
      },
    };
  },
  created() {
    this.$store.dispatch('setTitle', 'Experimento');
    this.getTexts();
    this.getTooltips();
  },
  mounted() {
    this.showPdf = true;
  },
  methods: {
    getTexts() {
      axios
        .get(`${process.env.VUE_APP_API}/texts/experiment`)
        .then((response) => {
          const { data } = response;
          this.textPage = JSON.parse(data[0].texts);
        });
    },
    getTooltips() {
      axios
        .get(`${process.env.VUE_APP_API}/tooltips/page/experiment`)
        .then((response) => {
          const { data } = response;
          this.tooltips = {};
          data.forEach((res) => {
            this.tooltips = {
              ...this.tooltips,
              [res.name]: res.text,
            };
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.pdf-experiment {
  width: 100%;
  height: 600px;
  margin: 50px 0;
}
</style>
