import Vue from 'vue'
import VueRouter from 'vue-router'//Vue Router 是 Vue.js 官方的路由管理器。
import routes from './router/router'
import store from './store/'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
// Vue全局使用VueRouter
Vue.use(VueRouter);
const router = new VueRouter({
	routes:routes,//配置路由，这里是个数组
	mode: routerMode,//路由模式，取值为history与hash
	strict: process.env.NODE_ENV !== 'production',
	scrollBehavior (to, from, savedPosition) {
	    if (savedPosition) {
		    return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
		    return { x: 0, y: to.meta.savedPosition ||0}
		}
	}
});
 // 全局路由拦截-进入页面前执行
//router.beforeEach((to, from, next) => {
  // 这里可以加入全局登陆判断
  // 继续执行
 // next();
//});

// 全局后置钩子-常用于结束动画等
//router.afterEach(() => {
  //不接受next
//});
new Vue({
	router,// 注入框架中
	store, //全局引入状态
}).$mount('#app')

