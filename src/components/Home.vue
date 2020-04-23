<template>
<v-app>
    <v-container>
        <v-layout row wrap class="mb-2"><!--wrap will br the text if its not fit on the grid-->
            <v-flex xs="12" sm="6" class="text-xs-center d-flex text-sm-right">
                <v-btn large router to="/meetups" class="info">Explore Meetups</v-btn>
            </v-flex>
            <v-flex xs="12" sm="6" class="text-xs-center d-flex text-sm-left">
                <v-btn large router to="/meetup/new" class="info" dark>Organize Meetup</v-btn>
            </v-flex>
        </v-layout>
        <!--loader-->
        <v-layout>
            <v-flex class="xs12 text-xs-center">
                <v-progress-circular
                        indeterminate
                        color="primary"
                        :width="7"
                        :size="70"
                        v-if="loading">
                </v-progress-circular>
            </v-flex>
        </v-layout>

        <v-layout row wrap class="mt-2" v-if="!loading">
            <v-flex xs="12">
                <v-carousel style="cursor: pointer;">
                    <v-carousel-item
                            v-for="meetup in meetups"
                            :src="meetup.imageUrl"
                            :key="meetup.id"
                            @click="onLoadMeetup(meetup.id)" >
                            <div class="title">{{ meetup.title }}</div>
                    </v-carousel-item>
                </v-carousel>
            </v-flex>
        </v-layout>

        <v-layout row wrap class="mt-2"><!--wrap will br the text if its not fit on the grid-->
            <v-flex xs12 class="text-xs-center">
                <p>Join our awesome meetups!</p>
            </v-flex>
        </v-layout>
    </v-container>
</v-app>
</template>

<script>
    export default {
        /*-- data() {
            return {
                meetups: [
                    {
                        imageUrl: 'http://lvxphotography.net/wordpress/wp-content/gallery/new-york-city/new-york-8.jpg', id: 'asdfgh123', title: 'Meetup in New York'
                    },
                    {
                        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Paris_-_Eiffelturm_und_Marsfeld2.jpg', id: 'qwerty123', title: 'Meetup in Paris'
                    },

                ]
            }
        }, --*/
        computed: {
            meetups () {
                return this.$store.getters.featuredMeetups
            },
            loading () {
                return this.$store.getters.loading
            }
        },
        methods: {
            onLoadMeetup(id) {
                this.$router.push('/meetup/' + id);
            }
        }
    }
</script>

<style scoped>
    .title {
        position: absolute;
        bottom: 50px;
        background-color: rgba(0,0,0,0.5);
        color: white;
        font-size: 2em;
        padding: 20px;
    }
</style>
