import isEmpty from '@/js/base/isEmpty.js'
var expect = require('chai').expect

describe('非空函数验证,非空值为false', () => {
  it('null为true', () => {
    return expect(isEmpty(null)).to.be.true
  })
  it('undefined为true', () => {
    return expect(isEmpty(undefined)).to.be.true
  })
  it('数字0为false', () => {
    return expect(isEmpty(0)).to.be.false
  })
  it('数字1为false', () => {
    return expect(isEmpty(1)).to.be.false
  })
  it('空字符串为true', () => {
    return expect(isEmpty('')).to.be.true
  })
  it('空数组为true', () => {
    return expect(isEmpty([])).to.be.true
  })
  it('空对象为true', () => {
    return expect(isEmpty({})).to.be.true
  })
})
