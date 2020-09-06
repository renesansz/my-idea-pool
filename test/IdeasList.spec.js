import { mount } from '@vue/test-utils'

import IdeasList from '@/components/IdeasList.vue'

describe('IdeasList component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(IdeasList)
    expect(wrapper.vm).toBeTruthy()
  })
})
