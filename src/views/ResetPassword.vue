<template>
  <div id="login" class="flex items-center justify-center h-screen p-4">
    <div class="login-container sm:w-full md:w-1/2 2xl:w-1/4 bg-white rounded-md p-6 shadow-md">
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Escribe tu nueva contraseña"
        v-model="password"
        class="box-border border block w-full p-4 mb-4">
      <input
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirma tu contraseña"
        v-model="confirmPassword"
        @keyup.enter="resetPassword()"
        class="box-border border block w-full p-4 mb-4">
      <button :class="{ disabled: password !== confirmPassword }" :disabled="password !== confirmPassword" class="p-4 border w-full button-primary" @click="resetPassword()">
        Reestablecer
      </button>
      <p class="pt-4 text-red-500 text-center" v-if="password !== confirmPassword">La contraseña debe coincidir en ambos campos</p>
      <p class="pt-4 text-green-500 text-center" v-if="resetSuccess">La contraseña fue reestablecida exitosamente</p>
      <router-link
        to="/login"
        v-slot="{ href, navigate, isActive }"
        v-if="resetSuccess"
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
          Volver al login
        </a>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ResetPassword',
  data() {
    return {
      id: '',
      password: '',
      confirmPassword: '',
      rememberUser: false,
      resetSuccess: false,
    };
  },
  created() {
    this.id = this.$route.query.id;
  },
  methods: {
    resetPassword() {
      axios
        .patch(`${process.env.VUE_APP_API}/users/reset/${this.id}`, { password: this.password })
        .then(() => {
          this.resetSuccess = true;
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
.disabled {
  cursor: not-allowed;
}
</style>
