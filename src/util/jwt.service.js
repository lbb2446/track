const ID_TOKEN_KEY = 'lstoken'

export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY)
}

export const saveToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY, token)
  document.cookie = `${ID_TOKEN_KEY}=${token}`// token放在cookies里，测试后端是否可以拿到这个token
}

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY)
}

export default { getToken, saveToken, destroyToken }
