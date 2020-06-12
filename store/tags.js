export const state = () => {
  return {};
};

export const mutations = {
  addPosts(state, posts) {
    if (Array.isArray(posts)) {
      posts.forEach((post) => {
        const { route, path } = post;
        const { attributes } = require(`~/assets/_posts/${path}`);
        const { tags, title } = attributes;
        tags.forEach((tag) => {
          const meta = { route, title };
          // Following is to check to see if tag already has been assigned
          // Following sytnax is to satisfy ESLint (no-prototype-builtins)
          if ({}.hasOwnProperty.call(state, tag)) {
            state[tag].push(meta);
          } else {
            state[tag] = [meta];
          }
        });
      });
    }
  },
};

export const actions = {
  addTags({ commit }, posts) {
    if (process.server) {
      commit('addPosts', posts);
    }
  },
};
