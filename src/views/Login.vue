<template>
  <div id="login" class="flex items-center justify-center 2xl:h-screen xl:h-full p-4">
    <div class="login-container sm:w-full md:w-1/2 2xl:w-1/4 bg-white rounded-md p-6 shadow-md my-4">
      <div class="grid grid-cols-1 justify-items-center">
        <img src="../assets/etrack-logo.png" class="w-1/2" alt="">
      </div>
      <h1 class="title text-2xl pt-4 pb-4 font-bold second-color text-center">¡Bienvenido!</h1>
      <p class="pb-4 text-base">Coloca tus datos para empezar</p>
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
        @keyup.enter="login()"
        class="box-border border block w-full p-4 mb-4">
      <div class="remember-forget flex justify-between pb-4">
        <div class="remember">
          <input type="checkbox" name="remember" id="remember" v-model="rememberUser"> Recordar
        </div>
        <div class="forget">
          <router-link
            to="/olvido-contrasena"
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
              ¿Olvidaste tu contraseña?
            </a>
          </router-link>
        </div>
      </div>
      <button class="p-4 border w-full button-primary" @click="login()">
        Iniciar sesión
      </button>
      <router-link
        to="/register"
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
          ¿No tienes cuenta? Regístrate
        </a>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      rememberUser: false,
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
    login() {
      const client = {
        email: this.email,
        password: this.password,
      };
      this.$swal.fire({
        icon: 'info',
        text: 'Espere por favor...',
      });
      this.$swal.showLoading();
      axios.get(`${process.env.VUE_APP_API}/users/login`, { params: client })
        .then((response) => {
          const user = {
            data: response.data,
            remember: this.rememberUser,
          };
          this.$swal.close();
          this.$swal.fire(
            `¡Bienvenido ${user.data.name}!`,
            'Ha iniciado sesión con éxito',
            'success',
          );
          this.$store.dispatch('setClientInfo', user);
          this.$router.push('/admin/dashboard');
        })
        .catch((error) => {
          const err = error.response.data;
          this.$swal.close();
          this.$swal.fire(
            'Error!',
            err.message,
            'error',
          );
        })
        .then(() => {
          // always executed
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#login {
  // background-image: url(../assets/login-back.jpeg);
  background: rgb(150,255,255);
  background: linear-gradient(45deg,
    rgba(150,255,255,1) 0%,
    rgba(40,100,255,1) 50%,
    rgba(20,50,155,1) 100%);
  background-size: cover;
  .title {
    font-family: "Montserrat Bold";
  }
}
</style>
