/**
 *
 * @param {string} name 使用的校验方法名
 */
export default function _validate (name) {
  const obj = {
    // 手机号
    mobile (value) {
      return /^1[345789]\d{9}$/.test(value)
    },
    // 固定电话
    fixedLine (value) {
      return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value)
    },
    // 邮箱
    email (value) {
      return /^[a-zA-Z\d]+([-_.][a-zA-Z\d]+)*@[a-zA-Z\d]+\.[a-zA-Z\d]{2,4}$/.test(value)
    },
    // 邮编
    postcode (value) {
      return /^[1-9]\d{5}$/.test(value)
    },
    // 传真
    fax (value) {
      return /^(\d{3,4}-)?\d{7,8}$/.test(value)
    },
    // 字母数字下划线
    characterClass (value) {
      return /(^[A-Za-z0-9_]+$)/.test(value)
    },
    // 中文
    chinese (value) {
      return /^[\u4E00-\u9FA5]$/.test(value)
    },
    // 身份证
    idNumber (value) {
      let re = /^\d{17}(\d|X|x)$/
      let idNum = value.toUpperCase() || ''
      if (re.test(idNum)) {
        let weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 十七位数字本体码权重
        let validate = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // mod11,对应校验码字符值
        let sum = 0
        let mode = 0
        let id17 = idNum.substring(0, 17)
        for (let i = 0; i < 17; i++) {
          sum = sum + parseInt(id17.substring(i, i + 1) * weight[i])
        }
        mode = sum % 11
        return idNum[17] === validate[mode]
      } else {
        return false
      }
    }
  }
  return obj[name]
}
