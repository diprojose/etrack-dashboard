<template>
  <nav
    class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto
    md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex
    flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6"
  >
    <div
      class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0
      flex flex-wrap items-center justify-between w-full mx-auto"
    >
      <!-- Toggler -->
      <button
        class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl
        leading-none bg-transparent rounded border border-solid border-transparent"
        type="button"
        v-on:click="toggleCollapseShow('bg-white m-2 py-3 px-6')"
      >
        <i class="fas fa-bars"></i>
      </button>
      <!-- Brand -->
      <router-link
        class="md:block text-left md:pb-2 text-gray-600 mr-0
        inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
        to="/"
      >
        <img class="logo" src="../../assets/etrack-logo.png" alt="">
      </router-link>
      <!-- User -->
      <ul class="md:hidden items-center flex flex-wrap list-none">
        <li class="inline-block relative">
          <notification-dropdown />
        </li>
        <li class="inline-block relative">
          <user-dropdown />
        </li>
      </ul>
      <!-- Collapse -->
      <div
        class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative
        md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto
        overflow-x-hidden h-auto items-center flex-1 rounded"
        v-bind:class="collapseShow"
      >
        <!-- Collapse header -->
        <div
          class="md:min-w-full md:hidden block pb-4 mb-4"
        >
          <div class="flex flex-wrap">
            <div class="w-6/12">
              <router-link
                class="md:block text-left md:pb-2 text-gray-600 mr-0
                inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                to="/"
              >
                Menu
              </router-link>
            </div>
            <div class="w-6/12 flex justify-end">
              <button
                type="button"
                class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1
                text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                v-on:click="toggleCollapseShow('hidden')"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <hr class="my-4 md:min-w-full" />
        <!-- Heading -->

        <ul class="md:flex-col md:min-w-full flex flex-col list-none">
          <li class="items-center">
            <router-link
              to="/admin/dashboard"
              v-slot="{ href, navigate, isActive }"
            >
              <a
                :href="href"
                @click="navigate"
                class="text-xs uppercase py-3 font-bold block"
                :class="[
                  isActive
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-gray-700 hover:text-gray-500',
                ]"
              >
                <i
                  class="fas fa-tv mr-2 text-sm"
                  :class="[isActive ? 'opacity-75' : 'text-gray-300']"
                ></i>
                Dashboard
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link
              to="/admin/analytics"
              v-slot="{ href, navigate, isActive }"
            >
              <a
                :href="href"
                @click="navigate"
                class="text-xs uppercase py-3 font-bold block"
                :class="[
                  isActive
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-gray-700 hover:text-gray-500',
                ]"
              >
                <i
                  class="fas fa-chart-bar mr-2 text-sm"
                  :class="[isActive ? 'opacity-75' : 'text-gray-300']"
                ></i>
                Analytics
              </a>
            </router-link>
          </li>

          <li class="items-center">
            <router-link to="/admin/experimento" v-slot="{ href, navigate, isActive }">
              <a
                :href="href"
                @click="navigate"
                class="text-xs uppercase py-3 font-bold block"
                :class="[
                  isActive
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-gray-700 hover:text-gray-500',
                ]"
              >
                <i
                  class="fas fa-flask mr-2 text-sm"
                  :class="[isActive ? 'opacity-75' : 'text-gray-300']"
                ></i>
                Experimento
              </a>
            </router-link>
          </li>
        </ul>

        <!-- Divider -->
        <hr class="my-4 md:min-w-full" />
        <!-- Heading -->
        <h6
          class="md:min-w-full text-gray-500 text-xs
          uppercase font-bold block pt-1 pb-4 no-underline"
        >
          Psychological Analytics
        </h6>
        <!-- Navigation -->
        <ul class="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
          <li class="items-center">
            <router-link
              to="/admin/atencion"
              v-slot="{ href, navigate, isActive }"
            >
              <a
                :href="href"
                @click="navigate"
                class="text-xs uppercase py-3 font-bold block"
                :class="[
                  isActive
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-gray-700 hover:text-gray-500',
                ]"
              >
                <i
                  class="fas fa-paper-plane mr-2 text-sm"
                  :class="[isActive ? 'opacity-75' : 'text-gray-300']"
                ></i>
                Atención
              </a>
            </router-link>
          </li>
          <!-- <li class="items-center">
            <router-link
              to="/admin/exploracion"
              v-slot="{ href, navigate, isActive }"
            >
              <a
                :href="href"
                @click="navigate"
                class="text-xs uppercase py-3 font-bold block"
                :class="[
                  isActive
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-gray-700 hover:text-gray-500',
                ]"
              >
                <i
                  class="fas fa-search mr-2 text-sm"
                  :class="[isActive ? 'opacity-75' : 'text-gray-300']"
                ></i>
                Exploración
              </a>
            </router-link>
          </li> -->
          <li class="items-center">
            <router-link
              to="/admin/emocion"
              v-slot="{ href, navigate, isActive }"
            >
              <a
                :href="href"
                @click="navigate"
                class="text-xs uppercase py-3 font-bold block"
                :class="[
                  isActive
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-gray-700 hover:text-gray-500',
                ]"
              >
                <i
                  class="fas fa-smile mr-2 text-sm"
                  :class="[isActive ? 'opacity-75' : 'text-gray-300']"
                ></i>
                Emoción
              </a>
            </router-link>
          </li>
          <li class="items-center">
            <router-link
              to="/admin/motivacion"
              v-slot="{ href, navigate, isActive }"
            >
              <a
                :href="href"
                @click="navigate"
                class="text-xs uppercase py-3 font-bold block"
                :class="[
                  isActive
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-gray-700 hover:text-gray-500',
                ]"
              >
                <i
                  class="fas fa-brain mr-2 text-sm"
                  :class="[isActive ? 'opacity-75' : 'text-gray-300']"
                ></i>
                Motivación
              </a>
            </router-link>
          </li>
          <li class="items-center">
            <router-link
              to="/admin/aprendizaje"
              v-slot="{ href, navigate, isActive }"
            >
              <a
                :href="href"
                @click="navigate"
                class="text-xs uppercase py-3 font-bold block"
                :class="[
                  isActive
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-gray-700 hover:text-gray-500',
                ]"
              >
                <i
                  class="fas fa-book mr-2 text-sm"
                  :class="[isActive ? 'opacity-75' : 'text-gray-300']"
                ></i>
                Aprendizaje
              </a>
            </router-link>
          </li>
        </ul>

      </div>
    </div>
  </nav>
</template>
); }

<script>
import NotificationDropdown from '@/components/Dropdowns/NotificationDropdown.vue';
import UserDropdown from '@/components/Dropdowns/UserDropdown.vue';

export default {
  data() {
    return {
      collapseShow: 'hidden',
    };
  },
  methods: {
    toggleCollapseShow(classes) {
      this.collapseShow = classes;
    },
  },
  components: {
    NotificationDropdown,
    UserDropdown,
  },
};
</script>

<style lang="scss">
@import "../../styles/index.scss";
.logo {
  @include responsive(xs) {
    width: 50px;
  }
}
</style>
