<template>
  <div>
    <sidebar />
    <div class="relative md:ml-64 bg-gray-100">
      <admin-navbar />
      <div class="px-4 md:px-10 mx-auto w-full">
        <router-view />
        <footer-admin />
      </div>
    </div>
    <div class="contact-whatsapp">
      <a target="_blank" href="https://wa.me/573194033852?text=Hola%20necesito%20ayuda%20sobre%20la%20web%20E-track">
        <img src="../assets/img/whatsapp.png" alt="Contacta directamente con nosotros">
      </a>
    </div>
  </div>
</template>
<script>
import AdminNavbar from '@/components/Navbars/AdminNavbar.vue';
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import FooterAdmin from '@/components/Footers/FooterAdmin.vue';

export default {
  name: 'admin-layout',
  components: {
    AdminNavbar,
    Sidebar,
    FooterAdmin,
  },
  created() {
    this.$store.dispatch('getUser');
  },
};
</script>

<style lang="scss" scoped>
.contact-whatsapp {
  position: fixed;
  right: 10px;
  bottom: 10px;
}
</style>
