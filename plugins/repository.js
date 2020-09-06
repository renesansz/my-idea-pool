import createRepository from '@/utils/repository'

export default (ctx, inject) => {
  const repositoryWithAxios = createRepository(ctx.$axios)

  // Add new repository as necessary
  inject('ideasRepository', repositoryWithAxios('/ideas'))
}
