import subLength from '@/common/base/subLength.js'
var expect = require('chai').expect

describe('测试截取字符串', () => {
  it('测试汉字符串的截取', () => {
    return expect(subLength('字fuchuan', 2)).to.equal('字...')
  })
  it('测试英文字符串的截取', () => {
    return expect(subLength('fuchuan字', 2)).to.equal('fu...')
  })
  it('测试汉字英文字符串的截取', () => {
    return expect(subLength('f字uchuan', 2)).to.equal('f字...')
  })
})
