<template>
    <v-list-tile class="timeline-notification">

        <div class="layout column">
            <div class="layout row flex shrink align-center" :class="{ expanded: expanded, expandable: expandable }" @click.stop="toggle">

                <div class="timeline-icon flex">
                    <v-list-tile-avatar v-if="photo" class="ml-3">
                        <v-avatar class="outline" color="rgb(120, 120, 120)" size="42"></v-avatar>
                        <v-avatar size="40"><img :src="photo"></v-avatar>
                    </v-list-tile-avatar>

                    <v-icon v-else class="starship-icon" :size="26" :color="item.color">{{ getIcon }}</v-icon>
                    <!-- REMOVE TOOLTIP DUE TO PERFORMANCE
                    <starship-icon v-if="item.icon" :icon="item.icon" :color="item.color" :size="24"></starship-icon>
                    -->
                </div>

                <div class="layout column justify-center flex timeline-content body-1 shrink">
                    <v-flex>{{ title }}</v-flex>
                    <v-flex v-show="subtitle">
                        <span :class="{ 'clickable-link': route }" @click="goto">{{ subtitle }}</span>
                    </v-flex>
                    <v-flex class="timeline-date caption">{{ item.creationDate | date }}</v-flex>
                </div>

                <v-spacer></v-spacer>

                <starship-button v-show="expandable" :icon="expanded ? 'caret-up' : 'caret-down'" class="expander-icon flex shrink" flat></starship-button>
            </div>

            <div v-if="expanded" class="notification-description layout column flex shrink mx-2 mt-3">
                <div v-html="item.description"></div>
            </div>
        </div>
    </v-list-tile>
</template>

<style lang="scss">
    .timeline-notification {

        .expanded {
            //background-color: rgb(250, 252, 255) !important;
        }

        .expandable {
            cursor: pointer;
        }

        .expander-icon {
            opacity: 0;
        }

        .notification-description {
            background: white;
            border: solid 1px rgb(180, 200, 220);
            border-radius: 3px;
            padding: 8px;
            
            p {
                font-size: 13px !important;
                margin-bottom: 0;
            }
        }

        &:hover {
            //background-color: var(--hover-background);
            
            .expander-icon {
                opacity: 1;
            }
        }

        a,.clickable-link {
            text-decoration: underline;
            cursor: pointer;
            color: var(--clickable-color);
        }

        a:hover,.clickable-link:hover {
            color: blue;
        }
    }
</style>

<script>
    import { Component, Repository, Formatters, User } from 'starship';

    export default Component('timeline-notification', {

        properties: {

            $item: null,

            title: '',
            photo: '',
            expanded: false,

            getSize() {
                return ((this.size / 10) - 0.7) + 'rem';
            },

            getIcon() {
                let icon = '';

                switch (this.item.typeName) {
                    
                    case 'announcement':
                        icon = 'megaphone';
                        break;

                    case 'update':
                        icon = 'arrow-alt-circle-up';
                        break;

                    case 'alert':
                        icon = 'exclamation';
                        break;

                    default:
                        icon = 'comment-lines';
                        break;
                }

                return this.$starship.icons.prefix + icon;
            },

            subtitle() {
                let source = this.item.getSource();
                    
                if (source) {
                    return source.name;
                }

                return 'Click for additional details.';
            },

            route() {
                if (this.item.source) {
                    return '/' + this.item.source.type + 's/' + this.item.source.id;
                }

                return '';
            },

            expandable() {
                return this.item.description.length;
            }
        },

        async ready() {
            let accounts = await this.$starship.load('account');

            this.title = this.item.title;

            if (this.item.typeName == 'mention') {
                let account = accounts.find(account => account.id == this.item.updatedBy);

                if (account) {
                    this.title = account.name + ' mentioned you on a ' + this.item.source.type + '.';
                    this.photo = account.photo;
                }
            }
        },

        goto() {
            if (this.route) {
                this.$router.push(this.route);
            }
        },

        toggle() {
            if (this.item.description) {
                this.expanded = !this.expanded;
            }
        }
    });
</script>