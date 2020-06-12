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
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import '@/assets/styles/global_variables.scss';

#nav-wrapper {
  background-color: $primary-color;
  color: $default-white;
  height: 100vh;
  min-width: 16%;
  flex: 1 0 auto;
  a {
    color: $default-white;
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
  nav ul {
    list-style: none;
    li {
      font-family: $copy-font-stack;
      font-size: 1.5em;
    }
  }
  img {
    margin: 1.5em;
  }
}
</style>
