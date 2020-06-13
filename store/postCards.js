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

/**
 * Custom sort function for posts, sort by descending
 * Basically operates on dates
 * @param {object} a first post to compare
 * @param {object} b first post to compare
 * @return {number} difference between the two dates
 */
function comparePostByDate(a, b) {
  const dateA = new Date(a.attributes.date);
  const dateB = new Date(b.attributes.date);
  return dateB - dateA;
}

export const state = () => {
  return [];
};

export const mutations = {
  addCards(state, cards) {
    if (Array.isArray(cards)) {
      cards.forEach((card) => {
        state.push(card);
      });
    }
  },
  sortCards(state) {
    state.sort(comparePostByDate);
  },
};

export const actions = {
  addPostCards({ commit }, posts) {
    if (process.server) {
      const cards = posts.map((post) => {
        const { route, path } = post;
        const { attributes, body } = require(`~/assets/_posts/${path}`);
        const excerpt = extractExcerpt(body);
        return {
          attributes,
          excerpt,
          markdown: body,
          route,
        };
      });
      commit('addCards', cards);
      commit('sortCards');
    }
  },
};
