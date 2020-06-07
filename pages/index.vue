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
    cards: (state) => state.postCards.cards,
  }),
};
</script>

<style lang="scss">
@import '~/assets/styles/global_variables.scss';

#posts-carousel {
  display: flex;
  flex: 2 1 auto;
  overflow: auto;
  margin: 1em 2em 1em 2em;
}
.posts-list {
  list-style: none;
}

.links {
  padding-top: 15px;
}
</style>
