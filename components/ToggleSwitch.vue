<template>
  <div class="toggle-control">
    <span><slot></slot></span>
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
export default {
  props: {
    // Determines what Vuex property we're operating over
    setting: {
      type: String,
      required: true,
    },
    // Correct mutation/action that operates over said Vuex property
    action: {
      type: Function,
      required: true,
    },
  },
  computed: {
    state() {
      return this.$store.state[this.setting];
    },
  },
  methods: {
    toggleState() {
      // So that future me is not confused: this takes the passed in
      // function object and calls it with negation of the current state.
      this.action(!this.state);
    },
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
  box-shadow: 0px 2px 4px hsla(0, 0, 18%, 0.4);
  position: absolute;
  transition: 0.5s linear;
  right: 0px;
  &.active {
    background-color: $secondary-color;
  }
  .toggle {
    background-color: $default-white;
    box-shadow: 1px 1px 2px $default-black;
    border-radius: 11px;
    position: absolute;
    top: 1px;
    left: 1px;
    height: 22px;
    width: 22px;
    transition: 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    &.active {
      box-shadow: -1px 1px 2px $default-black;
      transform: translateX(18px);
    }
  }
}
</style>
