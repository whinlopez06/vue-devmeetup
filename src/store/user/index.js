//--import Vue from 'vue'
//--import Vuex from 'vuex'
import * as firebase from "firebase"
//==Vue.use(Vuex)

export default {
    state: {
        user: null
    },
    mutations: {
        registerUserForMeetup (state, payload) {
            const id = payload.id
            if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
                return
            }
            state.user.registeredMeetups.push(id)
            state.user.fbKeys[id] = payload.fbKey
        },
        unregisterUserFromMeetup (state, payload) {
            const registeredMeetups = state.user.registeredMeetups
            registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
            Reflect.deleteProperty(state.user.fbKeys, payload)
        },
        setUser (state, payload) {
            state.user = payload
        }
    },
    actions: {
        registerUserForMeetup ({commit, getters}, payload) {
            commit('setLoading', true)
            const user = getters.user;
            firebase.database().ref('/users/' + user.id).child('/registrations/')  // will be created in firebase the first time we access it
                .push(payload)
                .then(data => {
                    // data is object return by firebase which have meta information about successful request
                    commit('setLoading', false)
                    commit('registerUserForMeetup', {
                        id: payload,
                        fbKey: data.key //reference to the id firebase created
                    }) // commit new mutation
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        unregisterUserFromMeetup ({commit, getters}, payload) {
            commit('setLoading', true)
            const user = getters.user
            if (!user.fbKeys) {
                return
            }
            const fbKey = user.fbKeys[payload]
            firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
                .remove()
                .then(() => {
                    commit('setLoading', false)
                    commit('unregisterUserFromMeetup', payload)
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        signUserUp ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(
                    user => {
                        commit('setLoading', false)
                        const newUser = {
                            id: user.uid,
                            registeredMeetups: [],
                            fbKeys: {}
                        }
                        commit('setUser', newUser)
                    }
                )
                .catch(
                    error => {
                        commit('setLoading', false)
                        commit('setError', error)
                        console.log(error);
                    }
                )
        },
        signUserIn ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(
                    user => {
                        commit('setLoading', false)
                        const newUser = {
                            id: user.uid,   //unique userid from firebase
                            registeredMeetups: [],   // set to empty array
                            fbKeys: {}
                        }
                        commit('setUser', newUser);
                    }
                ).catch(
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error);
                }
            )
        },
        autoSignIn ({commit}, payload) {
            commit('setUser', {
                id: payload.uid,
                registeredMeetups: [],
                fbKeys: {}
            })
        },
        fetchUserData ({commit, getters}) {
            commit('setLoading', true)
            firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
                .then(data => {
                    const dataPairs = data.val()  // converts firebase object into normal javascript object
                    let registeredMeetups = []
                    let swappedPairs = {}
                    console.log('dataPairs: ', dataPairs)
                    for (let key in dataPairs) {
                        console.log('key: ', key);
                        console.log('value: ', dataPairs[key])
                        registeredMeetups.push(dataPairs[key])
                        swappedPairs[dataPairs[key]] = key
                    }
                    const updatedUser = {
                        id: getters.user.id,
                        registeredMeetups: registeredMeetups,
                        fbKeys: swappedPairs
                    }
                    console.log('swappedPairs: ', swappedPairs)
                    console.log('registeredMeetups array: ', registeredMeetups)
                    commit('setLoading', false)
                    commit('setUser', updatedUser)
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        logout ({commit}) {
            firebase.auth().signOut()   // remove the token from the local storage
            commit('setUser', null)
        }
    },
    getters: {
        user (state) {
            return state.user
        }
    }

}
