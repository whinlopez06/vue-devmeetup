<template>
  <v-app>
  <v-card
          color="grey lighten-4"
          flat>
    <v-navigation-drawer temporary app v-model="sideNav">
        <v-list>
          <v-list-tile
            v-for="item in menuItems"
            :key="item.title"
            :to="item.link">
             <v-list-tile-action> <!--<v-list-item-title>-->
                <v-icon>{{ item.icon }}</v-icon>
             </v-list-tile-action>
             <v-list-tile-content>{{ item.title }}</v-list-tile-content>
          </v-list-tile>

            <v-list-tile v-if="userIsAuthenticated"
                 @click="onLogout">
                <v-list-tile-action> <!--<v-list-item-title>-->
                    <v-icon>exit_to_app</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>Logout</v-list-tile-content>
            </v-list-tile>

        </v-list>
    </v-navigation-drawer>

    <v-toolbar dark ><!-- class="error" -->
      <!--<v-app-bar-nav-icon>-->
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav" class="hidden-sm-and-up">
      </v-toolbar-side-icon>
      <v-toolbar-title>
          <router-link to="/" tag="span" style="cursor:pointer">DevMeetup</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-xs-only">
          <v-btn
            flat
            v-for="item in menuItems"
            :key="item.title"
            :to="item.link">
            <v-icon left dark>{{ item.icon }}</v-icon>
                {{ item.title }}
          </v-btn>
          <v-btn
              flat
              v-if="userIsAuthenticated"
              @click="onLogout">
              <v-icon left dark>exit_to_app</v-icon>
              Logout
          </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
        <router-view></router-view>
    </main>

  </v-card>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false
        /*-- ,menuItems: [
          { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
          { icon: 'room', title: 'Organe Meetup', link: '/meetup/new' },
          { icon: 'person', title: 'Profile', link: '/profile' },
          { icon: 'face', title: 'Sign up', link: '/signup' },
          { icon: 'lock_open', title: 'Sign in', link: '/signin' }
        ] --*/
      }
    },
    computed: {
        menuItems () {
            let menuItems = [
                { icon: 'face', title: 'Sign up', link: '/signup' },
                { icon: 'lock_open', title: 'Sign in', link: '/signin' }
            ]
            if (this.userIsAuthenticated) {
                menuItems = [
                    { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
                    { icon: 'room', title: 'Organe Meetup', link: '/meetup/new' },
                    { icon: 'person', title: 'Profile', link: '/profile' }
                ]
            }
            return menuItems
        },
        userIsAuthenticated () {
            return this.$store.getters.user !== null && this.$store.getters.user !== undefined
        }
    },
    methods: {
        onLogout () {
            this.$store.dispatch('logout')
        }
    }

  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
