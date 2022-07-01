<template>
  <div id="register" class="flex items-center justify-center 2xl:h-screen xl:h-full">
    <div class="register-container sm:w-full md:w-1/2 2xl:w-1/4 bg-white rounded-md p-6 shadow-md my-4">
      <div class="grid grid-cols-1 justify-items-center">
        <img src="../assets/etrack-logo.png" class="w-1/2" alt="">
      </div>
      <h1 class="title text-2xl pt-4 pb-4 font-bold second-color text-center">¡Bienvenido!</h1>
      <p class="pb-4 text-base">Coloca tus datos para empezar</p>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Nombre(s)"
        v-model="name"
        class="box-border border block w-full p-4 mb-4">
      <input
        type="text"
        name="lastname"
        id="lastname"
        placeholder="Apellido(s)"
        v-model="lastname"
        class="box-border border block w-full p-4 mb-4">
      <input
        type="number"
        name="phone"
        id="phone"
        placeholder="Teléfono"
        v-model="phone"
        class="box-border border block w-full p-4 mb-4">
      <input
        type="text"
        name="company"
        id="company"
        placeholder="Nombre de compañia"
        v-model="company"
        class="box-border border block w-full p-4 mb-4">
      <input
        type="text"
        name="mail"
        id="mail"
        placeholder="Correo"
        v-model="email"
        class="box-border border block w-full p-4 mb-4">
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Contraseña"
        v-model="password"
        class="box-border border block w-full p-4 mb-4">
      <div class="mb-4">
        <label for="politics">
          <input type="checkbox" name="politics" id="politics" v-model="politics">
          Acepta nuestras <a href="https://e-trackanalytics.com/politica-privacidad/" class="text-blue-600" target="_blank" rel="noopener noreferrer">políticas de privacidad</a>
        </label>
      </div>
      <button class="p-4 border w-full button-primary" @click="register()">
        Registrar
      </button>
      <router-link
        to="/login"
        v-slot="{ href, navigate, isActive }"
      >
        <a
          :href="href"
          @click="navigate"
          class="text-xs uppercase py-3 font-bold block text-center"
          :class="[
            isActive
              ? 'text-blue-500 hover:text-blue-600'
              : 'text-blue-700 hover:text-blue-500',
          ]"
        >
          ¿Tienes cuenta? Inicia sesión
        </a>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      lastname: '',
      phone: '',
      company: '',
      email: '',
      password: '',
      politics: false,
    };
  },
  created() {
    const local = !!localStorage.getItem('etrackUser');
    const session = !!sessionStorage.getItem('etrackUser');
    if (local || session) {
      this.$router.push('/admin/dashboard');
    }
  },
  methods: {
    async register() {
      if (this.politics) {
        this.$swal.fire({
          icon: 'info',
          text: 'Espere por favor...',
        });
        this.$swal.showLoading();
        await axios.post(`${process.env.VUE_APP_API}/users`, {
          name: this.name,
          lastname: this.lastname,
          phone: this.phone,
          company_name: this.company,
          email: this.email,
          password: this.password,
        })
          .then((response) => {
            this.$swal.close();
            this.$swal.fire(
              '¡Bienvenido a E-track!',
              'El registro ha sido exitoso.',
              'success',
            );
            const user = {
              data: response.data,
              remember: false,
            };
            this.$store.dispatch('setClientInfo', user);
            this.$router.push('/register-website');
          })
          .catch(() => {
            this.$swal.close();
            this.$swal.fire(
              'Error!',
              'Ha ocurrido un error, vuelve a intentar, si sigue ocurriendo comunicate con nuestro centro de servicio',
              'error',
            );
          });
      } else {
        this.$swal.fire(
          'Error!',
          'Debes aceptar nuestras politicas de privacidad',
          'error',
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#register {
  // background-image: url(../assets/login-back.jpeg);
  background: rgb(150,255,255);
  background: linear-gradient(45deg,
    rgba(150,255,255,1) 0%,
    rgba(40,100,255,1) 50%,
    rgba(20,50,155,1) 100%);
  background-size: cover;
  padding: 1rem;
  .register-container {
    .title {
      font-family: "Montserrat Bold";
    }
  }
}
</style>
