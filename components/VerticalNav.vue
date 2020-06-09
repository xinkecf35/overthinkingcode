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
        <li>Home</li>
        <li>Tags</li>
        <li>About</li>
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
