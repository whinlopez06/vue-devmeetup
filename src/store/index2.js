/* this is the not modular version*/
import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from "firebase"
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedMeetups: [
            {
                imageUrl: 'http://lvxphotography.net/wordpress/wp-content/gallery/new-york-city/new-york-8.jpg',
                id: 'asdfgh123',
                title: 'Meetup in New York',
                date: new Date(),
                location: 'New York',
                description: 'New York, New York'
            },
            {
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Paris_-_Eiffelturm_und_Marsfeld2.jpg',
                id: 'qwerty123',
                title: 'Meetup in Paris',
                date: new Date(),
                location: 'Paris',
                description: 'It\'s Paris!'
            }
        ],
        user: null,
        loading: false,
        error: null
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
        setLoadedMeetups (state, payload) {
            state.loadedMeetups = payload
        },
        createMeetup (state, payload) {
            state.loadedMeetups.push(payload)
        },
        updateMeetup (state, payload) {
            const meetup = state.loadedMeetups.find(meetup => {
                return meetup.id === payload.id
            })
            if (payload.title) {
                meetup.title = payload.title
            }
            if (payload.description) {
                meetup.description = payload.description
            }
            if (payload.date) {
                meetup.date = payload.date
            }
        },
        setUser (state, payload) {
            state.user = payload
        },
        setLoading (state, payload) {
            state.loading = payload
        },
        setError (state, payload) {
            state.error = payload
        },
        clearError (state) {
            state.error = null
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
        loadMeetups ({commit}) {
            commit('setLoading', true)
            // you can choose on or once. on is realtime
            firebase.database().ref('meetups').once('value')
                .then((data) => {
                    const meetups = []
                    const obj = data.val()
                    for (let key in obj) {
                        meetups.push({
                            id: key,
                            title: obj[key].title,
                            description: obj[key].description,
                            imageUrl: obj[key].imageUrl,
                            date: obj[key].date,
                            location: obj[key].location,
                            creatorId: obj[key].creatorId
                        })
                    }
                    commit('setLoadedMeetups', meetups) // commit to the mutation
                    commit('setLoading', false)
                })
                .catch((error) => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        createMeetup ({commit, getters}, payload) {
            //console.log('payload: ', payload)
            const meetup = {
                title: payload.title,
                location: payload.location,
                //--imageUrl: payload.imageUrl,
                description: payload.description,
                date: payload.date.toISOString()    // to store into firebase convert into string
                //id: '835893'
                ,creatorId: getters.user.id
            }
            let imageUrl
            let key
            let ext
            firebase.database().ref('meetups').push(meetup)
                .then(data => {
                    console.log(data)
                    key = data.key;   // unique id generated by firebase
                    // use spread in the commit
                    /*commit('createMeetup', {
                        ...meetup,
                        id:key
                    })*/
                    return key
                })
                .then(key => {
                    const filename = payload.image.name
                    ext = filename.slice(filename.lastIndexOf('.'))
                    return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)  //put is use for files
                })
                .then(fileData => {
                    /*fileData.ref.getDownloadURL()
                        .then(url => {
                            imageUrl = url
                            console.log('File available at', url);
                            return firebase.database().ref('meetups').child(key).update({imageUrl: url})
                        })*/
                    return fileData.ref.getDownloadURL()
                })
                .then((url) => {
                    imageUrl = url
                    return firebase.database().ref('meetups').child(key).update({imageUrl: url})
                })
                .then(() => {
                    commit('createMeetup', {
                        ...meetup,  // using spread
                        id: key,
                        imageUrl: imageUrl
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
            // Reach out to firebase and store it
            //commit('createMeetup', meetup)
        },
        updateMeetupData ({commit}, payload) {
            commit('setLoading', true)
            const updateObj = {}    // empty object. object property created will be updated also in firebase
            if (payload.title) {
                updateObj.title = payload.title   // assign to object
            }
            if (payload.description) {
                updateObj.description = payload.description
            }
            if (payload.date) {
                updateObj.date = payload.date
            }
            firebase.database().ref('meetups').child(payload.id).update(updateObj)  // child then unique id will be the node reference of firebase
                .then(() => {
                    commit('setLoading', false)
                    commit('updateMeetup', payload)
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
        },
        clearError ({commit}) {
            commit('clearError')
        }
    },
    getters: {
        loadedMeetups (state) {
            return state.loadedMeetups.sort((meetupA, meetupB) => {
                return meetupA.date > meetupB.date
            })
        },
        featuredMeetups (state, getters) {
            return getters.loadedMeetups.slice(0, 5)
        },
        loadedMeetup (state) {
            return (meetupId) => {
                return state.loadedMeetups.find((meetup) => {
                    return meetup.id === meetupId
                })
            }
        },
        user (state) {
            return state.user
        },
        loading (state) {
            return state.loading
        },
        error (state) {
            return state.error
        }
    }
})
