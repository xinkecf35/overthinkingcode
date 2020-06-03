<template>
  <div class="container">
    <div>
      <ul class="posts-list">
        <li v-for="card in cardData" :key="card.path">
          <post-card
            :title="card.title"
            :excerpt="card.excerpt"
            :date="card.attributes.date"
            :tags="card.attributes.tags"
          />
        </li>
      </ul>
    </div>
  </div>
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
    .slice(0, 240)
    .replace(/\s+/g, ' ');
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

.posts-list {
  ul {
    list-style: none;
  }
}

.title {
  font-family: $header-font-stack;
  display: block;
  font-weight: 800;
  font-size: 100px;
  color: $primary-color;
  letter-spacing: 1px;
}

.subtitle {
  font-family: $copy-font-stack;
  font-weight: 300;
  font-size: 42px;
  color: $secondary-color;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
