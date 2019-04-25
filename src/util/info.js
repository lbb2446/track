export function getRoute () {
  return encodeURI(window.location.host + '' + window.location.hash.replace(/#/g, '@').replace(/&/g, '!'))
}
export function getTime () {
  var d = new Date()
  return (
    d.getFullYear() + '/' +
      ('00' + (d.getMonth() + 1)).slice(-2) + '/' +
      ('00' + d.getDate()).slice(-2) +
      ' ' +
      ('00' + d.getHours()).slice(-2) + ':' +
      ('00' + d.getMinutes()).slice(-2) + ':' +
      ('00' + d.getSeconds()).slice(-2)
  )
}
export function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
export function getToken () {
  return localStorage.getItem('lstoken')
}
export function htmlEncode (str) {
  var s = ''
  if (str.length === 0) return ''
  s = str.replace(/&/g, '!')
  // s = s.replace(/</g, '&lt;')
  // s = s.replace(/>/g, '&gt;')
  s = s.replace(/#/g, '@')
  // s = s.replace(/ /g, '&nbsp;')
  // s = s.replace(/\\'/g, '&#39;')
  // s = s.replace(/\\"/g, '&quot;')
  // s = s.replace(/\n/g, '<br>')
  return s
}
