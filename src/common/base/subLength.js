/**
 *
 * @param {*} str 字符串
 * @param {*} n 长度（中文全角符号长度为2，英文、数字和半角符号为1）
 */
export default function subLength (str, n) {
  var r = /[^\\x00-\xff]/g
  if (str.replace(r, 'mm').length <= n) {
    return str
  }
  var m = Math.floor(n / 2)
  for (var i = m; i < str.length; i++) {
    if (str.substr(0, i).replace(r, 'mm').length >= n) {
      return str.substr(0, i) + '...'
    }
  }
  return str
}
