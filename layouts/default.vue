<template>
  <div class="container" :class="colorScheme !== null ? colorScheme : ''">
    <vertical-nav :class="{ active: mobileReveal }" />
    <div id="mobile-menu">
      <button @click="mobileReveal = !mobileReveal">Reveal</button>
    </div>
    <div id="content-wrapper" :class="colorScheme !== null ? colorScheme : ''">
      <nuxt />
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import VerticalNav from '@/components/VerticalNav.vue';

export default {
  components: {
    VerticalNav,
  },
  data() {
    return {
      mobileReveal: false,
    };
  },
  computed: mapState(['colorScheme']),
  mounted() {
    this.getPreferredColorScheme();
  },
  methods: mapMutations(['getPreferredColorScheme']),
};
</script>

<style lang="scss">
html {
  font-family: $copy-font-stack;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: $header-font-stack;
  }
  a {
    font-family: $header-font-stack;
    color: $primary-color;
  }
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.container {
  margin: 0 auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row wrap;
  justify-content: space-between;
  text-align: left;
  background-color: $default-white;
  color: $default-black;

  @media (prefers-color-scheme: dark) {
    @include dark-scheme;
  }
  @media (prefers-color-scheme: light) {
    @include light-scheme;
  }
}

.dark {
  @include dark-scheme;
  transition: 0.25s ease-in;
}
.light {
  @include light-scheme;
  transition: 0.25s ease-in;
}

#content-wrapper {
  display: flex;
  flex-direction: row wrap;
  justify-content: center;
  min-height: 100%;
  position: absolute;
  right: 0;
  width: calc(100% - #{$desktop-menu-width});
  z-index: 100;
  @media screen and (max-width: $tablet-max-width - 1) {
    margin-top: calc(#{$mobile-header-height});
    width: 100%;
  }
  @media screen and (min-width: $desktop-large-width) {
    width: calc(100% - #{$desktop-large-menu-width});
  }
}

#mobile-menu {
  background-color: $primary-color;
  height: $mobile-header-height;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 800;
  @media screen and (min-width: $tablet-max-width) {
    display: none;
  }
}
</style>
