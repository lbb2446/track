import Vue from 'vue'
import commonTable from '@/components/public/main'

describe('commonTable.vue', () => {
  it('测试点击向后一页跳页', () => {
    const Constructor = Vue.extend(commonTable)
    const vm = new Constructor().$mount()
    vm.$nextTick(_ => {
      const originCurrent = vm.page.current

      const forwardBtn = vm.$el.querySelector('.ivu-icon-ios-arrow-forward')
      forwardBtn.trigger('click')
      const nowCurrent = vm.page.current
      expect(nowCurrent).to.equal(originCurrent + 1)
    })
  })
})
