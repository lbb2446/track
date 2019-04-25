# 这是一个Vue前端埋点工具库
# 使用方法
```


```


# happy-track

一个页面数据采集工具

## Features

- 采集页面基础数据：加载时间，白屏时间
- 采集页面的UA信息
- 在每个页面的停留时间和行为路径
## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

[![Browser Matrix](https://saucelabs.com/open_sauce/build_matrix/axios.svg)](https://saucelabs.com/u/axios)

## Installing

Using npm:

```bash
$ npm install --save happy-track
```

Using cdn: CDN有一个好处，永远是最新版本的，但是会占用一个http请求，请各自衡量

```html
<script src=""></script>
```

## Example

 初始化

```js
//在main.js里
import {init,track} from 'happy-track' // 有一个use方法和一个指令方法
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

window.onload = () => {
  init({uuid: 'lbb', appid: '7fa1e8ba0623405c9e494f63a17abf19'})
}
```
## License

MIT
