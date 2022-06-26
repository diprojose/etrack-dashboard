<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full pl-2 max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-base text-blueGray-700">
            Información de páginas web
          </h3>
        </div>
      </div>
    </div>
    <div class="block w-full overflow-x-auto p-4">
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th
              class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Nombre de ruta
            </th>
            <th
              class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center"
            >
              Visitas
            </th>
            <th
              class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center"
            >
              Usuarios
            </th>
            <th
              class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center"
            >
              Tasa de rebote
            </th>
            <th
              class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center"
            >
              Tiempo en promedio
            </th>
          </tr>
        </thead>
        <tbody v-if="pageVisits.length > 0 && totalSessions > 0">
          <tr v-for="(website, index) in pageVisits" :key="`website-${index}`">
            <th
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
            >
              {{website.url}}
            </th>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
            >
              {{website.visits}}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
            >
              {{website.users}}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
            >
              <!-- <i class="fas fa-arrow-down text-orange-500 mr-4"></i>
              <i class="fas fa-arrow-up text-green-500 mr-4"></i> -->
              {{ (website.visits / totalSessions).toFixed(2) }}%
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
            >
              <!-- <i class="fas fa-arrow-down text-orange-500 mr-4"></i>
              <i class="fas fa-arrow-up text-green-500 mr-4"></i> -->
              {{ website.averageTime.toFixed(2) }} s
            </td>
          </tr>
        </tbody>
        <tbody v-if="pageVisits.length === 0 && totalSessions === 0">
          <tr>
            <td>
              <p class="bg-white rounded p-4">Aún no tiene información</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CardPageVisits.vue',
  props: {
    pageVisits: {
      type: Array,
      default: () => [],
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
  },
};
</script>
