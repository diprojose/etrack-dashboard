<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0" v-if="title">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-2 max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-base text-blueGray-700">
            {{title}}
          </h3>
        </div>
        <div
          class="relative w-full px-4 max-w-full flex-grow flex-1 text-right"
        ></div>
      </div>
    </div>
    <div class="block w-full overflow-x-auto">
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse border">
        <thead class="thead-light">
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="`column-${index}`"
              :class="{ 'text-center': column.align && column.align === 'center' }"
              class="px-6 bg-gray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              {{column.name}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="`row-${index}`">
            <td
              v-for="(rowValue, rowIndex) in row.values" :key="`row-value-${rowIndex}`"
              :class="{ 'text-center': rowValue.align && rowValue.align === 'center' }"
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 capitalize"
            >
              <i
                class="fa pr-1"
                :class="[
                  { 'cursor-pointer': rowValue.event === true },
                  rowValue.icon
                ]"
                @click="iconClicked(row.values)"
                v-if="rowValue.icon">
              </i> {{rowValue.value}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'DynamicTable',
  props: {
    title: {
      type: String,
      default: '',
    },
    columns: {
      type: Array,
      default: () => [],
    },
    rows: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    iconClicked(row) {
      this.$emit('icon-clicked', row);
    },
  },
};
</script>
