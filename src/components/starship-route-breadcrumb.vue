<template>
    <div v-if="breadcrumbs.length > 0" class="starship-route-breadcrumb">
        <v-breadcrumbs :items="breadcrumbs" large>

            <template slot="item" slot-scope="each" append>
                <v-breadcrumbs-item :to="each.item.href" exact>
                    {{ each.item.text }}
                    <v-icon color="grey" slot="divider">fa-angle-right</v-icon>
                </v-breadcrumbs-item>
                </template>
        </v-breadcrumbs>
    </div>
</template>

<style lang="scss">
    .starship-route-breadcrumb {
        li, a {
            color: var(--title-color) !important;
        }
    }
</style>

<script>
    import _ from 'underscore';
    import { Component, Formatters } from 'starship';
    
    export default Component('starship-route-breadcrumb', {

        properties: {

            breadcrumbs() {
                var segments = _.filter(decodeURIComponent(this.$route.path).split('/'), (each) => {
                    return each.trim();
                });

                var href = '';

                return _.map(segments, (each, i) => {
                    href += '/' + each;

                    return {
                        text: Formatters.capitalize(each),
                        disabled: i == segments.length - 1,
                        href: href
                    };
                });
            },

            path: function () {
                return this.$route.params[0];
            }
        },

        ready() {
        }
    });
</script>