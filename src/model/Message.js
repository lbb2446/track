import {getRoute, getToken, getTime} from './../util/info'

function Queue () {
  this.items = []
}

Queue.prototype = {
  constructor: Queue,
  // 入队
  enqueue: function () {
    var len = arguments.length
    if (len === 0) {
      return
    }
    for (var i = 0; i < len; i++) {
      this.items.push(arguments[i])
    }
  },
  // 出队
  dequeue: function () {
    var result = this.items.shift()
    return typeof result !== 'undefined' ? result : false
  },
  // 队列是否为空
  isEmpty: function () {
    return this.items.length === 0
  },
  // 返回队列长度
  size: function () {
    return this.items.length
  },
  // 清空队列
  clear: function () {
    this.items = []
  },
  // 返回队列
  show: function () {
    return this.items
  }
}

// var que1 = new Queue()
// que1.enqueue(1, 2, 3)
// que1.enqueue({}, 2, 4)
// console.log(que1.dequeue())

export default class Message {
  constructor ({config}) {
    this.queue = new Queue()
    this.isupdate = false
    this.init()
    this.config = config
  }
  sendNoResult (type, obj) {
    let img = new Image()
    img.src = this.config.url + '?v=' + encodeURI(JSON.stringify(obj))
  }

  sendInterval (type, obj) {
    this.queue.enqueue({type, ...obj, token: getToken(), datetime: getTime(), router: getRoute(), appId: this.config.appid})
    this.isupdate = true
  }
  init () {
    setInterval(() => {
      if (this.isupdate === true && window.navigator.onLine === true) {
        this.send()
        this.isupdate = false
      }
    }, 10 * 1000)
  }
  outsend () {
    let img = new Image()
    img.src = this.config.url2 + '?v=' + encodeURI(JSON.stringify({token: getToken(), datetime: getTime(), url: getRoute(), appId: this.config.appid}))
    this.queue.clear()
  }
  send () {
    let img = new Image()
    img.src = this.config.url1 + '?v=' + encodeURI(JSON.stringify(this.queue.show()))
    this.queue.clear()
  }
  track (key, value) {
    let img = new Image()
    img.src = this.config.track + '?v=' + encodeURI(JSON.stringify({token: getToken(), datetime: getTime(), url: getRoute(), appId: this.config.appid, [key]: value}))
  }
}
