// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {track, init} from './index.js' // 有一个use方法和一个指令方法
// 使用我们自己封装的第三方函数库
// 开始偷取
function addEvent (element, event, listener) {
  if (element.addEventListener) {
    element.addEventListener(event, listener, false)
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, listener)
  } else {
    element['on' + event] = listener
  }
}
Vue.prototype.$track = track
Vue.directive('track', {
  bind (el, binding) {
    addEvent(el, 'click', () => {
      track('directive', binding)
    })
  },
  unbind: function (el) {
    addEvent(el, 'click', function () {})
  }
})
Vue.config.productionTip = false
window.onload = () => {
  init({uuid: 'lbb', appid: 'test2'})
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
