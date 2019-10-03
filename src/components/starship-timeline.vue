<template>
    <div class="starship-timeline layout column fill-height" :class="{ showDetails: showDetails }">

        <div class="flex">
            <slot></slot>
        </div>

        <v-list class="flex shrink" style="overflow-y: auto;" two-line>
            <template v-for="(group, name) in groups" v-if="group.length">
                <v-subheader class="timeline-group-name">
                    {{ name | camelcaseWithSpaces }}
                </v-subheader>

                <v-divider inset></v-divider>

                <template v-for="(each, index) in group">
                    <component class="timeline-item" :key="each.item.id" :is="'timeline-' + each.type" :source="each" :item="each.item"></component>
                </template>
            </template>
        </v-list>

    </div>
</template>

<style lang="scss">
    .starship-timeline {

        width: 100%;

        .timeline-control {
            opacity: 0;

            .v-icon {
                opacity: 0.7;
            }

            .v-icon:hover {
                opacity: 1;
            }
        }

        .v-icon {
            color: rgb(130, 150, 170);
        }

        .timeline-item {
            padding-top: 5px;
            padding-bottom: 5px;
            border-bottom: solid 1px var(--divider-color-light);
        }

        .v-list {
            height: 100%;
            //background-color: rgb(250, 250, 250) !important;
            padding-bottom: 0;
        }

        .timeline-group-name {
            font-size: 15px;
            font-weight: 600;
        }

        .timeline-content {
            position: relative;
            left: 0px;
            word-wrap: break-word;

            > * {
                font-size: 0.9em;
            }
        }

        .v-list__tile {
            padding: 0;
            margin: 0;
        }

        .v-list__tile:hover {

            .timeline-control {
                opacity: 1;
            }
        }

        .timeline-icon {
            flex: 0 1 auto;
            min-width: 70px;
            max-width: 70px;
            text-align: center;
        }

        .v-list__tile__content {
            flex-shrink: 0;
        }

        &:not(.showDetails) .expanded-details {
            display: none;
        }

        .v-list--two-line .v-list__tile {
            height: auto;
            padding-top: 5px;
            padding-bottom: 5px;
        }

        .timeline-date {
            color: rgb(120, 120, 120);
        }
    }
</style>

<script>
    import _ from 'underscore';
    import moment from 'moment';
    import { Component, Repository, Formatters, User, DateHelper } from 'starship';

    export default Component('starship-timeline', {

        properties: {

            $source: null,
            $showDetails: false,
            $dateField: 'date',

            groups() {
                
                let groups = {
                    pastDue: [],
                    today: [], // overdue, today's events
                    upcoming: [], // tomorrow's tasks, upcoming events
                    history: [] // All past history
                };

                if (!this.items || !this.items.length) {
                    return groups;
                }
                
                let today = DateHelper.today;

                this.items.each(event => {
                    
                    if (event.actionable && event.item.isComplete()) {
                        groups.history.push(event);
                        return;
                    }
                    
                    let date = moment(DateHelper.toShortDate(event.item[this.dateField])).startOf('day');
                    
                    if (date.isSame(today)) {
                        groups.today.push(event);
                    }
                    else if (date.isAfter(today)) {
                        groups.upcoming.push(event);
                    }
                    else {

                        if (event.actionable && !event.item.isComplete()) {
                            groups.pastDue.push(event);
                        }
                        else {
                            groups.history.push(event);
                        }
                    }
                });

                let indexComparison = each => _.has(each.item, 'index') ? each.item.index : -1;

                groups.pastDue = groups.pastDue.sortBy('index', each => new Date(each.item[this.dateField]).getTime());
                //groups.today = groups.today.sortBy(each => each.type == 'task', 'index', each => new Date(each.item[this.dateField]).getTime());
                groups.upcoming = groups.upcoming.sortBy('index', each => new Date(each.item[this.dateField]).getTime());
                groups.history = groups.history.sortBy(each => new Date(each.item[this.dateField]).getTime()).reverse();

                groups.today = _.chain(groups.today)
                    .sortBy('index')
                    //.sortBy(each => new Date(each.item.date).getTime())
                    .value();

                return groups;
            },

            $items: []
        }
    });
</script>