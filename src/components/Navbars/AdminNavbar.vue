<template>
  <!-- Navbar -->
  <nav
    class="w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4"
  >
    <div
      class="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4"
    >
      <!-- Brand -->
      <h4
        class="text-sm font-bold"
        :class="{ flex: computedTitleDescription }"
        href="javascript:void(0)"
      >
        {{ computedTitle }}
        <tooltip
          v-if="computedTitleDescription"
          :tooltip-text="computedTitleDescription"
          position="bottom"
          class="ml-4" />
      </h4>
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
import Tooltip from '../Tooltip/Tooltip.vue';

export default {
  components: {
    UserDropdown,
    Tooltip,
  },
  computed: {
    computedTitle() {
      return this.$store.state.title;
    },
    computedTitleDescription() {
      return this.$store.state.titleDescription;
    },
  },
};
</script>
