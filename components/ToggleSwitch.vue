<template>
  <div class="toggle-control">
    <slot></slot>
    <div
      class="toggle-switch"
      :class="{ active: state }"
      @click.capture="toggleColorScheme()"
    >
      <div class="toggle" :class="{ active: state }"></div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

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
    toggleColorScheme() {
      this.setColorScheme(!this.state);
    },
    ...mapMutations(['setColorScheme']),
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
}

.toggle-switch {
  width: 54px;
  height: 28px;
  background-color: $default-white;
  border-radius: 14px;
  margin-left: 1.5em;
  position: relative;
  transition: 0.5s linear;
  &.active {
    background-color: $secondary-color;
  }
  .toggle {
    background-color: $default-white;
    border: 1px solid $default-black;
    border-radius: 12px;
    position: absolute;
    top: 2px;
    left: 2px;
    height: 24px;
    width: 24px;
    transition: 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    &.active {
      transform: translateX(26px);
    }
  }
}
</style>
