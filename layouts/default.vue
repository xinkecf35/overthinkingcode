<template>
  <div class="container">
    <vertical-nav />
    <div id="content-wrapper" :class="colorScheme !== null ? colorScheme : ''">
      <nuxt />
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import VerticalNav from '@/components/VerticalNav.vue';

export default {
  components: {
    VerticalNav,
  },
  computed: mapState(['colorScheme']),
  mounted() {
    this.getPreferredColorScheme();
  },
  methods: mapMutations(['getPreferredColorScheme']),
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
  color: $default-black;
  position: fixed;
  top: 0;
  left: 0;

  @media (prefers-color-scheme: dark) {
    @include dark-scheme;
  }
  @media (prefers-color-scheme: light) {
    @include light-scheme;
  }
  .dark {
    @include dark-scheme;
    transition: 0.25s ease-in;
  }
  .light {
    @include light-scheme;
    transition: 0.25s ease-in;
  }
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
