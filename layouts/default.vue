<template>
  <div class="container">
    <vertical-nav />
    <div id="content-wrapper">
      <nuxt />
    </div>
  </div>
</template>
<script>
import VerticalNav from '@/components/VerticalNav.vue';

export default {
  components: {
    VerticalNav,
  },
};
</script>

<style lang="scss">
@import '@/assets/styles/global-variables.scss';
@import '@/assets/styles/fonts.scss';

html {
  font-family: $copy-font-stack;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: $default-white;
  color: $default-black;
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
.dark {
  color: $default-white;
  background-color: $default-black;
  a {
    color: $secondary-color;
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
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row wrap;
  justify-content: space-between;
  text-align: left;
  background-color: $default-white;
  position: fixed;
  top: 0;
  left: 0;
}

#content-wrapper {
  display: flex;
  flex-direction: row wrap;
  justify-content: center;
  flex: 2 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
