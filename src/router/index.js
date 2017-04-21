import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/views/Login'
import GameBox from '@/views/GameBox'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/game',
      name: 'GameBox',
      component: GameBox
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    }
  ]
})
