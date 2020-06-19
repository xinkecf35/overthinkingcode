<template>
  <div id="nav-wrapper">
    <picture>
      <source type="image/svg+xml" srcset="~/assets/images/logo-alt.svg" />
      <source
        srcset="~/assets/images/logo@2x.png 2x, ~/assets/images/logo@2x.png 3x"
      />
      <img srcset="~/assets/images/logo-alt.png" alt="logo" />
    </picture>
    <nav>
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li><nuxt-link to="/tags">Tags</nuxt-link></li>
        <li><nuxt-link to="/about">About</nuxt-link></li>
      </ul>
    </nav>
    <ul id="site-controls">
      <!-- Future me: if you're confused, look at ToggleSwitch Comments -->
      <li v-for="setting in settings" :key="setting">
        <toggle-switch :setting="setting" :action="actions[setting]">
          {{ labels[setting] }}
        </toggle-switch>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ToggleSwitch from '~/components/ToggleSwitch.vue';

export default {
  components: { ToggleSwitch },
  data() {
    return {
      actions: {
        prefersDarkMode: this.setColorMode,
        useSystemScheme: this.setUseSystemScheme,
      },
      settings: ['prefersDarkMode', 'useSystemScheme'],
      labels: {
        prefersDarkMode: 'Dark Mode',
        useSystemScheme: 'Use System',
      },
    };
  },
  methods: mapActions(['setUseSystemScheme', 'setColorMode']),
};
</script>

<style lang="scss">
#nav-wrapper {
  background-color: $primary-color;
  box-shadow: 0 4px 12px hsla(0, 0, 15%, 0.6);
  color: $default-white;
  display: flex;
  flex-direction: column;
  flex-direction: nowrap;
  height: 100%;
  left: 0;
  list-style: none;
  position: fixed;
  top: 0;
  width: $desktop-menu-width;
  a {
    color: $default-white;
    font-size: 1.5em;
    font-weight: 600;
    line-height: 1.6em;
    text-decoration: none;
    &:hover {
      border-bottom: 4px solid $secondary-color;
    }
  }
  h1 {
    font-family: $header-font-stack;
  }
  img {
    margin: 1.5em;
  }
  ul {
    list-style: none;
    li {
      margin: 0em 0 0.25em 0em;
    }
  }
  @media screen and (max-width: $mobile-max-width) {
    font-size: 14px;
  }
  // Special breakpoint for landscape large phones
  // Added due to concerns regarding branding/art-directions
  @media screen and (max-width: 850px) and (orientation: landscape) {
    overflow-y: scroll;
    picture {
      order: 3;
      height: 120px;
      align-self: center;
    }
    img {
      height: 100%;
      margin: 0;
      justify-self: center;
    }
    nav {
      order: 1;
    }
  }
  @media screen and (max-width: $tablet-max-width - 1) {
    $menu-width: 240px;
    position: fixed;
    height: calc(100% - #{$mobile-header-height});
    left: -$menu-width;
    top: $mobile-header-height;
    transition: 0.5s ease-in-out;
    visibility: hidden;
    width: $menu-width;
    z-index: 800;
    &.active {
      transform: translateX($menu-width);
      visibility: visible;
    }
  }
  @media screen and (min-width: $desktop-large-width) {
    width: $desktop-large-menu-width;
  }
}
#site-controls {
  list-style: none;
  margin-top: 1.5em;
  order: 2;
  @media screen and (orientation: landscape) {
    margin-top: 0.75em;
    margin-bottom: 0.25em;
  }
}
</style>
