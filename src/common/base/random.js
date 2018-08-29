export default function _random (min = 0, max) { // [min/0,max]之间的随机整数
  if (typeof (max) === 'undefined') {
    max = min
    min = 0
  }
  return Math.floor(Math.random() * (max - min + 1) + min)
}
