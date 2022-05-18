<template>
  <div id="chart" class="bg-white shadow-lg rounded p-2">
    <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>
<script>

export default {
  props: {
    dataSets: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      series: [{
        name: 'Visitas',
        data: this.dataSets,
      }],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 5,
          curve: 'smooth',
        },
        title: {
          text: 'Visitas este año',
          align: 'left',
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        },
      },
    };
  },
};
</script>
