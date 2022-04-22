<template>
  <div class="admin-container">
    <ul class="tabs flex px-4">
      <li
        class="tab-item p-2 cursor-pointer"
        v-for="tab in tabs"
        :class="{ active: tab.active }"
        @click="activateTab(tab)"
        :key="tab.text">{{ tab.text }}</li>
    </ul>
    <div class="content-container p-4" v-if="textPage">
      <div class="content-item" v-for="(page, index) in textPage" :key="'content' + page.id">
        <div class="results" v-if="page.texts.results && activeTab.id === page.id">
          <div class="result-item result-high">
            <h3 class="block uppercase text-blueGray-600 text-sm font-bold py-4">Resultado alto</h3>
            <div class="result-row md:flex lg:flex">
              <div class="result-col w-1/3" v-if="page.texts.results.high.learningResultTitle">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.high.learningResultTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm w-full"
                  v-model="textPage[index].texts.results.high.learningResultText"
                />
              </div>
              <div class="result-col w-1/3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.high.hypoTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm w-full"
                  v-model="textPage[index].texts.results.high.hypoText"
                />
              </div>
              <div class="result-col w-1/3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.high.recomendationTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm w-full"
                  v-model="textPage[index].texts.results.high.recomendationText"
                />
              </div>
            </div>
          </div>
          <div class="result-item result-medium">
            <h3 class="block uppercase text-blueGray-600 text-sm font-bold py-4">Resultado medio</h3>
            <div class="result-row md:flex lg:flex">
              <div class="result-col w-1/3" v-if="page.texts.results.medium.learningResultTitle">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.medium.learningResultTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm w-full"
                  v-model="textPage[index].texts.results.medium.learningResultText"
                />
              </div>
              <div class="result-col w-1/3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.medium.hypoTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm w-full"
                  v-model="textPage[index].texts.results.medium.hypoText"
                />
              </div>
              <div class="result-col w-1/3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.medium.recomendationTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm w-full"
                  v-model="textPage[index].texts.results.medium.recomendationText"
                />
              </div>
            </div>
          </div>
          <div class="result-item result-low">
            <h3 class="block uppercase text-blueGray-600 text-sm font-bold py-4">Resultado bajo</h3>
            <div class="result-row md:flex lg:flex">
              <div class="result-col w-1/3" v-if="page.texts.results.low.learningResultTitle">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.low.learningResultTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm w-full"
                  v-model="textPage[index].texts.results.low.learningResultText"
                />
              </div>
              <div class="result-col w-1/3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.low.hypoTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm w-full"
                  v-model="textPage[index].texts.results.low.hypoText"
                />
              </div>
              <div class="result-col w-1/3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.low.recomendationTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm w-full"
                  v-model="textPage[index].texts.results.low.recomendationText"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminTexts',
  components: {
  },
  data() {
    return {
      textPage: null,
      tabs: [
        {
          id: 'atention',
          text: 'Atención',
          active: true,
        },
        {
          id: 'emotion',
          text: 'Emoción',
          active: false,
        },
        {
          id: 'motivation',
          text: 'Motivación',
          active: false,
        },
        {
          id: 'learning',
          text: 'Aprendizaje',
          active: false,
        },
      ],
      activeTab: '',
    };
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
  },
  created() {
    this.$store.dispatch('setTitle', 'Administrador');
    this.getTexts();
    [this.activeTab] = this.tabs;
  },
  methods: {
    getTexts() {
      axios
        .get('http://localhost:3000/texts')
        .then((response) => {
          const { data } = response;
          this.textPage = data.map((res) => ({
            texts: JSON.parse(res.texts),
            id: res.id,
          }));
          console.log(this.textPage);
        });
    },
    activateTab(tab) {
      const indexTab = this.tabs.indexOf(tab);
      const allTabs = this.tabs.map((res, index) => ({
        id: res.id,
        text: res.text,
        active: index === indexTab,
      }));
      this.activeTab = allTabs[indexTab];
      this.tabs = allTabs;
    },
  },
};
</script>

<style lang="scss" scoped>
.admin-container {
  .tabs {
    .tab-item {
      border-bottom: 1px solid #14329B;
      &.active {
        border-bottom: none;
        border-top: 1px solid #14329B;
        border-right: 1px solid #14329B;
        border-left: 1px solid #14329B;
        border-radius: 20px 20px 0 0;
        background-color: #14329B;
        color: white;
      }
    }
  }
  .content-container {
    .content-item {
      .results {
        .result-item {
          background-color: gray;
        }
      }
    }
  }
}
</style>
