<template>
    <div>
        <v-toolbar style="flex: 0 1 auto;" class="main main-header no-padding" :height="height" clipped-left clipped-right flat app>

            <div class="logo">
                <img src="../theme/images/logo/logo-text.png" />
            </div>

            <v-spacer></v-spacer>

            <v-toolbar-items>

                <v-divider style="border-color: rgb(120, 120, 120) !important;" vertical></v-divider>
            
                <!--
                <v-text-field class="mt-1 ml-2" placeholder="Search" prepend-icon="search" background-color="transparent" solo flat single-line></v-text-field>
                <v-divider vertical></v-divider>
                -->

                <v-btn small flat>
                    <v-badge class="mr-2 ml-1" color="rgba(211, 111, 56, 0.8)" overlap>
                        <span class="badge" slot="badge" dark>{{notificationCount}}</span>
                        <v-icon medium color="grey">notifications</v-icon>
                    </v-badge>
                </v-btn>

                <v-divider vertical></v-divider>

                <v-btn style="width: 180px;" active-class="" to="/settings" small flat>
                    <div style="position: absolute; left: 10px;">
                        <v-avatar class="outline" color="rgb(120, 120, 120)" size="48"></v-avatar>
                        <v-avatar size="44"><img :src="profile.photo"></v-avatar>

                        <span class="body-1 ml-3" style="color: rgb(180, 180, 180);">{{profile.name}}</span>
                    </div>
                </v-btn>

                <v-divider vertical></v-divider>

                <v-btn style="width: 60px;" v-on:click="logout" small flat>
                    <v-icon color="grey">fa-sign-out-alt</v-icon>
                </v-btn>

            </v-toolbar-items>

        </v-toolbar>
    </div>
</template>

<style lang="scss">

</style>

<style scoped>

    .outline {
        position: absolute;
        left: -2px;
        top: -2px;
    }

    .v-badge {
        top: 5px;
    }

    .badge {
        font-size: 12px;
        padding-right: 1px;
    }

    .logo {
        height: 100%;
        width: 160px;
        margin-right: 5px;
    }

    .logo img {
        width: 135px;
        margin: 10px;
    }

    .logout {
        text-align: center;
        color: rgb(170, 170, 170);
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('starship-page', {

        properties: {

            $title: '',

            notificationCount: 0,

            profile() {
                return this.$starship.profile.get();
            },

            height() {
                var height = getComputedStyle(document.body).getPropertyValue('--header-height');
                return height.split('px')[0];
            }
        },

        logout: function () {
            window.location.href = '/api/logout';
        }
    });
</script>