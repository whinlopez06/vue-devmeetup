import Vue from 'vue'
import Vuex from 'vuex'
//import * as firebase from "firebase"

import meetup from './meetup'    // reference to your module actual file
import user from './user'       // split into different file
import shared from './shared'

Vue.use(Vuex)

// VUEX exposes our states. merge together to see in the whole application (Merged together globally)
export const store = new Vuex.Store({
    modules: {
        meetup: meetup,
        user: user,
        shared: shared
    }
})
