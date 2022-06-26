<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
  >
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-xl font-bold">Mi cuenta</h6>
        <div class="buttons-container">
          <button
            class="bg-green-600 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1"
            type="button"
            @click="readMode = !readMode"
          >
            Editar
          </button>
          <button
            class="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1"
            type="button"
            @click="updateClient()"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0 bg-white" v-if="computedUser">
      <h6 class="text-sm mt-3 mb-6 font-bold uppercase">Información del usuario</h6>
      <div class="flex flex-wrap">
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Nombre
            </label>
            <input
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              v-model="name"
              :disabled="readMode"
            />
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Apellido
            </label>
            <input
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              v-model="lastname"
              :disabled="readMode"
            />
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Teléfono
            </label>
            <input
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              v-model="phone"
              :disabled="readMode"
            />
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Compañia
            </label>
            <input
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              v-model="companyName"
              :disabled="readMode"
            />
          </div>
        </div>
        <div class="w-full lg:w-full px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Correo
            </label>
            <input
              type="email"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              :value="computedUser.email"
              disabled
            />
          </div>
        </div>
      </div>

      <hr class="mt-6 border-b-1 border-blueGray-300" />

      <h6 class="text-sm mt-3 mb-6 font-bold uppercase">Información de su plan</h6>
      <div class="mb-6 mx-4">
        <p class="button-primary p-2">Te quedan {{ daysLeft }} días de tu plan</p>
      </div>
      <div class="flex flex-wrap" v-if="computedPlans">
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center"
              htmlFor="grid-password"
            >
              Tipo de plan
              <tooltip
                v-if="tooltips && tooltips.planType"
                :tooltip-text="tooltips.planType"
                class="mx-4" />
            </label>
            <input
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              :value="computedPlans.name"
              disabled
            />
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center"
              htmlFor="grid-password"
            >
              Numero de páginas web
              <tooltip
                v-if="tooltips && tooltips.webNumber"
                :tooltip-text="tooltips.webNumber"
                class="mx-4" />
            </label>
            <input
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              :value="computedPlans.numberWebsites"
              disabled
            />
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center"
              htmlFor="grid-password"
            >
              Numero de usuarios
              <tooltip
                v-if="tooltips && tooltips.userNumber"
                :tooltip-text="tooltips.userNumber"
                class="mx-4" />
            </label>
            <input
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              :value="computedPlans.numberUsers"
              disabled
            />
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2 flex items-center"
              htmlFor="grid-password"
            >
              Almacenamiento
              <tooltip
                v-if="tooltips && tooltips.storage"
                :tooltip-text="tooltips.storage"
                class="mx-4" />
            </label>
            <input
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              :value="computedPlans.storage"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { differenceInDays } from 'date-fns';
import Tooltip from '../Tooltip/Tooltip.vue';

export default {
  name: 'CardSettings',
  components: {
    Tooltip,
  },
  data() {
    return {
      readMode: true,
      name: '',
      lastname: '',
      phone: '',
      companyName: '',
      websites: [],
      websiteModel: '',
      modalStatus: false,
      daysLeft: 0,
      tooltips: {},
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
  watch: {
    computedUser(newValue) {
      console.log('ComputedUser', newValue);
    },
    computedPlans(newValue) {
      const finalDayPlan = new Date(newValue.updated_at);
      finalDayPlan.setFullYear(finalDayPlan.getFullYear() + 1);
      this.daysLeft = differenceInDays(finalDayPlan, new Date());
    },
  },
  mounted() {
    this.name = this.computedUser.name;
    this.lastname = this.computedUser.lastname;
    this.phone = this.computedUser.phone;
    this.companyName = this.computedUser.company_name;
    this.getPlans(this.computedUser.plan);
    this.getWebsites();
    this.getTooltips();
  },
  methods: {
    getWebsites() {
      const url = `${process.env.VUE_APP_API}/websites/user/${this.computedUser.id}`;
      axios
        .get(url)
        .then((response) => {
          const { data } = response;
          const sortedList = data
            .slice()
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          this.websites = sortedList;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
    },
    getTooltips() {
      axios
        .get(`${process.env.VUE_APP_API}/tooltips/page/profile`)
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
    updateClient() {
      const user = {
        id: this.computedUser.id,
        data: {
          name: this.name,
          lastname: this.lastname,
          phone: this.phone,
          company_name: this.companyName,
        },
      };
      this.$store.dispatch('updateClient', user);
    },
    getPlans(planName) {
      this.$store.dispatch('getPlans', planName);
    },
    changeModalStatus() {
      this.modalStatus = !this.modalStatus;
    },
    saveWebsites() {
      const isNotEmpty = this.websiteModel;
      if (isNotEmpty.length > 0) {
        const websitesData = { name: this.websiteModel, user_id: this.computedUser.id };
        axios
          .post(`${process.env.VUE_APP_API}/websites`, websitesData)
          .then(() => {
            this.getWebsites();
            this.modalStatus = false;
          })
          .catch((error) => {
            this.$swal.fire(
              'Error!',
              'Ha ocurrido un error, vuelve a intentar, si sigue ocurriendo comunicate con nuestro centro de servicio',
              'error',
            );
            return error;
          });
      } else {
        this.$swal.fire('Error!', 'Los campos no deben permanecer vacios', 'error');
      }
    },
    desactivateWebsite(id) {
      console.log(id);
    },
  },
};
</script>

<style lang="scss" scoped>
input[type="text"]:disabled,
input[type="email"]:disabled {
  background: #cccccc !important;
}
</style>
