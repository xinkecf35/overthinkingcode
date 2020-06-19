<template>
  <label class="menu-button" @click.capture="action" @keyup.enter="action">
    <span class="menu-stroke top" :class="{ active: state }"></span>
    <span class="menu-stroke middle" :class="{ active: state }"></span>
    <span class="menu-stroke bottom" :class="{ active: state }"></span>
  </label>
</template>

<script>
export default {
  props: {
    toggle: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      state: false,
    };
  },
  methods: {
    action() {
      this.state = !this.state;
      this.toggle();
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-button {
  display: block;
  width: 32px;
  height: 32px;
}
.menu-stroke {
  $stroke-width: 2px;
  $stroke-padding: 14px;
  $stroke-length: 32px;
  background-color: $default-white;
  display: block;
  height: $stroke-width;
  width: $stroke-length;
  position: relative;
  transition: 0.5s ease-in-out;
  &.top {
    position: absolute;
    top: 0px;
    &.active {
      transform: translate(-4px, 8px) rotate(-40deg);
      width: calc(#{$stroke-length} - 12px);
    }
  }
  &.middle {
    position: absolute;
    top: $stroke-padding;
    &.active {
      width: calc(#{$stroke-length} - 4px);
    }
  }
  &.bottom {
    position: absolute;
    top: 2 * $stroke-padding;
    &.active {
      transform: translate(-4px, -8px) rotate(40deg);
      width: calc(#{$stroke-length} - 12px);
    }
  }
}
</style>
