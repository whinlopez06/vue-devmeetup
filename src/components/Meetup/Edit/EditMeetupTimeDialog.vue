<template>
    <v-dialog v-model="dialog" persistent width="350px">
        <!--the activator will set the binded dialog to true-->
        <template v-slot:activator="{ on }">
            <v-btn accent v-on="on" class="success">
                Edit Time
            </v-btn>
        </template>

        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>Edit Meetup Time</v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap style="margin-bottom: 10px;">
                    <v-flex xs12>
                        <v-time-picker v-model="editableTime" style="width: 100%" actions format="24hr">
                            <template>
                                <v-btn class="blue--text darken-1"
                                       flat
                                       @click.native="dialog = false">Close</v-btn>
                                <v-btn class="blue--text darken-1"
                                       flat
                                       @click.native="onSaveChanges">Save</v-btn>
                            </template>
                        </v-time-picker>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: ['meetup'],
        data () {
            return {
                dialog: false,
                editableTime: ''
            }
        },
        methods: {
            onSaveChanges () {
                const newDate = new Date(this.meetup.date)  // date will be as is value of meetup date. only change the time
                const hours = this.editableTime.match(/^(\d+)/)[1]
                const minutes = this.editableTime.match(/:(\d+)/)[1]
                newDate.setHours(hours)
                newDate.setMinutes(minutes)
                this.$store.dispatch('updateMeetupData', {
                    id: this.meetup.id,
                    date: newDate   // minutes and hours only change
                })
            }
        },
        // create hooks
        created () {
           this.editableTime = new Date(this.meetup.date)
        }

    }
</script>
