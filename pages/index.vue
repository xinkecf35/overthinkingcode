<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        Overthinking Code
      </h1>
      <h2 class="subtitle">
        Source for Overthinking Code
      </h2>
      <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';
import { generateBlogMeta } from '~/plugins/content-utils';

export default {
  components: {
    Logo,
  },
  asyncData(context) {
    return generateBlogMeta();
  },
};
</script>

<style lang="scss">
@import '@/assets/styles/global_variables.scss';

.title {
  font-family: $header-font-stack;
  display: block;
  font-weight: 800;
  font-size: 100px;
  color: $primary-color;
  letter-spacing: 1px;
}

.subtitle {
  font-family: $copy-font-stack;
  font-weight: 300;
  font-size: 42px;
  color: $secondary-color;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
