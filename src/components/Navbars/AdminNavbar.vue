<template>
  <!-- Navbar -->
  <nav
    class="w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4"
  >
    <div
      class="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4"
    >
      <!-- Brand -->
      <a
        class="text-sm uppercase hidden lg:inline-block font-semibold"
        href="javascript:void(0)"
      >
        {{ computedTitle }}
      </a>
      <!-- User -->
      <ul class="flex-col md:flex-row list-none items-center hidden md:flex">
        <user-dropdown />
      </ul>
    </div>
  </nav>
  <!-- End Navbar -->
</template>

<script>
import UserDropdown from '@/components/Dropdowns/UserDropdown.vue';

export default {
  components: {
    UserDropdown,
  },
  computed: {
    computedTitle() {
      return this.$store.state.title;
    },
  },
};
</script>
