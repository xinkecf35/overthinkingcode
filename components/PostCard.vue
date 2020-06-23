<template>
  <div class="index-post-card">
    <h2>
      <nuxt-link :to="page">
        {{ title }}
      </nuxt-link>
    </h2>
    <div class="index-post-card-meta">
      <div class="card-meta-info">
        <span>Published:</span>
        <span>{{ formattedDate }}</span>
      </div>
      <div class="card-meta-info">
        <span>Tags:</span>
        <ul>
          <li v-for="tag in tags" :key="tag">{{ tag }}</li>
        </ul>
      </div>
    </div>
    <!-- <p>{{ excerpt }}</p> -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="index-post-excerpt" v-html="content"></div>
    <div class="index-post-card-more">
      <div class="hide-bottom" :class="getColorScheme"></div>
      <nuxt-link :to="page">
        More
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { DateTime } from 'luxon';

export default {
  props: {
    date: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      required: true,
    },
  },
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
      return md.render(this.excerpt);
    },
    ...mapGetters(['getColorScheme']),
  },
};
</script>

<style lang="scss">
.index-post-card {
  font-family: $copy-font-stack;
  margin: 0.5em 0em 2em 0em;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  a {
    text-decoration: none;
    &:hover {
      border-bottom: 4px solid $secondary-color;
    }
  }
  h2 {
    font-size: 2.5em;
    font-weight: 800;
    font-family: $header-font-stack;
  }
  p {
    font-size: 1.15em;
    line-height: 1.5em;
    @media screen and (max-width: $mobile-max-width) {
      overflow-wrap: break-word;
    }
  }
  .index-post-card-more {
    box-sizing: border-box;
    padding: 0.5em 0 0.5em 0;
    position: relative;
    a {
      font-size: 1.35em;
      font-weight: 700;
      &:hover {
        border-bottom: 4px solid $secondary-color;
      }
    }
  }
}

.hide-bottom {
  $light-gradient: linear-gradient(
    to bottom,
    hsla(0, 0, 0, 0),
    hsla(60, 43, 99%, 0.5),
    $default-white 95%
  );
  $dark-gradient: linear-gradient(
    to bottom,
    transparent,
    hsla(0, 0, 6%, 0.5),
    $default-black 95%
  );
  $fade-height: 100px;
  min-height: $fade-height;
  min-width: 100%;
  position: absolute;
  top: -$fade-height;
  z-index: 900;
  &.light {
    background-image: $light-gradient;
  }
  &.dark {
    background-image: $dark-gradient;
  }
  @media (prefers-color-scheme: light) {
    background-image: $light-gradient;
  }
  @media (prefers-color-scheme: dark) {
    background-image: $dark-gradient;
  }
}

.index-post-card-meta {
  align-items: baseline;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 0.9em;
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

  .card-meta-info {
    display: flex;
  }
}
.index-post-excerpt {
  font-size: 16px;
  height: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 1.75em;
    margin: 0.2em 0 0.2em 0;
  }
  code {
    border-radius: 8px;
  }
  pre {
    width: 96%;
    margin: 0 auto;
  }
}
</style>
