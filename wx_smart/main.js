import Vue from 'vue'
import App from './App'
import httpApi from './common/httpApi'
import HttpRequest from './common/httpRequest'
import HttpCache from './common/cache'
import store from './store'

import loadMore from './components/uni-pro/load-more'

Vue.config.productionTip = false
Vue.prototype.$api = httpApi
Vue.prototype.$Request = HttpRequest
Vue.prototype.$Sysconf = HttpRequest.config
Vue.prototype.$SysCache = HttpCache
Vue.prototype.$store = store

App.mpType = 'app'

Vue.component('load-more',loadMore)
const app = new Vue({
    ...App
})
app.$mount()
