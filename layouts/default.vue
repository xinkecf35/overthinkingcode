<template>
  <div class="container">
    <vertical-nav />
    <nuxt />
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
@import '~assets/styles/global_variables.scss';
@import '~assets/styles/fonts.scss';

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
  .dark {
    color: $default-white;
    background-color: $default-black;
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
  display: flex;
  flex-direction: column wrap;
  justify-content: space-between;
  text-align: left;
  background-color: $default-white;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
