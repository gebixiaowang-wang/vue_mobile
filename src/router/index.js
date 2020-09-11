import Vue from 'vue'
import VueRouter from 'vue-router'
// import {
//   login
// } from '../api/user'
// import {
//   from
// } from 'core-js/fn/array'


Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login')
}, {
  path: '/',
  // name: 'layout',
  component: () => import('@/views/layout'),
  children: [{
    path: '', //默认子路由 只能有一个当访问根路径的时候显示home组件
    // name: 'home', 这个是默认路由的时候不用设置name
    component: () => import('@/views/home')
  }, {
    path: '/qa',
    name: 'qa',
    component: () => import('@/views/qa')
  }, {
    path: '/video',
    name: 'video',
    component: () => import('@/views/video')
  }, {
    path: '/my',
    name: 'my',
    component: () => import('@/views/my')
  }, ]
}, {
  path: '/search',
  name: 'search',
  component: () => import('@/views/search')
}, {
  // 设置成动态路由 根据文章的id获取数据
  path: '/article/:articleId',
  name: 'article',
  component: () => import('@/views/article'),
  // 开启props传参  将路由动态参数映射到组件的props中
  props: true
}, {
  path: '/user/profile',
  name: 'userProfile',
  component: () => import('@/views/user-profile'),
}, {
  path: '/collect',
  name: 'collectList',
  component: () => import('@/views/my/collect'),
}, {
  path: '/follow',
  name: 'followList',
  component: () => import('@/views/my/follow'),
}, {
  path: '/history',
  name: 'history',
  component: () => import('@/views/my/history'),
}, {
  path: '/myArticle',
  name: 'myArticle',
  component: () => import('@/views/my/my-article'),
}, ]

const router = new VueRouter({
  routes
})


export default router
