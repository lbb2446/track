import random from '@/common/base/random.js'
var expect = require('chai').expect

describe('随机数测试', () => {
  it('输入0.1~0.6，产生整数', () => {
    return expect(random(0.1, 0.6)).to.be.at.least(0)
  })
  it('产生一个1000~10000的随机数', () => {
    return expect(random(1000, 10000)).to.be.within(1000, 10000)
  })
})
