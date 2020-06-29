/**
 * Module/Plugin to inject markdown-it plugin globally into Vue/Nuxt Instance
 */

const md = require('markdown-it')({
  linkify: true,
  typographer: true,
}).use(require('markdown-it-highlightjs'), {
  auto: true,
  code: true,
  register: null,
});

export default (context, inject) => {
  inject('md', md);
  context.$md = md;
};
