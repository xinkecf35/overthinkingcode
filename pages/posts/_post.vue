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
        linkify: true,
        typographer: true,
      }).use(require('markdown-it-highlightjs'), {
        auto: true,
        code: true,
        register: null,
      });
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
  head() {
    return {
      title: `${this.title} | Overthinking Code`,
    };
  },
};
</script>
<style lang="scss">
#post-main {
  box-sizing: border-box;
  font-size: 18px;
  margin: 1em;
  width: 80%;
  max-width: 1024px;
  code {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 16px;
  }
  main {
    text-align: left;
  }
  h1 {
    font-size: 2.75em;
    font-weight: 800;
    margin: 0.75em 0 0.25em 0;
  }
  h2 {
    font-size: 2.25em;
    font-weight: 700;
    margin: 0.5em 0 0.5em 0;
  }
  h3 {
    font-size: 1.75em;
    font-weight: 600;
  }
  img {
    display: block;
    max-width: 500px;
    max-height: 500px;
    margin: 0 auto;
  }
  p {
    margin-bottom: 0.8em;
    line-height: 1.4em;
  }
  pre {
    white-space: pre-wrap;
  }
  .hljs {
    color: $default-white;
  }
}

.post-meta {
  align-items: baseline;
  display: flex;
  flex-direction: row;
  margin-bottom: 1em;
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
