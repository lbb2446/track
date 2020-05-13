<template>
  <div class="hello">
    <h2>随意点击元素</h2>
      <div> 收集请求</div>
      <div> 收集普通点击事件 </div>
      <div> 收集动态注册</div>

    <div v-track="'测试'" style="height:500px;width:200px">收集动态注册按钮</div>
    <div>resetToken</div>
   <div @click="getAjax">测试请求</div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    getAjax () {
      this.$http.get('/query/user?page=1&size=10').then((response) => {
        console.log(response.data)
      })
    }
  }
}
</script>
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
