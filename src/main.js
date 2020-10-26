import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false


//import i18n from '@/plugins/i18n';


//for the bootstrap vue
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-search-select/dist/VueSearchSelect.css' 
import {BootstrapVue,IconsPlugin} from 'bootstrap-vue'
Vue.use(IconsPlugin)
Vue.use(BootstrapVue)



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


Vue.use(VueMoment, {
    moment,
})
//Vue.config.productionTip = false

// This imports the dropdown and table plugins
import { DropdownPlugin, TablePlugin } from 'bootstrap-vue'
Vue.use(DropdownPlugin)
Vue.use(TablePlugin)
import store from './store'
// initialize the vuex-i18 module
import vuexI18n from 'vuex-i18n';
// const langConfig = {
// 	moduleName: 'langModule',
// 	translateFilterName: 't'
// }
import axios from 'axios';
import {apiDomain,getHeader} from "./config/config";
Vue.use(vuexI18n.plugin, store, {
	moduleName: 'i18n',
	onTranslationNotFound (locale, key) {

		return new Promise((resolve, reject) => {
      axios.post(apiDomain+'/login/translations'
      ,{locale: locale, key:key},{headers:getHeader()})
			.then((result) => {

				resolve(result.data);
      })
      .catch(()=>{
        reject();
      })
		});

	}}
);
// import predefined localizations
import translationsKz from './i18n/kz.js';
import translationsRu from './i18n/ru.js';



// add translations
Vue.i18n.add('kz', translationsKz);
Vue.i18n.add('ru', translationsRu);



// default locale is english
Vue.i18n.set('kz');
import router from './router'
// synchronize the router with vuex
import {sync} from 'vuex-router-sync';
sync(store, router);

new Vue({
  // i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
