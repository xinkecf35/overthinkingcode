<template>
  <div class="container" :class="getColorScheme">
    <vertical-nav :class="{ active: mobileReveal }" />
    <div id="mobile-menu">
      <menu-button id="menu-button" :toggle="toggleMobileMenu" />
    </div>
    <div id="content-wrapper" :class="getColorScheme">
      <nuxt />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import MenuButton from '~/components/MenuButton';
import VerticalNav from '@/components/VerticalNav.vue';

export default {
  components: {
    MenuButton,
    VerticalNav,
  },
  data() {
    return {
      mobileReveal: false,
    };
  },
  computed: mapGetters(['getColorScheme']),
  mounted() {
    this.getPreferredColorScheme();
  },
  methods: {
    toggleMobileMenu() {
      this.mobileReveal = !this.mobileReveal;
    },
    ...mapMutations(['getPreferredColorScheme']),
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/_variables.scss';

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
    font-size: 1.05em;
    font-weight: 500;
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
  background-color: $default-white;
  color: $default-black;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 100%;
  justify-content: space-between;
  margin: 0 auto;
  overflow-x: hidden;
  text-align: left;
  width: 100%;

  @media (prefers-color-scheme: dark) {
    @include dark-scheme;
  }
  @media (prefers-color-scheme: light) {
    @include light-scheme;
  }
  &.dark {
    @include dark-scheme;
    transition: 0.25s ease-in;
  }
  &.light {
    @include light-scheme;
    transition: 0.25s ease-in;
  }
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
  @media (prefers-color-scheme: dark) {
    @include dark-scheme;
  }
  @media (prefers-color-scheme: light) {
    @include light-scheme;
  }

  &.dark {
    @include dark-scheme;
    transition: 0.25s ease-in;
  }
  &.light {
    @include light-scheme;
    transition: 0.25s ease-in;
  }
}

#menu-button {
  position: absolute;
  top: 8px;
  left: 12px;
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
