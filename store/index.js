import { generateBlogMeta } from '~/plugins/content-utils';

export const state = () => {
  return {
    postsByYear: [],
    routes: [],
    years: [],
    prefersDarkMode: null,
    useSystemScheme: true,
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
  setSystemScheme(state, mode) {
    state.useSystemScheme = mode;
    if (state.useSystemScheme) {
      state.prefersDarkMode = null;
      state.colorScheme = null;
      localStorage.removeItem('color-mode');
    }
  },
  setColorScheme(state, mode) {
    state.prefersDarkMode = mode;
    mode ? (state.colorScheme = 'dark') : (state.colorScheme = 'light');
    state.useSystemScheme = false;
    localStorage.setItem('color-mode', state.colorScheme);
  },
  getPreferredColorScheme(state) {
    if (!process.server) {
      const storedColorMode = localStorage.getItem('color-mode');
      if (storedColorMode !== null) {
        state.colorScheme = storedColorMode;
        state.colorScheme === 'dark'
          ? (state.prefersDarkMode = true)
          : (state.prefersDarkMode = false);
        state.useSystemScheme = false;
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
  setUseSystemScheme({ commit }, mode) {
    commit('setSystemScheme', mode);
    if (mode) {
      commit('getPreferredColorScheme');
    }
  },
  setColorMode({ commit }, mode) {
    commit('setColorScheme', mode);
    commit('setSystemScheme', false);
  },
};
