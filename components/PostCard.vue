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
          <li v-for="tag in tags" :key="tag">
            <nuxt-link :to="{ path: '/tags', query: { tag } }">
              {{ tag }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <p>{{ excerpt }}...</p>
    <nuxt-link :to="page" class="more-link"> More </nuxt-link>
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
.index-post-card {
  font-family: $copy-font-stack;
  margin: 0.5em 0em 2em 0em;
  text-align: left;
  a {
    text-decoration: none;
    font-weight: inherit;
    &:hover {
      border-bottom: 4px solid $secondary-color;
    }
  }
  h2 {
    font-size: 2.5em;
    font-weight: 700;
    font-family: $header-font-stack;
    margin-left: -3px; // hack to make the header look more aligned
    @media screen and (max-width: $mobile-max-width) {
      font-size: 1.75em;
    }
  }
  p {
    font-size: 1.15em;
    line-height: 1.5em;
    margin-bottom: 0.75em;
    @media screen and (max-width: $mobile-max-width) {
      font-size: 1.05em;
      line-height: 1.35em;
      overflow-wrap: break-word;
    }
  }
  .more-link {
    font-size: 1.35em;
    font-weight: 700;
    line-height: 1.35em;
  }
}

.index-post-card-meta {
  align-items: baseline;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 1 em;
  margin-bottom: 0.5em;
  span {
    width: max-content;
    padding: 0.5em 0.5em 0.5em 0em;
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
      padding: 0.5em 0.5em 0.5em 0em;
      a {
        font-weight: 600;
        &:hover {
          border-bottom: 2px solid $secondary-color;
        }
      }
    }
  }

  .card-meta-info {
    display: flex;
    align-content: flex-start;
  }
}
</style>
