<template>
  <div class="index-post-card">
    <h2>{{ title }}</h2>
    <span>{{ date }}</span>
    <ul>
      <li v-for="tag in tags" :key="tag">{{ tag }}</li>
    </ul>
    <span>
      {{ excerpt }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/global_variables.scss';

.index-post-card {
  font-family: $copy-font-stack;
  h2 {
    font-family: $header-font-stack;
  }
}
</style>
