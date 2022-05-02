<template>
  <div class="p-4">
    <div class="description" v-if="textPage">
      {{ textPage.description }}
    </div>
    <iframe v-if="textPage && textPage.pdf" class="pdf-experiment" :src="textPage.pdf" frameborder="0"></iframe>
    <a class="text-blue-400 hover:text-blue-700" href="https://e-trackanalytics.com/contact/" target="_blank">Contactanos aquí</a>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Experiment',
  data() {
    return {
      textPage: null,
      showPdf: false,
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
