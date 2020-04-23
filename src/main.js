import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import * as firebase from 'firebase';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import colors from 'vuetify/es5/util/colors'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert.vue'  // to make component global
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog.vue'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog.vue'
import EditMeetupTimeDialog from "./components/Meetup/Edit/EditMeetupTimeDialog"
import RegisterDialog from "./components/Meetup/Registration/RegisterDialog"


Vue.config.productionTip = false
Vue.filter('dateFilter', DateFilter)
Vue.component('app-alert', AlertCmp)  // to import it as element tags
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)  // register the component as global
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-register-dialog', RegisterDialog)


Vue.use(vuetify, {
  theme: {
    primary: colors.purple.base,
    secondary: colors.grey.darken1,
    accent: colors.shades.black,
    error: colors.red.accent3
  }
})


new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
  created () {
    // firebase SDK
    firebase.initializeApp({
      apiKey: "<API KEY goes here>",
      authDomain: "devmeetup-b40f0.firebaseapp.com",
      databaseURL: "https://devmeetup-b40f0.firebaseio.com",
      projectId: "devmeetup-b40f0",
      storageBucket: "gs://devmeetup-b40f0.appspot.com",
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadMeetups')
  }
}).$mount('#app')

