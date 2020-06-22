<template>
  <main id="posts-carousel">
    <ul class="posts-list">
      <li v-for="card in cards" :key="card.path">
        <post-card
          :date="card.attributes.date"
          :excerpt="card.excerpt"
          :page="card.route"
          :tags="card.attributes.tags"
          :title="card.attributes.title"
        />
      </li>
    </ul>
  </main>
</template>

<script>
import { mapState } from 'vuex';
import PostCard from '~/components/PostCard';

export default {
  components: { PostCard },
  computed: mapState({
    routes: 'routes',
    cards: (state) => state.postCards,
    tags: (state) => state.tags,
  }),
};
</script>

<style lang="scss">
#posts-carousel {
  box-sizing: border-box;
  width: 80%;
  margin-top: 1em;
  max-width: $content-max-width;
  @media screen and (max-width: $mobile-max-width) {
    width: 90%;
  }
}
.posts-list {
  list-style: none;
  margin-bottom: 20vh;
  padding: 0;
}

.links {
  padding-top: 15px;
}
</style>
