<template>
  <div id="post-main">
    <h2>{{ title }}</h2>
    <div class="post-meta">
      <span>{{ date }}</span>
      <ul>
        <li v-for="tag in tags" :key="tag">{{ tag }}</li>
      </ul>
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <main v-html="content"></main>
  </div>
</template>
<script>
import { DateTime } from 'luxon';

export default {
  asyncData(context) {
    return {
      route: context.route.path,
    };
  },
  // Doing it the long way, cant get mapState to cooperate with this
  computed: {
    formattedDate() {
      return DateTime.fromISO(this.date).toISODate();
    },
    content() {
      const md = require('markdown-it')('default').use(
        require('markdown-it-container'),
        'code-snippet'
      );
      const contentMap = this.$store.state.articles.contentMap;
      return md.render(contentMap[this.route].content);
    },
    date() {
      const contentMap = this.$store.state.articles.contentMap;
      const date = contentMap[this.route].date;
      return DateTime.fromISO(date).toISODate();
    },
    tags() {
      const contentMap = this.$store.state.articles.contentMap;
      return contentMap[this.route].tags;
    },
    title() {
      const contentMap = this.$store.state.articles.contentMap;
      return contentMap[this.route].title;
    },
  },
};
</script>
<style lang="scss">
#post-main {
  margin: 1em 4em 2em 2em;
  overflow: auto;
  main {
    text-align: left;
  }
}
</style>
