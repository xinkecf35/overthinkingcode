<template>
  <main id="tags-main">
    <h1>Tags</h1>
    <ul>
      <li v-for="tag in Object.keys(tags)" :key="tag">
        <section class="tags-list">
          <h2 @click="activeTag = tag">{{ tag }}</h2>
          <ul :class="{ active: tag === activeTag }">
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
import { mapState } from 'vuex';

export default {
  data() {
    return { activeTag: '' };
  },
  computed: mapState(['tags']),
};
</script>

<style lang="scss">
#tags-main {
  box-sizing: border-box;
  margin: 2em;
  max-width: 1024px;
  text-align: left;
  width: 80%;
  h1 {
    font-size: 2.75em;
  }
  ul {
    list-style: none;
  }
}
.tags-list {
  list-style: none;
  h2 {
    font-size: 1.75em;
    line-height: 1.75em;
  }
  ul {
    font-size: 1.25em;
    height: 0;
    margin-bottom: 0.5em;
    visibility: hidden;
    &.active {
      height: auto;
      visibility: visible;
    }
  }
}
</style>
