export function formatDate () {
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
