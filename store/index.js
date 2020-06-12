import { generateBlogMeta } from '~/plugins/content-utils';

export const state = () => {
  return { postsByYear: [], routes: [], years: [] };
};

export const mutations = {
  addRoutes(state, routes) {
    if (Array.isArray(routes)) {
      state.routes = state.routes.concat(routes);
    } else {
      state.routes.push(routes);
    }
  },
  addPostsByYear(state, paths) {
    state.postsByYear.push(paths);
  },
  setYears(state, years) {
    state.years = years;
  },
};

export const actions = {
  nuxtServerInit({ commit, dispatch }, { req }) {
    return generateBlogMeta().then((data) => {
      commit('addPostsByYear', data.postsByYear);
      commit('addRoutes', data.routes);
      commit('setYears', data.years);
      dispatch('postCards/addPostCards', data.posts);
      dispatch('articles/addPosts', data.posts);
      dispatch('tags/addTags', data.posts);
    });
  },
};
