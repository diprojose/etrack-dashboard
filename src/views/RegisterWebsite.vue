<template>
  <div id="register-website" class="flex items-center justify-center">
    <div v-if="stage === 'url'" class="register-container sm:w-full md:w-1/2 2xl:w-1/4 bg-white rounded-md p-6 shadow-md">
      <p class="mb-4 justify-between flex">Agregar una nueva url
        <span>
          <i
            v-if="websites.length !== numberWebsites"
            @click="addNewWebsite()"
            class="fas fa-plus mr-2 text-lg button-primary p-1 rounded-xl cursor-pointer"></i>
          <i
            v-if="websites.length > 1"
            @click="removeNewWebsite()"
            class="fas fa-minus mr-2 text-lg button-primary p-1 rounded-xl cursor-pointer"></i>
        </span>
      </p>
      <input
        v-for="(website, index) in websites"
        :key="index"
        v-model="website.value"
        type="url"
        name="url"
        id="url"
        class="box-border border block w-full p-4 mb-4"
        placeholder="Escribe aquí una url valida"
      />
      <button class="p-4 border w-full button-primary" @click="saveWebsites()">
        Siguiente
      </button>
    </div>
    <div v-if="stage === 'code'" class="code-container sm:w-full md:w-1/2 2xl:w-1/4 bg-white rounded-md p-6 shadow-md">
      <div class="py-4">
        <p v-if="textPage" class="mb-4">
          {{ textPage.description }}
        </p>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/TPoi6iGeweQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="code p-4 mb-4">
        <p class="mt-4">
          {{ script }}
        </p>
      </div>
      <button class="p-4 border w-1/2 button-secondary" @click="copy()">
        Copiar
      </button>
      <button class="p-4 border w-1/2 button-primary" @click="goToDashboard()">
        Siguiente
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterWebsite',
  data() {
    return {
      script: '',
      stage: 'url',
      numberWebsites: 1,
      userRegisteredWebsites: 0,
      plan: {},
      textPage: null,
      websites: [
        {
          value: '',
        },
      ],
    };
  },
  computed: {
    computedUser() {
      return this.$store.state.userInfo;
    },
  },
  created() {
    this.$store.dispatch('getUser');
  },
  mounted() {
    this.getPlans();
    this.getWebsites();
    this.getTexts();
  },
  methods: {
    getPlans() {
      axios
        .get(`${process.env.VUE_APP_API}/plans/${this.computedUser.plan}`)
        .then((response) => {
          const { data } = response;
          this.plan = data;
          this.numberWebsites = data.numberWebsites;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
    },
    getTexts() {
      axios
        .get(`${process.env.VUE_APP_API}/texts/profileWebsites`)
        .then((response) => {
          const { data } = response;
          this.textPage = JSON.parse(data[0].texts);
        });
    },
    getWebsites() {
      const url = `${process.env.VUE_APP_API}/websites/user/${this.computedUser.id}`;
      axios
        .get(url)
        .then((response) => {
          const { data } = response;
          this.userRegisteredWebsites = data.length;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
    },
    saveWebsites() {
      const self = this;
      const isNotEmpty = this.websites.filter((res) => res.value !== '');
      if (isNotEmpty.length > 0) {
        const websitesData = isNotEmpty.map((res) => ({ name: res.value, user_id: this.computedUser.id }));
        axios.post(`${process.env.VUE_APP_API}/websites`, websitesData)
          .then(() => {
            this.script = `<script id="etrack" type="text/javascript" src="https://e-trackanalytics.com/tracker/etrack.js" etrack="${self.computedUser.id}" />`;
            this.stage = 'code';
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
        this.$swal.fire(
          'Error!',
          'Los campos no deben permanecer vacios',
          'error',
        );
      }
    },
    addNewWebsite() {
      if (this.websites.length < this.numberWebsites) {
        const newWebsite = {
          value: '',
        };
        this.websites.push(newWebsite);
      }
    },
    removeNewWebsite() {
      if (this.websites.length > 1) {
        this.websites.pop();
      }
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
    goToDashboard() {
      this.$router.push('/admin/dashboard');
    },
  },
};
</script>

<style lang="scss" scoped>
#register-website {
  // background-image: url(../assets/login-back.jpeg);
  background: rgb(150,255,255);
  background: linear-gradient(45deg,
    rgba(150,255,255,1) 0%,
    rgba(40,100,255,1) 50%,
    rgba(20,50,155,1) 100%);
  background-size: cover;
  padding: 1rem;
  height: 100vh;
  .code-container {
    iframe {
      width: 100%;
    }
    .code {
      background-color: #E0D8D6;
    }
  }
}
</style>
