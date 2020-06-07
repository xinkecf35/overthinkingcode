import { generateBlogMeta } from '~/plugins/content-utils';

/* Reference for data, remove before commit
 data: {
   cardData: [
     {
       attributes: {},
       excerpt: '',
       markdown: '',
       route: '',
       path: '',
     },
     ...
   ],
   posts: [
     {
       path: '',
       route: '',
       slug: '',
     },
     ...
   ],
   postsByYear: [
     'year': [
       {
         post: '',
         route: '',
         slug: '',
       }
       ...
     ],
     ...
   ],
   routePathMap: {
     'route': 'path',
     ...
   }
   routes: [
     'page/route/slug',
     ...
   ],
   slug: [
     'slug',
     ...
   ],
   years: [
     '1970',
     ...
   ]
 }
 */

export const state = () => {
  return { postsByYear: [], routes: [], tags: [], years: [] };
};

export const mutations = {
  addRoutes(state, routes) {
    state.routes.push(routes);
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
    });
  },
};
