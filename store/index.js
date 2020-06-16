import { generateBlogMeta } from '~/plugins/content-utils';

export const state = () => {
  return {
    postsByYear: [],
    routes: [],
    years: [],
    prefersDarkMode: null,
    colorScheme: null,
  };
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
  setColorScheme(state, mode) {
    state.prefersDarkMode = mode;
    mode ? (state.colorScheme = 'dark') : (state.colorScheme = 'light');
    localStorage.setItem('color-mode', state.colorScheme);
  },
  getPreferredColorScheme(state) {
    if (!process.server) {
      const storedColorMode = localStorage.getItem('color-mode');
      // eslint-disable-next-line no-console
      console.log(storedColorMode);
      if (storedColorMode !== null) {
        state.colorScheme = storedColorMode;
        state.colorScheme === 'dark'
          ? (state.prefersDarkMode = true)
          : (state.prefersDarkMode = false);
        return;
      }
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        state.prefersDarkMode = true;
      }
    }
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
