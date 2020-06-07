<template>
  <div class="index-post-card">
    <nuxt-link :to="page">
      <h2>{{ title }}</h2>
    </nuxt-link>
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
    <p>{{ excerpt }} ...</p>
  </div>
</template>

<script>
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
  },
};
</script>

<style lang="scss">
@import '~/assets/styles/global_variables.scss';

.index-post-card {
  font-family: $copy-font-stack;
  margin: 0.5em 0em 2em 0em;
  text-align: justify;
  h2 {
    font-size: 2.5em;
    font-weight: 700;
    font-family: $header-font-stack;
  }
  p {
    font-size: 16px;
    line-height: 1.5;
  }
}

.index-post-card-meta {
  align-items: baseline;
  display: flex;
  flex-direction: row;
  font-size: 14px;
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

  .card-meta-info {
    display: flex;
  }
}
</style>
