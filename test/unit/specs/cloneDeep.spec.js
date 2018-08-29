import cloneDeep from '@/js/base/cloneDeep.js'
var expect = require('chai').expect

describe('测试深拷贝', () => {
  it('测试null', () => {
    return expect(cloneDeep(null)).to.eql(null)
  })
  it('测试字符串', () => {
    return expect(cloneDeep('null')).to.eql('null')
  })
  it('测试对象深拷贝', () => {
    let obj = {
      foo: 'f',
      bar: {
        baz: 'bz'
      }
    }
    let newObj = cloneDeep(obj)
    newObj.foo = 'f1'
    return expect(newObj).to.not.eql(obj)
  })
})
