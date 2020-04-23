<template>
    <v-dialog v-model="dialog" persistent width="350px">
        <!--the activator will set the binded dialog to true-->
        <template v-slot:activator="{ on }">
            <v-btn accent v-on="on" class="success">
                Edit Date
            </v-btn>
        </template>

        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>Edit Meetup Date</v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap style="margin-bottom: 10px;">
                    <v-flex xs12>
                        <v-date-picker v-model="editableDate" style="width: 100%" actions>
                            <template>
                                <v-btn class="blue--text darken-1"
                                       flat
                                       @click.native="dialog = false">Close</v-btn>
                                <v-btn class="blue--text darken-1"
                                       flat
                                       @click.native="onSaveChanges">Save</v-btn>
                            </template>
                        </v-date-picker>
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
                editableDate: ''
            }
        },
        methods: {
            onSaveChanges () {
                const newDate = new Date(this.meetup.date)
                const newDay = new Date(this.editableDate).getUTCDate()
                const newMonth = new Date(this.editableDate).getUTCMonth()
                const newYear = new Date(this.editableDate).getUTCFullYear()
                newDate.setUTCDate(newDay)
                newDate.setUTCMonth(newMonth)
                newDate.setUTCFullYear(newYear)
                this.$store.dispatch('updateMeetupData', {
                    id: this.meetup.id,
                    date: newDate
                })
            }
        },
        // create hooks
        created () {
            //this.editableDate = new Date(this.meetup.date)  // editableDate is on twoway databinding
            let date = new Date(this.meetup.date)
            let day = date.getUTCDate()
            if (day.toString().length == 1) {
                day = "0"+day
            }
            let month = date.getUTCMonth() + 1
            if (month.toString().length == 1) {
                month = "0"+month
            }
            let year = date.getUTCFullYear()
            this.editableDate = year+"-"+month+"-"+day
        }

    }
</script>
