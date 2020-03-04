import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
//for the bootstrap vue 
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-search-select/dist/VueSearchSelect.css'
// This imports all the layout components such as <b-container>, <b-row>, <b-col>:
import { LayoutPlugin } from 'bootstrap-vue'
Vue.use(LayoutPlugin)

// This imports <b-modal> as well as the v-b-modal directive as a plugin:
import { ModalPlugin } from 'bootstrap-vue'
Vue.use(ModalPlugin)

// This imports <b-card> along with all the <b-card-*> sub-components as a plugin:
import { CardPlugin } from 'bootstrap-vue'
Vue.use(CardPlugin)

// This imports directive v-b-scrollspy as a plugin:
import { VBScrollspyPlugin } from 'bootstrap-vue'
Vue.use(VBScrollspyPlugin)


import { library } from '@fortawesome/fontawesome-svg-core'
import { faWindowClose,faUserSecret,faCheck, faList, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUserSecret,faWindowClose,faCheck,faList,faPen)
 
Vue.component('font-awesome-icon', FontAwesomeIcon)
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

import {IconsPlugin } from 'bootstrap-vue'

Vue.use(IconsPlugin)

Vue.use(VueMoment, {
    moment,
})
//Vue.config.productionTip = false

// This imports the dropdown and table plugins
import { DropdownPlugin, TablePlugin } from 'bootstrap-vue'
Vue.use(DropdownPlugin)
Vue.use(TablePlugin)
import store from './store'
import router from './router'


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
