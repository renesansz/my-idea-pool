import { urlQueryBuilder } from '@/utils/request'

export default $axios => path => ({
  fetch(queryParams = {}) {
    return $axios.get(urlQueryBuilder(path, queryParams))
  },
  find(id, queryParams = {}) {
    return $axios.get(urlQueryBuilder(`${path}/${id}`, queryParams))
  },
  create(payload = {}) {
    return $axios.post(path, payload)
  },
  update(id, payload = {}) {
    return $axios.put(`${path}/${id}`, payload)
  },
  delete(id) {
    return $axios.delete(`${path}/${id}`)
  },
})
