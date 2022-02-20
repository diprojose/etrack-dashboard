<template>
  <div class="bg-white w-full mx-4 p-4 z-10">
    <div class="flex">
      <div class="date-filter flex items-center">
        <p class="date-filter-label pr-4">Fechas:</p>
        <date-range-picker
          ref="picker"
          :maxDate="maxDate"
          :opens="'center'"
          :locale-data="localData"
          :singleDatePicker="false"
          :timePicker="false"
          :showWeekNumbers="false"
          :showDropdowns="true"
          :autoApply="true"
          controlContainerClass="date-filter-picker"
          v-model="dateRange"
          @update="updateValues($event)"
        >
          <template v-slot:input="picker" style="min-width: 350px">
            {{ formatDate(picker.startDate) }} - {{ formatDate(picker.endDate) }}
          </template>
        </date-range-picker>
      </div>
      <div class="mouse-event-filter flex items-center">
        <p class="date-filter-label px-4">Eventos del mouse:</p>
        <select class="select" name="mouse" v-model="events" id="mouse">
          <option value="empty">Seleccionar...</option>
          <option value="Movements">Movimientos</option>
          <option value="Clicks">Clicks</option>
          <option value="rightClick">Click derecho</option>
        </select>
      </div>
      <div class="mouse-event-filter flex items-center">
        <p class="date-filter-label px-4">Mostrar:</p>
        <select class="select" name="mousestyles" v-model="mousestyles" id="mousestyles">
          <option value="dots">Todo</option>
          <option value="video">Video</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import { format } from 'date-fns';

export default {
  name: 'AnalyticsToolbar',
  components: {
    DateRangePicker,
  },
  data() {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    return {
      dateRange: { startDate, endDate },
      events: 'empty',
      mousestyles: 'dots',
      typeDatePicker: 'single',
      maxDate: new Date(),
      localData: {
        format: 'mm/dd/yyyy',
        separator: ' - ',
        applyLabel: 'Aplicar',
        cancelLabel: 'Cancelar',
        weekLabel: 'S',
        customRangeLabel: 'Custom Range',
        daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'],
        monthNames: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],
        firstDay: 0,
      },
    };
  },
  watch: {
    events(newValue) {
      const eventUpdate = {
        event: newValue,
        startDate: this.dateRange.startDate,
        endDate: this.dateRange.endDate,
      };
      this.$emit('events-updated', eventUpdate);
    },
    mousestyles(newValue) {
      this.$emit('mouse-styles', newValue);
    },
  },
  methods: {
    updateValues(event) {
      const eventUpdate = {
        event: this.events,
        startDate: event.startDate,
        endDate: event.endDate,
      };
      this.$emit('date-range-updated', eventUpdate);
    },
    formatDate(date) {
      return format(date, 'dd/MM/yyyy');
    },
  },
};
</script>

<style lang="scss">
.date-filter {
  .date-filter-picker {
    padding: 5px 10px;
    border: 1px solid;
    border-radius: 5px;
  }
  .daterangepicker {
    &.show-ranges {
      min-width: 540px !important;
    }
    &.show-calendar {
      .ranges {
        display: none;
      }
    }
  }
}

.mouse-event-filter {
  .select {
    padding: 5px 10px;
    border: 1px solid;
    border-radius: 5px;
  }
}
</style>
