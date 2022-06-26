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
        <div class="video rounded-md p-4 mb-4" v-if="page.texts.video && activeTab.id === page.id">
          <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Descripción</h3>
          <div class="description-container px-2">
            <input
              type="text"
              name="legend-high"
              id="legend-high"
              class="px-3 py-3 bg-white rounded text-sm shadow w-full"
              v-model="textPage[index].texts.video" />
          </div>
        </div>
        <div class="description pdf rounded-md p-4 mb-4" v-if="page.texts.pdf && activeTab.id === page.id">
          <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Archivo PDF</h3>
          <div class="pdf-container px-2">
            <input
              type="text"
              name="pdf"
              id="pdf"
              class="px-3 py-3 bg-white rounded text-sm shadow w-full"
              v-model="textPage[index].texts.pdf" />
          </div>
        </div>
        <div class="description rounded-md p-4 mb-4" v-if="page.texts.images && activeTab.id === page.id">
          <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">
            Imagenes
            <button class="images-control-buttons rounded button-primary px-1 ml-2" @click="addImage(index)">+</button>
            <button class="images-control-buttons rounded button-primary px-1 ml-2" @click="removeImages(index)">-</button>
          </h3>
          <div class="description-container px-2" v-for="(images, indexImg) in page.texts.images" :key="'image' + indexImg">
            <input
              type="text"
              name="legend-high"
              id="legend-high"
              class="px-3 py-3 bg-white rounded text-sm shadow w-full mb-2"
              placeholder="Escribe aqui la ruta de la imagen"
              v-model="textPage[index].texts.images[indexImg].url" />
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
        <div class="legend rounded-md p-4 mb-4" v-if="page.texts.legend && activeTab.id === page.id">
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
      <div class="tooltips rounded p-4" v-if="activeTooltips && activeTooltips.length > 0">
        <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Tooltips</h3>
        <div class="description-container px-2" v-for="(tooltip, tooltipIndex) in activeTooltips" :key="'tooltip' + tooltipIndex">
          <label>{{ tooltip.label }}</label>
          <input
            type="text"
            :name="tooltip.name"
            :id="tooltip.name"
            v-model="activeTooltips[tooltipIndex].text"
            class="px-3 py-3 bg-white rounded text-sm shadow w-full my-2" />
          <button class="button-primary p-2 rounded mb-4" @click="updateTooltip(tooltip.id, activeTooltips[tooltipIndex].text)">Guardar</button>
        </div>
      </div>
      <div class="plans" v-if="activeTab.id === 'plans' && plans.length > 0">
        <h3 class="block uppercase text-gray-600 text-sm font-bold py-4">Planes</h3>
        <div class="plan-row flex p-4 rounded">
          <dynamic-table :columns="planColumnNames" :rows="plans" @icon-clicked="editPlan($event)" />
        </div>
      </div>
      <div class="users" v-if="activeTab.id === 'users'">
        <table class="user-table">
          <tr class="border-b-4">
            <th class="text-left p-2">Nombre</th>
            <th class="text-left p-2">Corro</th>
            <th class="text-left p-2">Plan</th>
            <th class="text-left p-2">Rol</th>
            <th class="text-left p-2"></th>
          </tr>
          <tr
            class="row"
            :class="{ 'styled-row': userIndex % 2 == 0  }"
            v-for="(user, userIndex) in users"
            :key="'user' + userIndex">
            <td class="col p-2">
              {{ user.name }} {{ user.lastname }}
            </td>
            <td class="col p-2">
              {{ user.email }}
            </td>
            <td class="col p-2">
              {{ user.plan }}
            </td>
            <td class="col p-2">
              {{ user.role }}
            </td>
            <td class="col p-2">
              <button class="button-primary rounded p-2" @click="changeRole(user.id, user.role)">Cambiar rol</button>
            </td>
          </tr>
        </table>
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
          <div class="flex items-center">
            <input type="number" class="block border border-gray-500 rounded p-2 my-2 w-1/4" name="storage" v-model="planToEdit.storage" />
            <select class="border border-gray-500 h-full p-2" name="storageSelect" id="storageSelect" v-model="amountOfTime">
              <option value="week">Semana(s)</option>
              <option value="month">Mes(es)</option>
              <option value="year">Año(s)</option>
            </select>
          </div>
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
          id: 'analytics',
          text: 'Analytics',
          active: false,
        },
        {
          id: 'profile',
          text: 'Perfil',
          active: false,
        },
        {
          id: 'profileWebsites',
          text: 'Registro de web',
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
      tooltips: [],
      originalPlans: [],
      planToEdit: {},
      amountOfTime: 'week',
      users: [],
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
      activeTooltips: [],
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
    [this.activeTab] = this.tabs;
    this.$store.dispatch('setTitle', 'Administrador');
    this.getTexts();
    this.getUsers();
    this.getPlans();
    this.getTooltips();
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
    getUsers() {
      axios
        .get(`${process.env.VUE_APP_API}/users`)
        .then((response) => {
          const { data } = response;
          this.users = data;
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
    getTooltips() {
      axios
        .get(`${process.env.VUE_APP_API}/tooltips`)
        .then((response) => {
          const { data } = response;
          this.tooltips = data;
          this.activeTooltips = this.tooltips.filter((res) => res.page === this.activeTab.id);
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
      this.activeTooltips = this.tooltips.filter((res) => res.page === this.activeTab.id);
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
      const storateNumber = `${this.planToEdit.storage} ${this.amountOfTime}`;
      this.planToEdit.storage = storateNumber;
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
    addImage(pageIndex) {
      this.textPage[pageIndex].texts.images.push({
        url: '',
      });
      console.log(this.textPage[pageIndex].texts.images);
    },
    removeImages(pageIndex) {
      if (this.textPage[pageIndex].texts.images.length > 1) {
        this.textPage[pageIndex].texts.images.pop();
      }
    },
    changeRole(id, role) {
      const change = role === 'admin' ? 'customer' : 'admin';
      const postData = {
        role: change,
      };
      axios
        .patch(`${process.env.VUE_APP_API}/users/role/${id}`, postData)
        .then(() => {
          this.$swal.fire(
            '¡Actualizado!',
            `Ha actualizado el rol del usuario a ${change}`,
            'success',
          );
          this.getUsers();
        });
    },
    updateTooltip(id, text) {
      axios
        .patch(`${process.env.VUE_APP_API}/tooltips/${id}`, { text })
        .then(() => {
          this.$swal.fire(
            '¡Actualizado!',
            'Ha actualizado el texto del tooltip',
            'success',
          );
          this.getTooltips();
        });
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
  .styled-row {
    background-color: #cccccc;
  }
  .legend, .description, .routes, .plan-row, .tooltips, .video {
    background-color: #cccccc;
    .images-control-buttons {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
