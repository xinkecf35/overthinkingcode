import Mode from 'frontmatter-markdown-loader/mode';
import { getRoutesForGenerate } from './plugins/content-utils';

export default {
  mode: 'universal',
  target: 'static',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Overthinking Code',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/styles/normalize.css',
    '~/node_modules/highlight.js/scss/atom-one-dark-reasonable.scss',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/content-utils.js', mode: 'server' },
    {
      src: '~/plugins/markdown-it.js',
    },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/sitemap',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** router configuration
   */
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/posts/:year/:month/:slug',
        component: resolve(__dirname, 'pages/posts/_post.vue'),
      });
    },
  },
  /*
   ** sitemap configuration
   */
  sitemap: {
    hostname: 'https://overthinkingcode.net',
    routes() {
      return getRoutesForGenerate('./assets/_posts');
    },
  },
  styleResources: {
    scss: ['~/assets/styles/_fonts.scss', '~/assets/styles/_variables.scss'],
  },
  /*
   ** Generate configuration
   */
  generate: {
    routes() {
      return getRoutesForGenerate('./assets/_posts');
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.module.rules.push({
        test: /posts\/.+\.md$/,
        loader: 'frontmatter-markdown-loader',
        options: {
          mode: [Mode.META, Mode.BODY],
        },
      });
      config.node = {
        fs: 'empty',
      };
    },
  },
};
