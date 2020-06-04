<template>
  <div id="post-main">
    <h2>{{ title }}</h2>
    <div class="post-meta">
      <span>{{ date }}</span>
      <ul>
        <li v-for="tag in tags" :key="tag">{{ tag }}</li>
      </ul>
    </div>
    <div>{{ markdown }}</div>
  </div>
</template>
<script>
import { generateBlogMeta } from '~/plugins/content-utils';

export default {
  asyncData(context) {
    if (process.server) {
      return generateBlogMeta().then((data) => {
        const route = context.route.path;
        const fm = require(`~/assets/_posts/${data.routePathMap[route]}`);
        return {
          date: fm.attributes.date,
          markdown: fm.body,
          tags: fm.attributes.tags,
          title: fm.attributes.title,
        };
      });
    }
  },
};
</script>
<style lang="scss"></style>
