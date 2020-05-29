<template>
  <div id="post-main">
    <h2>{{ title }}</h2>
    <div class="post-meta">
      <span>{{ date }}</span>
      <ul>
        <li v-for="tag in tags" :key="tag">{{ tag }}</li>
      </ul>
    </div>
    <component :is="markdownComponent" />
  </div>
</template>
<script>
export default {
  props: {
    postFilePath: { type: String, required: true },
  },
  asyncData(context) {
    return {
      author: '',
      date: '',
      markdownComponent: null,
      tags: [],
      title: '',
    };
  },
  created() {
    const markdown = require(this.postFilePath);
    const postMeta = markdown.attributes;
    this.author = postMeta.author;
    this.date = postMeta.date;
    this.tags = postMeta.tags;
    this.title = postMeta.title;
  },
};
</script>
<style lang="scss"></style>
