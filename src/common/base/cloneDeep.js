export default function _cloneDeep (value) {
  if (value === null) return null
  if (typeof value !== 'object') return value
  if (value.constructor === Date) return new Date(value)
  if (value.constructor === RegExp) return new RegExp(value)
  var newObj = new value.constructor() // 保持继承链
  for (var key in value) {
    if (value.hasOwnProperty(key)) { // 不遍历其原型链上的属性
      var val = value[key]
      newObj[key] = typeof val === 'object' ? _cloneDeep(val) : val
    }
  }
  return newObj
}
