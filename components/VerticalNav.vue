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
      <li>
        <ToggleSwitch :setting="'darkColorMode'">Night Node </ToggleSwitch>
      </li>
    </ul>
  </div>
</template>

<script>
import ToggleSwitch from '~/components/ToggleSwitch.vue';

export default {
  components: { ToggleSwitch },
};
</script>

<style lang="scss">
@import '@/assets/styles/global-variables.scss';

#nav-wrapper {
  background-color: $primary-color;
  color: $default-white;
  flex: 0 0 auto;
  height: 100vh;
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
}
#site-controls {
  list-style: none;
  margin-top: 1.5em;
}
</style>
