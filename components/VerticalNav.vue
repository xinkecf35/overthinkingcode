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
  color: $default-white;
  flex: 0 0 auto;
  height: 100%;
  list-style: none;
  max-width: 320px;
  width: 20%;
  a {
    color: $default-white;
    font-family: $copy-font-stack;
    font-size: 1.5em;
    font-weight: 500;
    line-height: 1.5em;
    margin: 0.5em 0 0.25em 0em;
    padding: 0.25 0em 0.125em 0em;
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
  }
  @media screen and (max-width: $tablet-max-width - 1) {
    $menu-width: 240px;
    position: fixed;
    height: calc(100% - $mobile-header-height);
    left: -$menu-width;
    top: $mobile-header-height;
    transition: 0.5s ease-in-out;
    visibility: hidden;
    width: $menu-width;
    &.active {
      transform: translateX($menu-width);
      visibility: visible;
    }
  }
}
#site-controls {
  list-style: none;
  margin-top: 1.5em;
}
</style>
