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
            <li v-for="tag in tags" :key="tag">
              <nuxt-link :to="{ path: '/tags', query: { tag } }">
                {{ tag }}
              </nuxt-link>
            </li>
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
  asyncData({ $md, error, store, route }) {
    const contentMap = store.state.articles;
    if (typeof contentMap[route.path] === 'undefined') {
      error({ statusCode: 404, message: 'page not found' });
    } else {
      const { content, date, tags, title } = contentMap[route.path];
      return {
        content: $md.render(content),
        date: DateTime.fromISO(date).toISODate(),
        tags,
        title,
      };
    }
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
  font-size: 20px;
  margin: 1em;
  max-width: $content-max-width;
  width: $content-width;
  article {
    margin-bottom: 20vh;
  }
  code {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.9em;
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
    font-weight: 700;
    margin: 0.5em 0 0.5em 0;
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
    margin: 0.5em 0 0.5em 0;
  }
  pre {
    white-space: pre-wrap;
  }
  ul {
    margin: 0.75em 0 0.75em 0.5em;
  }
  .hljs {
    color: $default-white;
    border-radius: 0.5em;
    box-shadow: 0px 4px 10px hsla(0, 0, 12%, 0.75);
  }
  @media screen and (max-width: $mobile-max-width) {
    font-size: 16px;
    width: $content-mobile-width;
  }
}

.post-meta {
  align-items: baseline;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 0.85em;
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
    flex-wrap: wrap;
    min-width: 1em;
    li {
      padding: 1em 0.5em 1em 0em;
    }
  }
  @media screen and (max-width: $mobile-max-width) {
    font-size: 12px;
    span {
      padding: 0.25em 0.25em 0.25em 0;
    }
    ul {
      li {
        padding: 0.25em 0.25em 0.25em 0;
      }
    }
  }

  .post-meta-info {
    display: flex;
    ul {
      margin: 0 !important;
    }
  }
}
</style>
