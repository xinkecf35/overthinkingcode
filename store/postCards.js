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

export const state = () => {
  return {
    cards: [],
  };
};

export const mutations = {
  addCards(state, cards) {
    if (Array.isArray(cards)) {
      cards.forEach((card) => {
        state.cards.push(card);
      });
    }
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
    }
  },
};
