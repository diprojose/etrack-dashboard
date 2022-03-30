<template>
  <div class="flex flex-wrap bg-white shadow-lg rounded">
    <div class="w-full lg:w-full p-4">
      <h6 class="text-sm mt-3 mb-6 font-bold uppercase">
        Páginas web registradas
        <button
          class="button-primary active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 ml-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1"
          type="button"
          @click="changeModalStatus()"
        >
          Agregar página web
        </button>
      </h6>
      <div class="flex flex-wrap" v-if="websites && websites.length > 0">
        <div class="w-full lg:w-full px-4" v-for="(website, index) in websites" :key="index">
          <div class="relative w-full mb-3">
            <label
              class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Página web #{{ index + 1 }}
            </label>
            <input
              type="text"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-1/2"
              :value="website.name"
              disabled
            />
            <button @click="desactivateWebsite(website.id)" class="button-primary p-3 rounded">
              -
            </button>
          </div>
        </div>
      </div>
      <hr class="mt-6 border-b-1 border-blueGray-300" />
      <h6 v-if="script !== ''" class="text-sm mt-3 mb-6 font-bold uppercase">Código</h6>
      <div v-if="script !== ''" class="code-container w-full mt-4 px-4">
        <p class="pb-4">Este codigo debes copiarlo y colocarlo dentro de la etiqueta <code>{{ headLabel }}</code> en el código de tu página web.</p>
        <p class="pb-4">Si necesitas ayuda recuerda que puedes solicitarla a nuestro equipo
          técnico en este <a class="text-blue-500" target="_blank" href="https://e-trackanalytics.com/contacto/">link</a>
          o a nuestro <a class="text-blue-500" target="_blank" href="https://wa.me/573194033852?text=Hola%20necesito%20ayuda%20sobre%20la%20web%20E-track">Whatsapp</a>
        </p>
        <div class="code p-4 mb-4 rounded">
          <code>
            {{ script }}
          </code>
        </div>
        <button class="p-4 border button-secondary rounded" @click="copy()">
          Copiar
        </button>
      </div>
    </div>
    <modal :modal-status="modalStatus" @close-modal="changeModalStatus()">
      <div class="register-container sm:w-full md:w-full 2xl:w-full bg-white rounded-md p-6">
        <p class="mb-4">Agregar una nueva url</p>
        <input
          v-model="websiteModel"
          type="url"
          name="url"
          id="url"
          class="box-border border block w-full p-4 mb-4"
          placeholder="Escribe aquí una url valida"
        />
        <button class="p-4 border w-full button-primary" @click="saveWebsites()">Guardar</button>
      </div>
    </modal>
  </div>
</template>
<script>
import axios from 'axios';
import Modal from '../../components/Modal/Modal.vue';

export default {
  name: 'ProfileWebsites',
  components: {
    Modal,
  },
  data() {
    return {
      websites: [],
      websiteModel: '',
      modalStatus: false,
      script: '',
      headLabel: '<head></head>',
    };
  },
  created() {
    this.$store.dispatch('getUser');
  },
  mounted() {
    this.getPlans(this.computedUser.plan);
    this.getWebsites();
    this.script = `<script id="etrack" type="text/javascript" src="https://e-trackanalytics.com/tracker/etrack.js" etrack="${this.computedUser.id}" />`;
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
    computedPlans() {
      return this.$store.state.plans;
    },
  },
  methods: {
    getPlans(planName) {
      this.$store.dispatch('getPlans', planName);
    },
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
    async copy() {
      try {
        await navigator.clipboard.writeText(this.script);
        this.$swal.fire(
          'Copiado!',
          'El codigo ha sido copiado con exito.',
          'success',
        );
      } catch (error) {
        console.log('error', error);
      }
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
  },
};
</script>

<style lang="scss" scoped>
.code-container {
  .code {
    background-color: #14329B;
    code {
      color: #96FFFF;
    }
  }
}
</style>
