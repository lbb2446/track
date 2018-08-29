import validate from '@/common/base/validate.js'
var expect = require('chai').expect

describe('测试校验类', () => {
  it('测试错误手机号', () => {
    return expect(validate('mobile')('12345678910')).to.be.false
  })
  it('测试正确手机号', () => {
    return expect(validate('mobile')('13777566666')).to.be.true
  })
  it('测试错误固定电话', () => {
    return expect(validate('fixedLine')('12345678910')).to.be.false
  })
  it('测试正确固定电话', () => {
    return expect(validate('fixedLine')('010-88888888')).to.be.true
  })
  it('测试错误邮箱', () => {
    return expect(validate('email')('12345678910')).to.be.false
  })
  it('测试正确邮箱', () => {
    return expect(validate('email')('56@qq.com')).to.be.true
  })
  it('测试错误邮编', () => {
    return expect(validate('postcode')('000000')).to.be.false
  })
  it('测试正确邮编', () => {
    return expect(validate('postcode')('311600')).to.be.true
  })
  it('测试错误字母数字下划线', () => {
    return expect(validate('characterClass')('a1_自')).to.be.false
  })
  it('测试正确字母数字下划线', () => {
    return expect(validate('characterClass')('a1_')).to.be.true
  })
  it('测试错误中文', () => {
    return expect(validate('chinese')('a1_自')).to.be.false
  })
  it('测试正确中文', () => {
    return expect(validate('chinese')('自')).to.be.true
  })
  it('测试错误身份证', () => {
    return expect(validate('idNumber')('330182199309211921')).to.be.false
  })
  it('测试正确身份证', () => {
    return expect(validate('idNumber')('500225199002260015')).to.be.true
  })
})
