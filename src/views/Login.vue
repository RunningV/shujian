<template>
  <div class="login">
    <div class="login-box">
      <h1>Hello World</h1>
      <form>
        <label><span>ID</span><input type="text" v-model="params.id"></label>
        <label><span>密码</span><input type="password" v-model="params.pwd"></label>
        <label><button @click.stop.prevent="login">登录</button></label>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      params: {
        id: 'bboy',
        pwd: 'MYTEST001',
      },
    }
  },
  mounted() {
    IO.on('success', data => {
      console.log(data)
      this.$router.push('game');
    })
  },
  methods: {
    login() {
      IO.emit('login', this.params);
    },
  }
}
</script>
