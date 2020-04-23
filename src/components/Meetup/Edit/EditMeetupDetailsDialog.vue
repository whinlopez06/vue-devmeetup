<template>
    <v-dialog v-model="dialog" persistent width="350px">
        <!--the activator will set the binded dialog to true-->
        <template v-slot:activator="{ on }">
            <v-btn fab accent v-on="on" class="success">
                <v-icon>edit</v-icon>
            </v-btn>
        </template>

        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>Edit Meetup</v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-text>
                            <v-text-field
                                name="title"
                                label="Title"
                                id="title"
                                v-model="editedTitle"
                                required></v-text-field>
                            <v-text-field
                                name="description"
                                label="Description"
                                id="description"
                                multi-line
                                v-model="editedDescription"
                                required></v-text-field>

                        </v-card-text>
                    </v-flex>
                </v-layout>

                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-actions>
                            <v-btn flat
                                   class="blue--text darken-1"
                                   @click="dialog = false">Close</v-btn>
                            <v-btn flat class="blue--text darken-1" @click="onSaveChanges">Save</v-btn>
                        </v-card-actions>
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
                dialog: false,  // modal dialog set to false by default to hide/disable the modal
                editedTitle: this.meetup.title,
                editedDescription: this.meetup.description
            }
        },
        methods: {
            onSaveChanges () {
                if (this.editedTitle.trim() === '' || this.editedDescription.trim() === '')    {
                    return false;
                }
                this.dialog = false
                this.$store.dispatch('updateMeetupData', {
                    id: this.meetup.id,
                    title: this.editedTitle,
                    description: this.editedDescription
                })    // dispatch the action on the meetup store and passing the object as payload
            }
        }
    }
</script>
