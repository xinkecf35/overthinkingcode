<template>
  <main id="tags-main" :class="getColorScheme">
    <h1>Tags</h1>
    <ul>
      <li v-for="tag in Object.keys(tags)" :id="tag" :key="tag">
        <section class="tags-list" :class="{ active: tag === activeTag }">
          <h2>
            <button type="button" @click="activeTag = tag">{{ tag }}</button>
          </h2>
          <ul class="tags-list" :class="{ active: tag === activeTag }">
            <li v-for="post in tags[tag]" :key="post.id">
              <nuxt-link :to="post.route">{{ post.title }} </nuxt-link>
            </li>
          </ul>
        </section>
      </li>
    </ul>
  </main>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return { activeTag: '' };
  },
  computed: {
    ...mapGetters(['getColorScheme']),
    ...mapState(['tags']),
  },
  watch: {
    '$route.query.tag': {
      deep: true,
      immediate: true,
      handler(tag) {
        this.activeTag = tag;
      },
    },
  },
};
</script>

<style lang="scss">
#tags-main {
  box-sizing: border-box;
  color: inherit;
  margin: 2em 0 20vh 0;
  max-width: $content-max-width;
  text-align: left;
  width: 80%;
  button {
    background-color: inherit;
    border: none;
    color: inherit;
    font-weight: inherit;
  }
  h1 {
    font-size: 2.75em;
    font-weight: 800;
  }
  h2 {
    color: $primary-color;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  &.dark {
    h2 {
      color: $secondary-color;
    }
  }
  @media (prefers-color-scheme: dark) {
    h2 {
      color: $secondary-color;
    }
  }
}

.tags-list {
  list-style: none;
  h2 {
    font-size: 1.75em;
    line-height: 1.85em;
    font-weight: 700;
    margin-bottom: 0.25em;
    width: min-content;
    &:hover {
      border-bottom: 4px solid $secondary-color;
      margin-bottom: calc(0.25em - 4px);
    }
  }
  ul {
    font-size: 1.25em;
    height: 0;
    padding-left: 1.5em !important;
    margin-bottom: 0.5em;
    visibility: hidden;
    li {
      padding: 0.25em 0 0.25em 0;
    }
    &.active {
      width: 100%;
      height: auto;
      visibility: visible;
    }
  }
}
</style>
