<template>
  <div id="post-main">
    <h2>{{ title }}</h2>
    <div class="post-meta">
      <span>{{ date }}</span>
      <ul>
        <li v-for="tag in tags" :key="tag">{{ tag }}</li>
      </ul>
    </div>
    <div>{{ content }}</div>
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
      const contentMap = this.$store.state.articles.contentMap;
      return contentMap[this.route].content;
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
<style lang="scss"></style>
