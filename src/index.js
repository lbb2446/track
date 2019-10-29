import {getRoute, guid, htmlEncode} from './util/info'
import {formatDate} from './util/trans'
import Config from './config'
// import Message from './model/Message'
// import Collector from './model/Collector'
// sentry
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import Vue from 'vue'

import schema from './util/schema'
import Message from './model/Message'
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
      fn(this.message.sendNoResult.bind(this.message))
    } else {
      fn(this.message.send)
    }
  }
  send (type, fn) {
    fn(this.message.sendNoResult)
  }
  track (type, fn) {
    this.message.track(type, fn)
  }
  outsend () {
    this.message.outsend()
  }
}

let a = new Collector({config: Config, message: new Message({config: Config})})
function _init () {
  a.add('firstload', (m) => {
    let dnsTime = 0
    let tcpTime = 0
    let firstPaintTime = 0
    let domRenderTime = 0
    let loadTime = 0
    if (typeof window.performance === 'function') {
      let timing = performance.timing
      let start = timing.navigationStart

      dnsTime = timing.domainLookupEnd - timing.domainLookupStart
      tcpTime = timing.connectEnd - timing.connectStart
      firstPaintTime = timing.responseStart - start
      domRenderTime = timing.domContentLoadedEventEnd - start
      loadTime = timing.loadEventEnd - start
    }
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
    m('systeminfo', schema(info))
  })
  a.add('timeline', (m) => { // 含一些图片
    // let entryTimesList = []
    if (typeof window.performance === 'function') {
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
          templeObj.route = ''
          // console.log(templeObj)
          m('source', templeObj)
          // entryTimesList.push(templeObj)
        }
      })
    }

    // 循环发送
    // m('source', {'资源': entryTimesList})
  })
  a.add('timeline', (m) => { // http
    (function () {
      var origOpen = XMLHttpRequest.prototype.open
      XMLHttpRequest.prototype.open = function (e, f) {
        var sendDate = (new Date()).getTime()
        this.addEventListener('load', function (d) {
          var receiveDate = (new Date()).getTime()
          m('ajax', {
            state: e.currentTarget.status,
            // result: this.responseText,
            methods: e,
            params: '',
            url: htmlEncode(f),
            elapsedTime: receiveDate - sendDate

          })
        })
        origOpen.apply(this, arguments)
      }
    })()
  })
  a.add('timeline', (m) => { // click
    document.addEventListener('click', function (e) { // 有一个问题 是否需要监听所有类型的时间
      // Log(e)
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

    function addEvent (a, b, c) { // 兼容IE
      a.addEventListener(b, c)
    }
  })
}

window.a = a
export let track = a.track.bind(a)
export let init = ({uuid, appid, sentryPublicKey, sentrySecretKey, sentryProjectId}) => {
  Config.uuid = uuid || 'no-userid'
  Config.appid = appid
  if (sentryPublicKey !== undefined && sentrySecretKey !== undefined && sentryProjectId !== undefined) {
    Sentry.init({
      dsn: `http://${sentryPublicKey}:${sentrySecretKey}@101.37.148.124:9000/${sentryProjectId}`,
      integrations: [new Integrations.Vue({ Vue, attachProps: true })]
    })
  }

  _init()
}
