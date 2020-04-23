<template>
    <v-app>
    <v-container>
        <v-layout row wrap v-if="loading">
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

        <v-layout row wrap v-else>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h6 class="text--primary">{{ meetup.title }}</h6>
                        <template v-if="userIsCreator">
                            <v-spacer></v-spacer>
                            <!--bind the meetup prop to the meetup object-->
                            <app-edit-meetup-details-dialog :meetup="meetup"></app-edit-meetup-details-dialog>
                        </template>
                    </v-card-title>
                    <v-img :src="meetup.imageUrl" height="400">
                    </v-img>
                    <v-card-text>
                        <div class="info--text">{{ meetup.date| dateFilter }} - {{ meetup.location }}</div>
                        <!--property binding, meetup is a prop in the edit date dialog page-->
                        <div>
                            <app-edit-meetup-date-dialog
                                :meetup="meetup"
                                v-if="userIsCreator">
                            </app-edit-meetup-date-dialog>
                            &nbsp;
                            <app-edit-meetup-time-dialog
                                :meetup="meetup"
                                v-if="userIsCreator">
                            </app-edit-meetup-time-dialog>
                        </div>
                        <div>{{ meetup.description }}</div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <app-meetup-register-dialog
                            :meetupId="meetup.id"
                            v-if="userIsAuthenticated && !userIsCreator"></app-meetup-register-dialog>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>

    </v-container>
    </v-app>
</template>

<script>
    export default {
        props: ['id'],
        computed: {
            meetup () {
                return this.$store.getters.loadedMeetup(this.id)
            },
            userIsAuthenticated () {
                return this.$store.getters.user !== null && this.$store.getters.user !== undefined
            },
            userIsCreator () {
                if(!this.userIsAuthenticated) {
                    return false
                }
                return this.$store.getters.user.id === this.meetup.creatorId    // refers to the loaded meetup
            },
            loading () {
                return this.$store.getters.loading
            }
        }
    }
</script>
