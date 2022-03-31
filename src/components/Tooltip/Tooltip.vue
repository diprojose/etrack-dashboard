<template>
  <div class="tooltip-box">
    <img class="information-icon" src="../../assets/img/information-button.png" alt="" />
    <div class="tooltip p-2" :class="{ 'tooltip-large': tooltipText.length > 30 }">
      <span class="triangle"></span>
      {{ tooltipText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    tooltipText: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
.tooltip-box {
  position: relative;
  &:hover {
    .tooltip {
      display: block;
    }
  }
  .tooltip {
    width: 200px;
    background: #14329B;
    color: #ffffff;
    text-align: center;
    border-radius: 10px;
    bottom: calc(100% + 11px);
    left: 70%;
    transform: translateX(-50%);
    position: absolute;
    display: none;
    z-index: 11;
    &.tooltip-large {
      width: 400px;
    }
    .triangle {
      border-width: 0 6px 6px;
      border-color: transparent;
      border-bottom-color: #14329B;
      position: absolute;
      bottom: -6px;
      transform: rotate(180deg);
      left: calc(50% - 12px);
    }
  }
  .information-icon {
    cursor: pointer;
  }
}
</style>
