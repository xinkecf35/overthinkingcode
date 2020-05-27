const fs = require('fs');

const postsBasePath = '~/assets/_posts';

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
function getMarkdownFilesFromFilePath(filePath) {
  const markdownRegex = /(\d{4}-\d{2}-\d{2})-[^_.]+.md/;
  return getFilesFromFilePath(filePath).then((files) => {
    return files.filter((file) => markdownRegex.test(file));
  });
}

/**
 * function to collate and process meta _post directory
 * returns an object with combined paths and other meta
 * @param {string} [basePath=postsBasePath] optional; path to posts
 * @return {object} object containing full routes and other meta
 */
function collateMetaFromPostsDir(basePath = postsBasePath) {
  const yearsPromise = getYearsSubFoldersFromFilePath();
  const postsForYearPromise = yearsPromise.then((years) => {
    return Promise.all(
      years.map((year) => {
        const yearPath = basePath + '/' + year;
        return getMarkdownFilesFromFilePath(yearPath);
      })
    );
  });
  return Promise.all([yearsPromise, postsForYearPromise]).then((results) => {
    const years = results[0];
    const postsByYear = {};
    years.forEach((year, i) => {
      postsByYear[year] = results[1][i];
    });

    const fullPaths = [];
    years.forEach((year) => {
      const posts = postsByYear[year];
      posts.forEach((post) => {
        const concatPath = basePath + '/' + year + '/' + post;
        fullPaths.push(concatPath);
      });
    });
    return {
      basePath,
      years,
      postsByYear,
      fullPaths,
    };
  });

  /**
   * returns subfolders matching year
   * @return {string[]} array of years subfolders
   */
  function getYearsSubFoldersFromFilePath() {
    const yearRegex = /\d{4}/;
    return getDirectoriesFromFilePath(basePath).then((directories) => {
      return directories.filter((directory) => yearRegex.test(directory));
    });
  }
}

module.exports = {
  getContentsFromPath,
  getDirectoriesFromFilePath,
  getFilesFromFilePath,
  collateMetaFromPostsDir,
};
