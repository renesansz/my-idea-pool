/**
 * Get API error reason value.
 * It assumes a format of `err.response.data.reason`` otherwise it will return empty string.
 *
 * @param  {Object} err
 *
 * @return {String}
 */
export function getErrorReason (err) {
  return err?.response?.data?.reason || ''
}
