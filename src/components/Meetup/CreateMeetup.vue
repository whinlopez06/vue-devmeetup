<template>
    <v-app>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <h4>Create a new Meetup</h4>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <!--add submit listener. prevent the default of sending https request-->
                <form @submit.prevent="onCreateMeetup">
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                name="title"
                                label="title"
                                id="title"
                                v-model="title"
                                required></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                name="location"
                                label="Location"
                                id="location"
                                v-model="location"
                                required></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn class="info" @click="onPickFile"><v-icon left light>camera_alt</v-icon>Upload Image</v-btn>
                            <input type="file"
                                   style="display: none"
                                   ref="fileInput"
                                   accept="image/*"
                                   @change="onFilePicked">
                        </v-flex>
                    </v-layout>
                    <!--<v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                name="imageUrl"
                                label="Image URL"
                                id="imageUrl"
                                v-model="imageUrl"
                                required></v-text-field>
                        </v-flex>
                    </v-layout>-->
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <img :src="imageUrl" height="150">
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-textarea
                                name="description"
                                label="Description"
                                id="description"
                                auto-grow
                                box
                                v-model="description"
                                required></v-textarea>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <h4>Choose a Date & Time</h4>
                        </v-flex>
                    </v-layout>
                    <v-layout row style="margin-bottom: 10px;">
                        <v-flex xs12 sm6 offset-sm3>
                            <v-date-picker dark v-model="date"></v-date-picker>
                        </v-flex>
                    </v-layout>
                    <v-layout row style="margin-bottom: 10px">
                        <v-flex xs12 sm6 offset-sm3>
                            <v-time-picker dark v-model="time" format="24hr">
                            </v-time-picker>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn dark
                                :disabled="!formIsValid"
                                class="primary"
                                type="submit">Create Meetup</v-btn>
                        </v-flex>
                    </v-layout>
                </form>
            </v-flex>
        </v-layout>
    </v-container>
    </v-app>
</template>

<script>
export default {
    data () {
        return {
            title: '',
            location: '',
            imageUrl: '',
            description: '',
            date: '',
            time: new Date(),
            image: null
        }
    },
    computed: {
        formIsValid () {
            return this.title !== '' &&
                this.location !== '' &&
                this.imageUrl !== '' &&
                this.description !== ''
        },
        submittableDateTime () {
            const date = new Date(this.date)
            if(typeof this.time === 'string') {
                let hours = this.time.match(/^(\d+)/)[1]
                const minutes = this.time.match(/:(\d+)/)[1]
                date.setHours(hours);
                date.setMinutes(minutes);
            }else {
                date.setHours(this.time.getHours())
                date.setMinutes(this.time.getMinutes())
            }

            return date
        }
    },
    methods: {
        onCreateMeetup () {
            if(!this.formIsValid) {
                return false;
            }
            if(!this.image) {
                return false
            }
            const meetupData = {
                title: this.title,
                location: this.location,
                //--imageUrl: this.imageUrl,
                image: this.image,
                description: this.description,
                date: this.submittableDateTime
            }
            this.$store.dispatch('createMeetup', meetupData)
            this.$router.push('/meetups'); // inject router instance and push new route and go to that route value
        },
        onPickFile () {
            this.$refs.fileInput.click()    // trigger click event
        },
        onFilePicked (event) {
            const files = event.target.files
            let filename = files[0].name
            if (filename.lastIndexOf('.') <= 0) {
                return alert('Please add a valid file!')
            }
            const fileReader = new FileReader() // vanilla javascript feature
            fileReader.addEventListener('load', () => {
                this.imageUrl = fileReader.result
            })
            fileReader.readAsDataURL(files[0])
            this.image = files[0]   // image property
        }
    }
}
</script>


