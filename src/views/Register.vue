<template>
  <div id="register" class="flex items-center justify-center">
    <div class="register-container sm:w-full md:w-1/2 2xl:w-1/4 bg-white rounded-md p-6 shadow-md">
      <div class="grid grid-cols-1 justify-items-center">
        <img src="../assets/etrack-logo.png" class="w-1/2" alt="">
      </div>
      <h1 class="title text-2xl pt-4 pb-4 font-bold second-color text-center">¡Bienvenido!</h1>
      <p class="pb-4 text-base">Por favor coloca tus datos para empezar</p>
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
      <button class="p-4 border w-full button-primary" @click="register()">
        Enviar
      </button>
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
    register() {
      axios.post(`${process.env.VUE_APP_API}/users`, {
        name: this.name,
        lastname: this.lastname,
        phone: this.phone,
        company_name: this.company,
        email: this.email,
        password: this.password,
      })
        .then((response) => {
          this.$swal.fire(
            '¡Bienvenido!',
            'El registro ha sido exitoso, revisa tu correo para confirmar.',
            'success',
          );
          const user = {
            data: response.data,
            remember: false,
          };
          this.$store.dispatch('setClientInfo', user);
          this.$router.push('/register-website');
        })
        .catch((error) => {
          console.log(error);
          this.$swal.fire(
            'Error!',
            'Ha ocurrido un error, vuelve a intentar, si sigue ocurriendo comunicate con nuestro centro de servicio',
            'error',
          );
        });
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
  height: 100vh;
  .register-container {
    margin: 40px 0;
    .title {
      font-family: "Montserrat Bold";
    }
  }
}
</style>
