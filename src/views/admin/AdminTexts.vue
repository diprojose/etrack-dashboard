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
        <div class="description rounded-md p-4 mb-4" v-if="page.texts.description && activeTab.id === page.id">
          <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Descripción</h3>
          <div class="description-container px-2">
            <textarea
              type="text"
              name="legend-high"
              id="legend-high"
              class="px-3 py-3 bg-white rounded text-sm shadow w-full"
              v-model="textPage[index].texts.description" />
          </div>
        </div>
        <div class="description rounded-md p-4 mb-4" v-if="page.texts.pdf && activeTab.id === page.id">
          <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Archivo PDF</h3>
          <div class="description-container px-2">
            <input
              type="text"
              name="legend-high"
              id="legend-high"
              class="px-3 py-3 bg-white rounded text-sm shadow w-full"
              v-model="textPage[index].texts.pdf" />
          </div>
        </div>
        <div class="routes rounded-md p-4 mb-4" v-if="page.texts.routeDescription && activeTab.id === page.id">
          <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Rutas</h3>
          <div class="description-container px-2">
            <label
              class="block uppercase text-gray-600 text-xs font-bold mb-2"
            >
              Descripción de la ruta
            </label>
            <textarea
              type="text"
              name="legend-high"
              id="legend-high"
              class="px-3 py-3 bg-white rounded text-sm shadow w-full"
              v-model="textPage[index].texts.routeDescription" />
          </div>
          <div class="description-container pt-4 px-2">
            <label
              class="block uppercase text-gray-600 text-xs font-bold mb-2"
            >
              Texto dentro del campo para escribir
            </label>
            <input
              type="text"
              name="legend-high"
              id="legend-high"
              class="px-3 py-3 bg-white rounded text-sm shadow w-full"
              v-model="textPage[index].texts.routePlaceholder" />
          </div>
        </div>
        <div class="results" v-if="page.texts.results && activeTab.id === page.id">
          <div class="result-item mb-4 rounded-md p-4 result-high">
            <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Resultado alto</h3>
            <div class="result-row md:flex lg:flex">
              <div class="result-col w-1/3 px-2" v-if="page.texts.results.high.learningResultTitle">
                <label
                  class="block uppercase text-gray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.high.learningResultTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm shadow w-full"
                  v-model="textPage[index].texts.results.high.learningResultText"
                />
              </div>
              <div class="result-col w-1/3 px-2">
                <label
                  class="block uppercase text-gray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.high.hypoTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm shadow w-full"
                  v-model="textPage[index].texts.results.high.hypoText"
                />
              </div>
              <div class="result-col w-1/3 px-2">
                <label
                  class="block uppercase text-gray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.high.recomendationTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm shadow w-full"
                  v-model="textPage[index].texts.results.high.recomendationText"
                />
              </div>
            </div>
          </div>
          <div class="result-item mb-4 rounded-md p-4 result-medium">
            <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Resultado medio</h3>
            <div class="result-row md:flex lg:flex">
              <div class="result-col w-1/3 px-2" v-if="page.texts.results.medium.learningResultTitle">
                <label
                  class="block uppercase text-gray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.medium.learningResultTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm shadow w-full"
                  v-model="textPage[index].texts.results.medium.learningResultText"
                />
              </div>
              <div class="result-col w-1/3 px-2">
                <label
                  class="block uppercase text-gray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.medium.hypoTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm shadow w-full"
                  v-model="textPage[index].texts.results.medium.hypoText"
                />
              </div>
              <div class="result-col w-1/3 px-2">
                <label
                  class="block uppercase text-gray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.medium.recomendationTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm shadow w-full"
                  v-model="textPage[index].texts.results.medium.recomendationText"
                />
              </div>
            </div>
          </div>
          <div class="result-item mb-4 rounded-md p-4 result-low">
            <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Resultado bajo</h3>
            <div class="result-row md:flex lg:flex">
              <div class="result-col w-1/3 px-2" v-if="page.texts.results.low.learningResultTitle">
                <label
                  class="block uppercase text-gray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.low.learningResultTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm shadow w-full"
                  v-model="textPage[index].texts.results.low.learningResultText"
                />
              </div>
              <div class="result-col w-1/3 px-2">
                <label
                  class="block uppercase text-gray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.low.hypoTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm shadow w-full"
                  v-model="textPage[index].texts.results.low.hypoText"
                />
              </div>
              <div class="result-col w-1/3 px-2">
                <label
                  class="block uppercase text-gray-600 text-xs font-bold mb-2"
                >
                  {{ page.texts.results.low.recomendationTitle }}
                </label>
                <textarea
                  type="text"
                  class="p-3 rounded text-sm shadow w-full"
                  v-model="textPage[index].texts.results.low.recomendationText"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="legend rounded-md p-4" v-if="page.texts.legend && activeTab.id === page.id">
          <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Legenda</h3>
          <div class="legend-row flex">
            <div class="legend-col w-1/3 px-2">
              <label
                class="block uppercase text-gray-600 text-xs font-bold mb-2"
              >
                Alta
              </label>
              <input
                type="text"
                name="legend-high"
                id="legend-high"
                class="px-3 py-3 bg-white rounded text-sm shadow w-full"
                v-model="textPage[index].texts.legend.high">
            </div>
            <div class="legend-col w-1/3 px-2">
              <label
                class="block uppercase text-gray-600 text-xs font-bold mb-2"
              >
                Media
              </label>
              <input
                type="text"
                name="legend-medium"
                id="legend-medium"
                class="px-3 py-3 bg-white rounded text-sm shadow w-full"
                v-model="textPage[index].texts.legend.medium">
            </div>
            <div class="legend-col w-1/3 px-2">
              <label
                class="block uppercase text-gray-600 text-xs font-bold mb-2"
              >
                Baja
              </label>
              <input
                type="text"
                name="legend-low"
                id="legend-low"
                class="px-3 py-3 bg-white rounded text-sm shadow w-full"
                v-model="textPage[index].texts.legend.low">
            </div>
          </div>
        </div>
        <div class="save-button my-4" v-if="activeTab.id === page.id">
          <button
            class="button-primary p-2 rounded"
            @click="saveTexts(textPage[index].id, textPage[index].texts)">
              Guardar
          </button>
        </div>
      </div>
      <div class="plans" v-if="activeTab.id === 'plans' && plans.length > 0">
        <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Planes</h3>
        <div class="plan-row flex p-4 rounded">
          <dynamic-table :columns="planColumnNames" :rows="plans" @icon-clicked="editPlan($event)" />
        </div>
      </div>
    </div>
    <modal :modal-status="modalStatus" @close-modal="changeModalStatus()">
      <div class="form-edit-plan grid grid-cols-2" v-if="planToEdit">
        <div class="group px-2">
          <label class="block" for="name">Nombre</label>
          <input type="text" class="block border border-gray-500 rounded p-2 my-2" name="name" v-model="planToEdit.name" />
        </div>
        <div class="group px-2">
          <label class="block" for="numberUsers">Numero de usuarios</label>
          <input type="text" class="block border border-gray-500 rounded p-2 my-2" name="numberUsers" v-model="planToEdit.numberUsers" />
        </div>
        <div class="group px-2">
          <label class="block" for="numberWebsites">Webs</label>
          <input type="text" class="block border border-gray-500 rounded p-2 my-2" name="numberWebsites" v-model="planToEdit.numberWebsites" />
        </div>
        <div class="group px-2">
          <label class="block" for="storage">Almacenamiento</label>
          <input type="text" class="block border border-gray-500 rounded p-2 my-2" name="storage" v-model="planToEdit.storage" />
        </div>
        <div class="group px-2">
          <label class="block" for="priceMonth">Precio mensual</label>
          <input type="text" class="block border border-gray-500 rounded p-2 my-2" name="priceMonth" v-model="planToEdit.priceMonth" />
        </div>
        <div class="group px-2">
          <label class="block" for="priceAnual">Precio anual</label>
          <input type="text" class="block border border-gray-500 rounded p-2 my-2" name="priceAnual" v-model="planToEdit.priceAnual" />
        </div>
        <button class="button-primary rounded p-2 m-2" @click="savePlan()">Guardar</button>
      </div>
    </modal>
  </div>
</template>

<script>
import axios from 'axios';
import Modal from '../../components/Modal/Modal.vue';
import DynamicTable from '../../components/Table/Table.vue';

export default {
  name: 'AdminTexts',
  components: {
    DynamicTable,
    Modal,
  },
  data() {
    return {
      textPage: null,
      modalStatus: false,
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
          id: 'experiment',
          text: 'Experimento',
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
        {
          id: 'plans',
          text: 'Planes',
          active: false,
        },
        {
          id: 'users',
          text: 'Usuarios',
          active: false,
        },
      ],
      activeTab: '',
      plans: [],
      originalPlans: [],
      planToEdit: {},
      planColumnNames: [
        {
          name: 'Nombre',
        },
        {
          name: 'Número de usuarios',
        },
        {
          name: 'Webs',
        },
        {
          name: 'Almacenamiento',
        },
        {
          name: 'Precio mensual',
        },
        {
          name: 'Precio anual',
        },
        {
          name: 'Editar',
          align: 'center',
        },
      ],
    };
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
    computedPlans() {
      return this.$store.state.plans;
    },
  },
  created() {
    this.$store.dispatch('setTitle', 'Administrador');
    this.getTexts();
    this.getPlans();
    [this.activeTab] = this.tabs;
  },
  methods: {
    getTexts() {
      axios
        .get(`${process.env.VUE_APP_API}/texts`)
        .then((response) => {
          const { data } = response;
          this.textPage = data.map((res) => ({
            texts: JSON.parse(res.texts),
            id: res.id,
          }));
        });
    },
    getPlans() {
      axios
        .get(`${process.env.VUE_APP_API}/plans`)
        .then((response) => {
          const { data } = response;
          this.originalPlans = data;
          this.plans = data.map((key) => ({
            values: [
              {
                value: key.name,
              },
              {
                value: key.numberUsers,
              },
              {
                value: key.numberWebsites,
              },
              {
                value: key.storage,
              },
              {
                value: key.priceMonth,
              },
              {
                value: key.priceAnual,
              },
              {
                value: '',
                icon: 'fa-edit',
                align: 'center',
                event: true,
              },
            ],
          }));
        })
        .catch((error) => {
          console.log(error);
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
    saveTexts(id, dataToUpdate) {
      const result = {
        texts: JSON.stringify(dataToUpdate),
      };
      axios
        .patch(`${process.env.VUE_APP_API}/texts/${id}`, result)
        .then(() => {
          this.$swal.fire(
            '¡Actualizado!',
            'Ha actualizado los textos con éxito',
            'success',
          );
        });
    },
    editPlan(row) {
      this.planToEdit = this.originalPlans.find((res) => res.name === row[0].value);
      this.modalStatus = true;
    },
    savePlan() {
      axios
        .patch(`${process.env.VUE_APP_API}/plans/${this.planToEdit.id}`, this.planToEdit)
        .then(() => {
          this.$swal.fire(
            '¡Actualizado!',
            `Ha actualizado el plan ${this.planToEdit.name} con éxito`,
            'success',
          );
          this.modalStatus = false;
          this.getPlans();
        });
    },
    changeModalStatus() {
      this.modalStatus = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.admin-container {
  textarea {
    height: 200px;
    white-space: pre-line;
  }
  .tabs {
    .tab-item {
      border-bottom: 1px solid #cccccc;
      &.active {
        border-bottom: none;
        border-top: 1px solid #cccccc;
        border-right: 1px solid #cccccc;
        border-left: 1px solid #cccccc;
        border-radius: 20px 20px 0 0;
        background-color: transparent;
      }
    }
  }
  .content-container {
    .content-item {
      .results {
        .result-item {
          background-color: #cccccc;
        }
      }
    }
  }
  .legend, .description, .routes, .plan-row {
    background-color: #cccccc;
  }
}
</style>
