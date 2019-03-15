function getRoute () {
  return encodeURI(window.location.host + '' + window.location.hash.replace(/#/g, '@').replace(/&/g, '!'))
}
function getTime () {
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
function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
function getToken () {
  return localStorage.getItem('lstoken')
}
function htmlEncode (str) {
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
class Collector {
  constructor ({message}) {
    this.token = 'token'
    this.timeline1 = message
    this.message = message
    this.methods = {}
  }
  config () {

  }
  setUserToken (value) { // 给外部一个可以主动设置token的口子
    localStorage.setItem('lstoken', value)
  }
  add (type, fn) {
    this.methods[type] = fn
    if (type === 'timeline') {
      fn(this.timeline1.sendInterval.bind(this.timeline1))
    } else if (type === 'firstload') {
      fn(this.message.sendNoResult)
    } else {
      // console.warn(type, this)
      fn(this.message.send)
    }
  }
  send (type, fn) {
    fn(this.message.sendNoResult)
  }
  track (type, fn) {
    this.message.send(type, {result: fn})
    // fn.call(this)
  }
  outsend () {
    this.message.outsend()
  }
}
let Config = {
  url: 'http://47.99.132.211:10068/t2/c.jpg',
  url1: 'http://47.99.132.211:10068/t1/c.jpg', //
  url2: 'http://47.99.132.211:10068/leave/c.jpg', // 离开时
  version: '1.0.7', // 插件版本
  appid: 'test',
  uuid: '',
  isdebugger: false
}
function Log (content) {
  if (Config.isdebugger === true) {
    console.log(content)
  }
}

// 消息 考虑到在异步的时候可能会存在一些信息顺序的原因，后续可能改造成简单的队列
class Message {
  constructor () {
    this.queue = []
    this.isupdate = false
    this.init()
  }
  sendNoResult (type, obj) {
    let img = new Image()
    img.src = Config.url + '?v=' + encodeURI(JSON.stringify(obj))
  }

  sendInterval (type, obj) {
    this.queue.push({type, ...obj, token: getToken(), datetime: getTime(), router: getRoute(), appId: Config.appid})
    this.isupdate = true
  }
  init () {
    setInterval(() => {
      if (this.isupdate === true) {
        this.send()
        this.isupdate = false
      }
    }, 10000)
  }
  outsend () {
    let img = new Image()
    img.src = Config.url2 + '?v=' + encodeURI(JSON.stringify({token: getToken(), datetime: getTime(), url: getRoute(), appId: Config.appid}))
    this.queue = []
  }
  send () {
    let img = new Image()
    img.src = Config.url1 + '?v=' + encodeURI(JSON.stringify(this.queue))
    this.queue = []
  }
}
let a = new Collector({message: new Message()})

function formatDate () {
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

// firstload 是否需要转换成常量  是否需要分成抽象的大类
/**
 *
 *
 */
function mixCode (object) {
  return object
}
function _init () {
  a.add('firstload', (m) => {
    let timing = performance.timing
    let start = timing.navigationStart
    let dnsTime = 0
    let tcpTime = 0
    let firstPaintTime = 0
    let domRenderTime = 0
    let loadTime = 0

    dnsTime = timing.domainLookupEnd - timing.domainLookupStart
    tcpTime = timing.connectEnd - timing.connectStart
    firstPaintTime = timing.responseStart - start
    domRenderTime = timing.domContentLoadedEventEnd - start
    loadTime = timing.loadEventEnd - start
    // DNS解析时间、TCP建立连接时间、首页白屏时间、dom渲染完成时间、页面onload时间等
    if (!localStorage.getItem('lstoken')) {
      localStorage.setItem('lstoken', guid())
    }
    var UA = require('ua-device')
    var UAoutput = new UA(navigator.userAgent)
    let info = {
      a: {'dnsTime': dnsTime, // time
        'tcpTime': tcpTime,
        'firstPaintTime': firstPaintTime,
        'domRenderTime': domRenderTime,
        'loadTime': loadTime},
      b: {// user
        date: formatDate(), // 本地时间戳
        title: document.title, // 需要读取到SPA的title
        url: getRoute(), // url会不会太长 到时候需要截取
        width: window.innerWidth,
        height: window.innerHeight,
        token: localStorage.getItem('lstoken')// 本地生成一个缓存，可以一直识别某用户
      },
      c: {// system
        'userAgent': navigator.userAgent,
        browserName: UAoutput.browser.name,
        browserVersion: UAoutput.browser.version.original,
        engineName: UAoutput.engine.name,
        engineVersion: UAoutput.engine.version.original,
        osName: UAoutput.os.name,
        osVersion: UAoutput.os.version.original,
        deviceManufacturer: UAoutput.device.manufacturer,
        deviceModel: UAoutput.device.model,
        deviceType: UAoutput.device.type
        // 操作系统/设备 JS引擎 浏览器 是否PC
      },
      d: {// system
        uuid: Config.uuid,
        v: Config.version, // 插件版本
        appId: Config.appid// 服务器注册的应用id
      }
    }
    m('systeminfo', mixCode(info))
  })
  a.add('timeline', (m) => { // 含一些图片
    // let entryTimesList = []
    let entryList = window.performance.getEntries()
    entryList.forEach((item, index) => {
      let templeObj = {}
      // 'fetch', 'xmlhttprequest'
      let usefulType = ['script', 'css', 'link', 'img']
      if (usefulType.indexOf(item.initiatorType) > -1) {
        templeObj.name = item.name.replace(/#/g, '@').replace(/&/g, '!')
        templeObj.nextHopProtocol = item.nextHopProtocol
        // dns查询耗时
        templeObj.dnsTime = item.domainLookupEnd - item.domainLookupStart
        // tcp链接耗时
        templeObj.tcpTime = item.connectEnd - item.connectStart
        // 请求时间
        templeObj.reqTime = item.responseEnd - item.responseStart
        // 重定向时间
        templeObj.redirectTime = item.redirectEnd - item.redirectStart
        // console.log(templeObj)
        m('source', templeObj)
        // entryTimesList.push(templeObj)
      }
    })
    // 循环发送
    // m('source', {'资源': entryTimesList})
  })
  // a.add('timeline', (m) => { // http
  //   (function () {
  //     var origOpen = XMLHttpRequest.prototype.open
  //     XMLHttpRequest.prototype.open = function (e, f) {
  //       this.addEventListener('load', function (d) {
  //         // console.log(this, e, f, d)
  //         m('ajax', {
  //           state: this.readyState,
  //          // result: this.responseText,
  //           methods: e,
  //           params: '',
  //           url: htmlEncode(f),
  //           elapsedTime: 0
  //         })
  //       })
  //       origOpen.apply(this, arguments)
  //     }
  //   })()
  // })
  a.add('timeline', (m) => { // click
    document.addEventListener('click', function (e) { // 有一个问题 是否需要监听所有类型的时间
      Log(e)
      m('click', {
        name: e.target.nodeName,
        text: e.target.innerText,
        html: '', // e.target.nodeName === 'HTML' ? '' : htmlEncode(e.target.innerHTML),
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
        pagex: e.x / window.innerWidth,
        pagey: e.screenY / document.body.clientHeight})
    })
  })
  a.add('outpage', (m) => {
    window.onbeforeunload = function () {
      a.outsend()
      // 把没上传的东西上传
      // 发起一次新的离开请求
    }
  })
  a.add('timeline', (m) => {
    var _wr = function (type) {
      var orig = history[type]
      return function () {
        var rv = orig.apply(this, arguments)
        var e = new Event(type)
        e.arguments = arguments
        window.dispatchEvent(e)
        return rv
      }
    }
    history.pushState = _wr('pushState')
    history.replaceState = _wr('replaceState')

    addEvent(window, 'load', function (e) {
      m('router', { title: document.title, // 需要读取到SPA的title
        url: htmlEncode(window.location.href)})
    })
    // 监控history基础上实现的单页路由中url的变化
    addEvent(window, 'replaceState', function (e) {
      m('router', { title: document.title, // 需要读取到SPA的title
        url: htmlEncode(window.location.href)})
    })
    addEvent(window, 'pushState', function (e) {
      m('router', { title: document.title, // 需要读取到SPA的title
        url: htmlEncode(window.location.href)})
    })
    // 通过hash切换来实现路由的场景
    addEvent(window, 'hashchange', function (e) {
      m('router', { title: document.title, // 需要读取到SPA的title
        url: htmlEncode(window.location.href)})
    })
    addEvent(document, 'visibilitychang', function (e) {
      m('router', { title: document.title, // 需要读取到SPA的title
        url: htmlEncode(window.location.href)})
    })

    function addEvent (a, b, c) {
      a.addEventListener(b, c)
    }
  })
}

window.a = a
export let track = a.track.bind(a)
export let init = ({uuid, appid}) => {
  Config.uuid = uuid
  Config.appid = appid
  Log(Config)
  _init()
}
