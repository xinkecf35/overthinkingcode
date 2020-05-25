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

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: $default-white;
}
</style>
