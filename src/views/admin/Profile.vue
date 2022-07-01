<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-full px-4">
      <CardSettings />
    </div>
  </div>
</template>
<script>
import CardSettings from '@/components/Cards/CardSettings.vue';

export default {
  name: 'Settings',
  components: {
    CardSettings,
  },
  created() {
    this.$store.dispatch('getUser');
    this.$store.dispatch('setTitle', 'Perfil');
  },
};
</script>
