<template>
  <div v-if="modalStatus" id="modal">
    <div :class="computedClass">
      <slot></slot>
    </div>
    <div class="overlay text-right" @click="closeModal()">
      <button class="m-4">
        <img src="../../assets/img/close.png" alt="">
      </button>
    </div>
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
    size: {
      type: String,
      default: 'small',
    },
  },
  computed: {
    computedClass() {
      const retClass = ['modal-content', 'flex', 'items-center', 'justify-center'];
      if (this.size === 'small') {
        retClass.push('small');
      }
      if (this.size === 'big') {
        retClass.push('big');
      }
      return retClass;
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
@import "../../styles/index.scss";
#modal {
  .modal-content {
    max-width: 650px;
    max-height: 500px;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    z-index: 12;
    &.small {
      overflow-y: scroll;
      width: 50%;
      height: 75%;
    }
    @include responsive(xs) {
      width: 95%;
    }
  }
  .overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 11;
    top: 0;
    left: 0;
    background: rgba($color: #000000, $alpha: 0.7);
  }
}
</style>
