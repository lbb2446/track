function getRoute () {
  return encodeURI(window.location.href.replace('#', '@'))
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
  s = str.replace(/&/g, '!;')
  // s = s.replace(/</g, '&lt;')
  // s = s.replace(/>/g, '&gt;')
  s = s.replace(/#/g, '@;')
  // s = s.replace(/ /g, '&nbsp;')
  // s = s.replace(/\\'/g, '&#39;')
  // s = s.replace(/\\"/g, '&quot;')
  // s = s.replace(/\n/g, '<br>')
  return s
}
class Collector {
  constructor ({message}) {
    this.token = '123'
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
}

// 消息 考虑到在异步的时候可能会存在一些信息顺序的原因，后续可能改造成简单的队列
class Message {
  constructor () {
    this.timeline = []
    this.isupdate = false
    this.init()
  }
  sendNoResult (type, obj) {
    let img = new Image()
    // console.log(JSON.stringify(obj))
    img.src = 'http://47.99.132.211:10068/t2/c.jpg?v=' + encodeURI(JSON.stringify(obj))
    // console.warn({type, ...obj})
  }

  sendInterval (type, obj) {
    this.timeline.push({type, ...obj, token: getToken(), datetime: getTime(), router: getRoute()})
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
  send () {
    // jsonp({url: 'http://47.99.132.211:10068/t1/c',
    //   callback: 'lbb',
    //   data: {v: JSON.stringify(this.timeline)},
    //   time: 20000,
    //   success () {
    //     console.log('成功')
    //   }})
    let img = new Image()
    // console.log(JSON.stringify(obj))
    img.src = 'http://47.99.132.211:10068/t1/c.jpg?v=' + encodeURI(JSON.stringify(this.timeline))
    this.timeline = []
    // console.table(this.timeline)
  }
}
// 定时上传的行为链
// class TimeLine {
//   constructor () {
//     this.timeline = []
//     this.init()
//   }
//   add (type, obj) {
//     this.timeline.push({type, ...obj, token: getToken(), datetime: getTime(), router: getRoute()})
//     this.isupdate = true
//   }
//   init () {
//     setInterval(() => {
//       if (this.isupdate === true) {
//         this.send()
//         this.isupdate = false
//       }
//     }, 30000)
//   }
//   send () {
//     // jsonp({url: 'http://47.99.132.211:10068/t1/c',
//     //   callback: 'lbb',
//     //   data: {v: JSON.stringify(this.timeline)},
//     //   time: 20000,
//     //   success () {
//     //     console.log('成功')
//     //   }})
//     let img = new Image()
//     // console.log(JSON.stringify(obj))
//     img.src = 'http://47.99.132.211:10068/t1/c?v=' + encodeURI(JSON.stringify(this.timeline))
//     this.timeline = []
//     // console.table(this.timeline)
//   }
// }
// function jsonp (options) {
//   options = options || {}
//   if (!options.url || !options.callback) {
//     throw new Error('参数不合法')
//   }

//   // 创建 script 标签并加入到页面中
//   var callbackName = ('jsonp_' + Math.random()).replace('.', '')
//   var oHead = document.getElementsByTagName('head')[0]
//   options.data[options.callback] = callbackName
//   var params = formatParams(options.data)
//   var oS = document.createElement('script')
//   oHead.appendChild(oS)

//   // 创建jsonp回调函数
//   window[callbackName] = function (json) {
//     oHead.removeChild(oS)
//     clearTimeout(oS.timer)
//     window[callbackName] = null
//     options.success && options.success(json)
//   }

//   // 发送请求
//   oS.src = options.url + '?' + params

//   // 超时处理
//   if (options.time) {
//     oS.timer = setTimeout(function () {
//       window[callbackName] = null
//       oHead.removeChild(oS)
//       options.fail && options.fail({ message: '超时' })
//     }, options.time)
//   }
// };

// 格式化参数
// function formatParams (data) {
//   var arr = []
//   for (var name in data) {
//     arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
//   }
//   return arr.join('&')
// }

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
// canvas上的点击事件失效

// firstload 是否需要转换成常量  是否需要分成抽象的大类
window.onload = function () {
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
    // ：DNS解析时间、TCP建立连接时间、首页白屏时间、dom渲染完成时间、页面onload时间等
    // })
    // a.add('firstload', (m) => {
    if (!localStorage.getItem('lstoken')) {
      localStorage.setItem('lstoken', guid())
    }
    var UA = require('ua-device')
    var input = navigator.userAgent

    var UAoutput = new UA(input)
    let info = {
      a: {'dnsTime': dnsTime, // time
        'tcpTime': tcpTime,
        'firstPaintTime': firstPaintTime,
        'domRenderTime': domRenderTime,
        'loadTime': loadTime},
      b: {// user
        date: formatDate(), // 本地时间戳
        title: document.title, // 需要读取到SPA的title
        url: encodeURI(window.location.href.replace('#', '@')), // url会不会太长 到时候需要截取
        width: window.innerWidth,
        height: window.innerHeight,
        token: localStorage.getItem('lstoken')// 本地生成一个缓存，可以一直识别某用户
        // 分辨率
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
        v: '1.1', // 插件版本
        appid: 'a123'// 服务器注册的应用id
      }
      // location: {// 这部分可能是服务端获取的
      //   IP: 'IP',
      //   地点: '',
      //   运营商: ''
      // },
      // from: {// 这部分先只读取 from=xx 入口

      // }
    }
    m('systeminfo', info)
  })
  a.add('timeline', (m) => { // 含一些图片
    // let entryTimesList = []
    let entryList = window.performance.getEntries()
    entryList.forEach((item, index) => {
      let templeObj = {}
      // 'fetch', 'xmlhttprequest'
      let usefulType = ['navigation', 'script', 'css', 'link', 'img']
      if (usefulType.indexOf(item.initiatorType) > -1) {
        templeObj.name = item.name.replace('#', '@')

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
      m('click', {
        name: e.target.nodeName,
        text: e.target.innerText,
        html: '', // e.target.nodeName === 'HTML' ? '' : htmlEncode(e.target.innerHTML),
        x: e.offsetX,
        y: e.offsetY})
    })
  })
  // a.add('outpage',(m)=>{

  //   window.onbeforeunload = function(){

  //   };
  // })
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
