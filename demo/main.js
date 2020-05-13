// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {track, init} from '../src/index.js' // 有一个use方法和一个指令方法
// 使用我们自己封装的第三方函数库
import {vail} from 'ynm3001'
import axios from 'axios'
import VueAxios from 'vue-axios'

console.log(vail('2313123'))
Vue.use(VueAxios, axios)
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
// console.log(require('./components/HelloWorld.vue'))
Vue.prototype.$track = track
Vue.directive('track', {
  bind (el, binding) {
    addEvent(el, 'click', () => {
      // console.log(binding.expression)
      track('type', binding.expression)
    })
  },
  unbind: function (el) {
    addEvent(el, 'click', function () {})
  }
})
Vue.config.productionTip = false
window.onload = () => {
  init({uuid: 'yourid', version: 'yourversion', appid: '7fa1e8ba0623405c9e494f63a17abf19', sentryPublicKey: 'aaa', sentrySecretKey: 'nnnn', sentryProjectId: '1'})
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
