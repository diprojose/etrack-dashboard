<template>
  <div v-if="modalStatus" id="modal">
    <div class="modal-content">
      <slot></slot>
    </div>
    <div class="overlay" @click="closeModal()"></div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    modalStatus: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },
  },
};
</script>

<style lang="scss">
@import "assets/styles/scss/_index.scss";
#modal {
  .modal-content {
    width: 50%;
    height: 75%;
    max-width: 600px;
    max-height: 500px;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    z-index: 10;
    overflow-y: scroll;
    @include responsive(xs) {
      width: 95%;
    }
  }
  .overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 3;
    top: 0;
    left: 0;
    background: rgba($color: #000000, $alpha: 0.7);
  }
}
</style>
