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

export const state = () => {
  return { posts: [], routes: [], tags: [] };
};

export const mutations = {
  addRoutes(state, routes) {
    state.routes.push(routes);
  },
  addPosts(state, paths) {
    state.posts.push(paths);
  },
};

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    return generateBlogMeta().then((data) => {
      commit('addRoutes', data.routes);
      commit('addPosts', data.posts);
    });
  },
};
