<template>
  <main id="posts-carousel">
    <!-- <ul class="posts-list">
      <li v-for="card in cardData" :key="card.path">
        <post-card
          :date="card.attributes.date"
          :excerpt="card.excerpt"
          :page="card.route"
          :tags="card.attributes.tags"
          :title="card.attributes.title"
        />
      </li>
    </ul> -->
  </main>
</template>

<script>
import { mapState } from 'vuex';
// import PostCard from '~/components/PostCard';

export default {
  // components: { PostCard },
  asyncData(context) {
    // return generateBlogMeta().then((data) => {
    //   const cardData = data.posts.map((post) => {
    //     const fm = require(`~/assets/_posts/${post.path}`);
    //     const excerpt = extractExcerpt(fm.body);
    //     return {
    //       path: post.path,
    //       route: post.route,
    //       excerpt,
    //       attributes: fm.attributes,
    //       markdown: fm.body,
    //     };
    //   });
    //   data.cardData = cardData;
    //   return data;
    // });
  },
  computed: mapState(['routes', 'posts']),
};
</script>

<style lang="scss">
@import '~/assets/styles/global_variables.scss';

#posts-carousel {
  flex: 2 1 auto;
  overflow: auto;
}

.posts-list {
  list-style: none;
}

.links {
  padding-top: 15px;
}
</style>
