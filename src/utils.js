/** @module utils */

/**
 * Shrinks the @param path, leaving only the file name
 * @param {string} path The string path to be reduced
 * @returns {string} A new string, now shrunk
 */
function shrinkPath(path) {
  var newPath = new String(path);
  
  for (var i = newPath.length; i >= 0; i--) {
    if (newPath.charAt(i) == '/' || newPath.charAt(i) == '\\')
      break;
  }
  if(i >= 0)
    return new String("...").concat(newPath.substring(i));
  
  return new String(".../").concat(newPath);
}

module.exports = {
  shrinkPath: shrinkPath
}