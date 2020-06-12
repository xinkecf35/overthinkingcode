export const state = () => {
  return {};
};

export const mutations = {
  addContentFromPosts(state, posts) {
    if (process.server) {
      if (Array.isArray(posts)) {
        addPostsContentMap(posts, state);
      }
    }
  },
};

/**
 * Helper function to add an array of posts to contentMap state
 * @param {object[]} posts array of posts
 * @param {*} contentMap map that posts are being added to.
 */
function addPostsContentMap(posts, contentMap) {
  posts.forEach((post) => {
    addPostToContentMap(post, contentMap);
  });
}

/**
 * Helper Function to add a post object to contentMap state
 * @param {object} post post to be added
 * @param {*} contentMap contentMap that post is to be added to
 */
function addPostToContentMap(post, contentMap) {
  const { route, path } = post;
  const markdown = require(`~/assets/_posts/${path}`);
  const meta = markdown.attributes;
  contentMap[route] = {
    author: meta.author,
    content: markdown.body,
    date: meta.date,
    tags: markdown.attributes.tags,
    title: markdown.attributes.title,
  };
}

export const actions = {
  addPosts({ commit }, posts) {
    if (process.server) {
      commit('addContentFromPosts', posts);
    }
  },
};
