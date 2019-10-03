<template>
    <v-list-tile class="timeline-event">

        <div class="timeline-icon flex">
            <img v-if="item.photo" :src="item.photo" />
            <v-icon v-if="item.icon" class="starship-icon" :size="getSize" :color="item.color">{{ getIcon }}</v-icon>
            <!-- REMOVE TOOLTIP DUE TO PERFORMANCE
            <starship-icon v-if="item.icon" :icon="item.icon" :color="item.color" :size="24"></starship-icon>
            -->
        </div>

        <v-layout class="timeline-content body-1" column justify-center>
            <v-flex>{{ item.text }}</v-flex>
            <v-flex v-show="item.subtitle">
                <span :class="{ 'clickable-link': item.route }" @click="goto">{{ item.subtitle }}</span>
            </v-flex>
            <v-flex class="timeline-date caption">{{ item.date | date }}</v-flex>
        </v-layout>
    </v-list-tile>
</template>

<style lang="scss">
    .timeline-event {

        .clickable-link {
            text-decoration: underline;
            cursor: pointer;
        }

        .clickable-link:hover {
            color: blue;
        }
    }
</style>

<script>
    import { Component, Repository, Formatters, User } from 'starship';

    export default Component('timeline-event', {

        properties: {
            $item: null,

            getSize() {
                return ((this.size / 10) - 0.7) + 'rem';
            },

            getIcon() {
                return this.$starship.icons.prefix + this.item.icon;
            }
        },

        goto() {
            if (this.item.route) {
                this.$router.push(this.item.route);
            }
        }
    });
</script>