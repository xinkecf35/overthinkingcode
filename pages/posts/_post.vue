<template>
  <main id="post-main">
    <article>
      <h1>{{ title }}</h1>
      <div class="post-meta">
        <div class="post-meta-info">
          <span>Published:</span>
          <span>{{ date }}</span>
        </div>
        <div class="post-meta-info">
          <span>Tags:</span>
          <ul>
            <li v-for="tag in tags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <section v-html="content"></section>
    </article>
  </main>
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
      const md = require('markdown-it')({
        langPrefix: 'post-content',
        linkify: true,
        typographer: true,
      }).use(require('markdown-it-container'), 'code-snippet');
      const contentMap = this.$store.state.articles;
      const content = contentMap[this.route].content;
      return md.render(content);
    },
    date() {
      const contentMap = this.$store.state.articles;
      const date = contentMap[this.route].date;
      return DateTime.fromISO(date).toISODate();
    },
    tags() {
      const contentMap = this.$store.state.articles;
      return contentMap[this.route].tags;
    },
    title() {
      const contentMap = this.$store.state.articles;
      return contentMap[this.route].title;
    },
  },
};
</script>
<style lang="scss">
@import '@/assets/styles/global-variables.scss';

#post-main {
  margin: 1em 4em 2em 2em;
  main {
    text-align: left;
  }
  h1 {
    font-size: 3em;
    font-weight: 700;
  }
}

.post-meta {
  align-items: baseline;
  display: flex;
  flex-direction: row;
  font-size: 18px;
  span {
    min-width: 1em;
    padding: 1em 0.5em 1em 0em;
  }
  ul {
    padding: 0;
    display: flex;
    justify-content: flex-start;
    list-style: none;
    flex-direction: row;
    min-width: 1em;
    li {
      padding: 1em 0.5em 1em 0em;
    }
  }

  .post-meta-info {
    display: flex;
  }
}
</style>
