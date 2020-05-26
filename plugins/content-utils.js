const fs = require('fs');

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

module.exports = {
  getContentsFromPath,
  getDirectoriesFromFilePath,
  getFilesFromFilePath,
};
