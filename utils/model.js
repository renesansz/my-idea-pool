/**
 * Get value of the specified key in the object, else return default value if not found.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {Any} defaultValue
 *
 * @returns {Any}
*/
export function getPropertyOrDefault (obj = Object, key, defaultValue = null) {
  return (key in obj) ? obj[key] : defaultValue
}

/**
 * Shorthand function for initializing list of items to a specific model.
 *
 * @param  {Array}  list
 * @param  {Function|Class} ModelClass
 *
 * @return {Array[Function|Class]}
 */
export function initializeListWithModel (list = [], ModelClass) {
  return (ModelClass) ? list.map(item => new ModelClass(item)) : list
}
