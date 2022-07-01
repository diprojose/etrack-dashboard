<template>
  <div class="bg-white w-full mx-4 p-4 z-10">
    <div class="flex">
      <div class="mouse-event-filter md:flex md:flex-wrap lg:flex grid items-center">
        <button @click="modalStatus = true">
          <i class="fas fa-align-left"></i>
        </button>
        <tooltip
          v-if="tooltips && tooltips.filter"
          :tooltip-text="tooltips.filter"
          class="mx-4" />
        <div class="form-group flex items-center">
          <label v-if="zones > 0" for="zone-name" class="lg:ml-4 lg:mr-2 mb-4 md:mb-0 text-center md:text-left">Dale un nombre a tu zona</label>
          <input
            v-if="zones > 0"
            class="p-2 border rounded lg:ml-4 my-4 md:my-0"
            type="text"
            name="zone-name"
            id="zone-name"
            placeholder="Nombre de zona"
            v-model="zoneName"
          />
        </div>
        <button class="button-primary p-2 rounded lg:ml-4 lg:mr-2 mb-4 md:mb-0" @click="saveZones" v-if="zones > 0">
          Guardar zonas
        </button>
        <button class="button-primary p-2 rounded lg:mx-2 mb-4 md:mb-0" @click="deleteZones" v-if="zones > 0">
          Borrar selecciones
        </button>
        <div class="form-group flex items-center">
          <label for="zones-saved" class="lg:ml-4 lg:mr-2 mb-4 md:mb-0 text-center md:text-left">Zonas guardadas</label>
          <select
            name="zones-saved"
            class="rounded border p-2 lg:mx-2 mb-4 md:mb-0"
            id="zones-saved"
            v-if="computedZones.length > 0"
            v-model="zoneSelected"
          >
            <option value="empty">Seleccionar...</option>
            <option :value="zone" v-for="zone in computedZones" :key="zone.id">
              {{ zone.name }}
            </option>
          </select>
        </div>
        <button class="button-primary p-2 rounded lg:mx-2" v-if="zoneSelected !== 'empty'" @click="deleteZoneFromDB">
          Borrar zona
        </button>
        <tooltip
          v-if="tooltips && tooltips.zone"
          :tooltip-text="tooltips.zone"
          class="mx-4" />
        <button class="play-button" @click="playButtonEvent" v-if="showType === 'line' || showType === 'video'">
          <img src="../../assets/boton-de-play.png" class="play-button-image" alt="">
        </button>
        <button class="play-button" @click="downloadEvent" v-if="showType === 'line' || showType === 'video'">
          <img src="../../assets/download.png" class="download-image" alt="">
        </button>
      </div>
    </div>
    <modal :modal-status="modalStatus" @close-modal="changeModalStatus()">
      <div class="filters-container px-4">
        <h3 class="text-3xl font-bold mb-4">Filtrar:</h3>
        <div class="date-filter flex items-center justify-between mb-4">
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
            :appendToBody="true"
            controlContainerClass="date-filter-picker"
            v-model="dateRange"
          >
            <template v-slot:input="picker" style="min-width: 350px">
              {{ formatDate(picker.startDate) }} - {{ formatDate(picker.endDate) }}
            </template>
          </date-range-picker>
        </div>
        <div id="filter-type" class="mouse-event-filter flex items-center justify-between mb-4">
          <p class="date-filter-label pr-4">Tipo de filtro:</p>
          <select class="select" name="filterType" v-model="filterType" id="filterType">
            <option value="empty">Seleccionar...</option>
            <option value="user">Por usuario</option>
            <option value="url">Por dominio</option>
          </select>
        </div>
        <div
          id="user-select"
          class="mouse-event-filter flex items-center justify-between mb-4"
          v-if="filterType === 'user'"
        >
          <p class="date-filter-label pr-4">Usuario:</p>
          <select class="select" name="user-selected" v-model="userSelected" id="user-selected">
            <option value="empty">Seleccionar...</option>
            <option v-if="usersMovements.length === 0" value="nohay">No hay usuarios en estas fechas...</option>
            <option :value="user" v-for="(user) in usersMovements" :key="user.id">
              {{ user.name }} - {{ user.url }}
            </option>
          </select>
        </div>
        <div
          id="url-select"
          class="mouse-event-filter flex items-center justify-between mb-4"
          v-if="filterType === 'url'"
        >
          <p class="date-filter-label pr-4">Dominio:</p>
          <select class="select" name="user-selected" v-model="urlSelected" id="user-selected">
            <option value="empty">Seleccionar...</option>
            <option :value="url" v-for="url in urls" :key="url">
              {{ url }}
            </option>
          </select>
        </div>
        <div id="mouse-events" class="mouse-event-filter flex items-center justify-between mb-4">
          <p class="date-filter-label pr-4">Eventos del mouse:</p>
          <select class="select" name="mouse" v-model="mouseEvents" id="mouse">
            <option value="empty">Seleccionar...</option>
            <option value="Movements">Movimientos</option>
            <option value="Clicks">Clicks</option>
            <option value="all">Todos</option>
          </select>
        </div>
        <div id="show-type" class="mouse-event-filter flex items-center justify-between mb-4">
          <p class="date-filter-label pr-4">Visualización:</p>
          <select class="select" name="mousestyles" v-model="showType" id="mousestyles">
            <option value="dots">Todo</option>
            <option value="video" v-if="filterType !== 'url' && mouseEvents !== 'Clicks'">
              Video
            </option>
            <option value="line" v-if="filterType !== 'url'">
              Ruta analógica
            </option>
          </select>
        </div>
        <div class="apply-button">
          <button @click="updateValues" class="button-primary rounded px-4 py-1">Aplicar</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import axios from 'axios';
import DateRangePicker from 'vue2-daterange-picker';
import { format } from 'date-fns';
import Modal from '../Modal/Modal.vue';
import Tooltip from '../Tooltip/Tooltip.vue';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';

export default {
  name: 'AnalyticsToolbar',
  components: {
    DateRangePicker,
    Modal,
    Tooltip,
  },
  props: {
    usersMovements: {
      type: Array,
      default: () => [],
    },
    urls: {
      type: Array,
      default: () => [],
    },
    zones: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    return {
      dateRange: { startDate, endDate },
      mouseEvents: 'empty',
      showType: 'dots',
      typeDatePicker: 'single',
      maxDate: new Date(),
      userSelected: 'empty',
      urlSelected: 'empty',
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
      modalStatus: false,
      filterType: 'empty',
      filters: [],
      zoneName: '',
      zoneSelected: 'empty',
      tooltips: {},
    };
  },
  computed: {
    computedZones() {
      return this.$store.state.zones;
    },
  },
  watch: {
    zoneSelected(newValue) {
      this.$emit('zone-selected', newValue);
    },
    dateRange(range) {
      this.$emit('filter-users-by-date', range);
    },
  },
  created() {
    this.getTooltips();
  },
  methods: {
    getTooltips() {
      axios
        .get(`${process.env.VUE_APP_API}/tooltips/page/analytics`)
        .then((response) => {
          const { data } = response;
          this.tooltips = {};
          data.forEach((res) => {
            this.tooltips = {
              ...this.tooltips,
              [res.name]: res.text,
            };
          });
          if (this.tooltips && this.tooltips.description) {
            this.$store.dispatch('setTitleDescription', this.tooltips.description);
          }
        });
    },
    changeModalStatus() {
      this.modalStatus = false;
    },
    deleteZones() {
      this.$emit('delete-zones');
    },
    deleteZoneFromDB() {
      this.$emit('delete-zone-from-db');
      this.zoneSelected = 'empty';
    },
    saveZones() {
      this.$emit('save-zones', this.zoneName);
    },
    playButtonEvent() {
      this.$store.commit('setPlayEvent', true);
    },
    downloadEvent() {
      this.$store.commit('setDownloadEvent', true);
    },
    updateValues() {
      let error = false;
      if (this.mouseEvents === 'empty') {
        error = true;
      }
      if (this.filterType === 'user' && this.userSelected === 'empty') {
        error = true;
      }
      if (this.filterType === 'url' && this.urlSelected === 'empty') {
        error = true;
      }
      if (!error) {
        let eventUpdate = {
          filterType: this.filterType,
          startDate: this.dateRange.startDate,
          endDate: this.dateRange.endDate,
          mouseEvents: this.mouseEvents,
          showType: this.showType,
          image: this.userSelected.image ? this.userSelected.image : '',
        };
        if (this.filterType === 'user') {
          eventUpdate = {
            ...eventUpdate,
            user: this.userSelected,
          };
        }
        if (this.filterType === 'url') {
          eventUpdate = {
            ...eventUpdate,
            url: this.urlSelected,
          };
        }
        this.changeModalStatus();
        this.$emit('date-range-updated', eventUpdate);
      } else {
        this.$swal.fire(
          'Error!',
          'Debes agregar todas las variables',
          'error',
        );
      }
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

.daterangepicker {
  &.show-ranges {
    min-width: 540px !important;
  }
  &.show-calendar {
    .calendars {
      .ranges {
        display: none;
      }
    }
  }
}

.vue-daterange-picker {
  width: 250px;
}

.mouse-event-filter {
  .select {
    padding: 5px 10px;
    border: 1px solid;
    border-radius: 5px;
    max-width: 250px;
    width: 250px;
  }
  button {
    i {
      font-size: 32px;
    }
  }
  .play-button {
    .play-button-image {
      width: 50px;
    }
    .download-image {
      width: 41px;
    }
  }
}
</style>
