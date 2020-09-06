/**
 * Parse url for passing GET queries.
 *
 * @param {string} url
 * @param {Object} queryParams
 *
 * @returns {String}
*/
export function urlQueryBuilder(buildURL='', queryParams={}) {
  for (const k in queryParams) {
    if (buildURL.includes('?')) {
      buildURL = `${buildURL}&${k}=${queryParams[k]}`
    } else {
      buildURL = `${buildURL}?${k}=${queryParams[k]}`
    }
  }

  return buildURL
}
