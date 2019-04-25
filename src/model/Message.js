import {getRoute, getToken, getTime} from './../util/info'
export default class Message {
  constructor ({config}) {
    this.queue = []
    this.isupdate = false
    this.init()
    this.config = config
  }
  sendNoResult (type, obj) {
    let img = new Image()
    img.src = this.config.url + '?v=' + encodeURI(JSON.stringify(obj))
  }

  sendInterval (type, obj) {
    this.queue.push({type, ...obj, token: getToken(), datetime: getTime(), router: getRoute(), appId: this.config.appid})
    this.isupdate = true
  }
  init () {
    setInterval(() => {
      if (this.isupdate === true) {
        this.send()
        this.isupdate = false
      }
    }, 10 * 1000)
  }
  outsend () {
    let img = new Image()
    img.src = this.config.url2 + '?v=' + encodeURI(JSON.stringify({token: getToken(), datetime: getTime(), url: getRoute(), appId: this.config.appid}))
    this.queue = []
  }
  send () {
    let img = new Image()
    img.src = this.config.url1 + '?v=' + encodeURI(JSON.stringify(this.queue))
    this.queue = []
  }
  track (key, value) {
    let img = new Image()
    img.src = this.config.track + '?v=' + encodeURI(JSON.stringify({token: getToken(), datetime: getTime(), url: getRoute(), appId: this.config.appid, [key]: value}))
  }
}
