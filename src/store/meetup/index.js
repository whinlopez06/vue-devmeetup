//--import Vue from 'vue'
//--import Vuex from 'vuex'
import * as firebase from "firebase"
//--Vue.use(Vuex)

// just export javascript object
export default {
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
        ]
    },
    mutations: {

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
        }
    },
    actions: {
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
        }
    }

}
