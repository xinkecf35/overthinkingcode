<template>
  <div id="nav-wrapper">
    <h1>
      Overthinking Code
    </h1>
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
  flex-basis: 250px;
  height: 100vh;
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
}
</style>
