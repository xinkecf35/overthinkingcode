const fs = require('fs');
const postsBasePath = './assets/_posts';

/**
 * Returns all contents given filePath
 * @param {string} filePath path of interest
 * @return {Promise<string[]>} promise; contents of directory
 */
function getContentsFromPath(filePath) {
  const options = {
    withFileTypes: true,
  };
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, options, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

/**
 * Returns a list of directory names given a file path
 * @param {string} filePath path of interest
 * @return {string[]} promise; directories in the path
 */
function getDirectoriesFromFilePath(filePath) {
  return getContentsFromPath(filePath)
    .then((contents) => {
      const directories = contents
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
      return directories;
    })
    .catch((err) => {
      throw err;
    });
}

/**
 * Returns a list of file names given a file path
 * @param {string} filePath path of interest
 * @return {string[]} promise, files in the path
 */
function getFilesFromFilePath(filePath) {
  return getContentsFromPath(filePath)
    .then((contents) => {
      const files = contents
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name);
      return files;
    })
    .catch((err) => {
      throw err;
    });
}

/**
 * Returns a list of markdown files given file paths
 * Excludes files starting with underscore
 * @param {string} filePath path of interest
 * @return {string[]} promise, markdown files in the path
 */
function getMarkdownFiles(filePath) {
  const markdownRegex = /(\d{4}-\d{2}-\d{2})-[^_.]+.md/;
  return getFilesFromFilePath(filePath).then((files) => {
    return files.filter((file) => markdownRegex.test(file));
  });
}

/**
 * function to collate and process meta directory
 * returns an object with combined paths and other meta, by subdirectory,
 * functionally by year
 * @param {string} basePath optional; path to posts
 * @return {object} object containing full routes and other meta
 */
function collateMetaPostsDirs(basePath) {
  const yearsPromise = getYearsSubFolders();
  const markdownFilesPromise = yearsPromise.then((years) =>
    Promise.all(years.map((year) => getMarkdownFiles(basePath + '/' + year)))
  );
  const partialMetaPromises = Promise.all([yearsPromise, markdownFilesPromise]);
  const postsMetaPromise = partialMetaPromises.then((results) => {
    const postsMeta = {};
    const years = results[0];
    const markdownFiles = results[1];
    years.forEach((year, i) => {
      const posts = markdownFiles[i];
      postsMeta[year] = posts.map((post) => ({
        route: generateRouteFromFileName(post),
        slug: post,
        path: `${year}/${post}`,
      }));
    });
    return postsMeta;
  });

  return postsMetaPromise;

  /**
   * returns subfolders matching year
   * @return {string[]} array of years subfolders
   */
  function getYearsSubFolders() {
    const yearRegex = /\d{4}/;
    return getDirectoriesFromFilePath(basePath).then((directories) => {
      return directories.filter((directory) => yearRegex.test(directory));
    });
  }

  /**
   * generates route/permalink based on fileName
   * @param {string} fileName file of interest
   * @return {string} generated route
   */
  function generateRouteFromFileName(fileName) {
    const slugRegex = /(\d{4})-(\d{2})-\d{2}-([A-z-]+).md/;
    const matches = fileName.match(slugRegex);
    return '/posts/' + matches.slice(1).join('/');
  }
}

/**
 * Generates meta object for injection into Vue components
 * Meta object is to be used for dynamic data loading
 * @param {string} [basePath=postBasePath] path to _posts directory
 * @return {object} meta object
 */
function generateBlogMeta(basePath = postsBasePath) {
  const postsByYearPromise = collateMetaPostsDirs(basePath);
  return postsByYearPromise.then((postsByYear) => {
    const posts = Object.values(postsByYear).flat();
    const postsSlugs = posts.map((post) => post.slug);
    const years = Object.keys(postsByYear);
    const routes = posts.map((post) => post.route);
    const slugs = posts.map((post) => post.slug);
    const postSlugMap = {};
    routes.forEach((route, idx) => (postSlugMap[route] = postsSlugs[idx]));
    return { basePath, years, postsByYear, routes, slugs, posts, postSlugMap };
  });
}

/**
 * Returns an array of routes for posts dynamic route.
 * @param {string} postDirectoryPath directory containing markdown posts
 * @return {string[]} Promise, array of pre-resolved routes
 */
function getRoutesForGenerate(postDirectoryPath) {
  return generateBlogMeta(postDirectoryPath).then((meta) => meta.routes);
}

export default (app) => {
  return (app.blogMeta = generateBlogMeta('./assets/_posts'));
};

export { getRoutesForGenerate, generateBlogMeta };
