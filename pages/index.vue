<template>
  <main id="posts-carousel">
    <ul class="posts-list">
      <li v-for="card in cardData" :key="card.path">
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
import PostCard from '~/components/PostCard';
import { generateBlogMeta } from '~/plugins/content-utils';

/**
 * Helper function to extract an excerpt from markdown
 * @param {string} body raw markdown
 * @return {string} stripped markdown excerpt
 */
function extractExcerpt(body) {
  const removeMd = require('remove-markdown');
  return removeMd(body)
    .split(/\s+/g)
    .slice(0, 140)
    .join(' ');
}

export default {
  components: { PostCard },
  asyncData(context) {
    return generateBlogMeta().then((data) => {
      const cardData = data.posts.map((post) => {
        const fm = require(`~/assets/_posts/${post.path}`);
        const excerpt = extractExcerpt(fm.body);
        return {
          path: post.path,
          route: post.route,
          excerpt,
          attributes: fm.attributes,
          markdown: fm.body,
        };
      });
      data.cardData = cardData;
      return data;
    });
  },
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
