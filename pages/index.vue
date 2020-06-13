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
@import '~/assets/styles/global_variables.scss';

#posts-carousel {
  display: flex;
  margin: 1em 0 2em 2em;
  width: 80%;
}
.posts-list {
  list-style: none;
}

.links {
  padding-top: 15px;
}
</style>
