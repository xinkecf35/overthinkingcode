<template>
  <div class="toggle-control">
    <slot></slot>
    <div
      class="toggle-switch"
      :class="{ active: state }"
      @click.capture="toggleState()"
    >
      <div class="toggle" :class="{ active: state }"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    setting: {
      type: String,
      required: true,
    },
  },
  computed: {
    state() {
      return this.$store.state[this.setting];
    },
  },
  // TODO: need to write more generically
  methods: {
    toggleState() {
      const mutationMap = {
        prefersDarkMode: this.setColorMode,
        useSystemScheme: this.setUseSystemScheme,
      };
      const newState = !this.state;
      mutationMap[this.setting](newState);
    },
    ...mapActions(['setUseSystemScheme', 'setColorMode']),
  },
};
</script>

<style lang="scss">
.toggle-control {
  align-items: center;
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: row;
  font-size: 18px;
  height: 28px;
  margin: 0.25em 0 0.25em 0;
  max-width: 200px;
  position: relative;
  width: 90%;
}

.toggle-switch {
  width: 42px;
  height: 24px;
  background-color: $default-white;
  border-radius: 14px;
  position: absolute;
  transition: 0.5s linear;
  right: 0px;
  &.active {
    background-color: $secondary-color;
  }
  .toggle {
    background-color: $default-white;
    border: 1px solid $default-black;
    border-radius: 11px;
    position: absolute;
    top: 1px;
    left: 1px;
    height: 22px;
    width: 22px;
    transition: 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    &.active {
      transform: translateX(18px);
    }
  }
}
</style>
