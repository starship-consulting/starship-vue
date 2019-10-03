<template>

    <!-- Example template

    <template #firstName="item">
        {{ item.firstName }}
    </template>

    -->

    <div class="starship-table layout column flex shrink" style="overflow: hidden;" :class="classes">

        <div class="table-options layout row flex" v-if="showHeader">
            <starship-button class="flex shrink" icon="ellipsis-v" tooltip="Settings" @click="toggleOptions" flat></starship-button>
            <starship-dropdown-tree class="flex shrink" v-show="showOptions" :items="options" v-model="optionValues" :expand-level="0" hide-input always-open multiple></starship-dropdown-tree>
            
            <div class="flex">

            </div>
        </div>

        <div class="table-header layout row flex shrink" :style="{ 'margin-left': -scrollX + 'px' }">
            
            <div v-if="multipleSelection" class="selection-column table-column cell flex"></div>
            <div v-if="showDeletionColumn" class="deletion-column table-column cell layout row flex""></div>

            <div ref="headers" :data-name="header.name" class="table-column cell layout row flex" v-for="header in visibleHeaders" @click="sort(header)" :style="{ flex: header.flex, minWidth: header.minWidth }">
                <div class="header-label flex shrink">{{ header.title }}</div>
                <starship-icon v-show="sortBy == header.name" :icon="sortDirection == 0 ? 'sort-up' : 'sort-down'" class="flex shrink sort-icon" :class="{ up: sortDirection == 0, down: sortDirection >= 1 }"></starship-icon>
            </div>
            
            <div class="scrollbar-filler flex" :style="{ 'min-width': scrollbarWidth + 'px', 'max-width': scrollbarWidth + 'px' }"></div>
        </div>

        <div ref="viewport" class="viewport layout row flex shrink">

            <div v-if="showDeletionColumn || multipleSelection" class="layout column flex deletion-column">
                <div class="cell flex" v-for="row in rows">
                    <starship-icon v-if="showDeletionColumn" class="delete-icon" icon="trash" color="grey" :size="18" @click="remove(row)"></starship-icon>
                    <starship-checkbox v-else class="flex shrink" v-model="row.selected"></starship-checkbox>
                </div>
            </div>

            <!--
            <div v-show="multipleSelection" class="layout column flex selection-column">
                <div class="cell flex" v-for="row in rows" :key="'selected-' + row[keyField]">
                    {{ row.selected }}
                    <starship-checkbox class="flex shrink" v-model="row.selected"></starship-checkbox>
                </div>
            </div>
            -->

            <div ref="columns" class="column layout flex" :key="header.name" :data-name="header.name" v-for="(header, index) in visibleHeaders" :style="{ flex: header.flex, minWidth: header.minWidth }" :class="{ 'align-left': header.align == 'left', 'align-right': header.align == 'right' }">
                
                <template v-for="group in groups">
                    
                    <div class="group cell flex" v-show="group.name">
                        <div v-if="index == 0" class="group-label">{{ group.header.formatter(group.name) }}</div>
                    </div>

                    <div class="cell flex" v-for="(row, rowIndex) in group.rows" :key="header.name + '-' + row[keyField]" @click="cellClicked($event, row, header.name)">
                    
                        <template v-if="!editable && index == 0">
                            <div class="row-hover bottom-layer" @click="cellClicked($event, row, header.name)" :class="{ selected: row == selected }" :style="{ 'left': scrollX + 'px' }"></div>
                            <div class="row-hover top-layer" :style="{ 'left': scrollX + 'px' }"></div>
                        </template>

                        <component v-if="header.field && !header.readonly" :is="componentResolver(header, row)" v-bind="header.field.attributes" v-model="row[header.name]" class="dynamic-field cell-value" @change="changed(row)"></component>
                        <slot v-else :name="header.name" v-bind="row"><span class="cell-value">{{ header.formatter(row[header.name], row) }}</span></slot>
                    </div>

                    <div class="column-footer flex" v-show="showFooter">
                        <template v-if="header.aggregate">
                            <div class="cell-value">{{ group.values[header.name] | money({ showCents: true, includeSign: true }) }}</div>
                        </template>
                    </div>

                </template>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

    @import 'starship/src/theme/mixins.scss';

    .starship-table {

        border-right: solid 1px var(--table-header-border-color);
        border-top: solid 1px var(--table-header-border-color);
        border-bottom: 1px solid var(--table-border-color);
        background-color: var(--table-background-color);
        //width: 100%;
        color: #666;

        .row-hover {
            position: absolute;
            height: 32px;
            width: 100%;
        }

        .dynamic-field {
            max-height: 32px;
        }

        .bottom-layer {
            z-index: 6;

            &:hover~.top-layer, &.selected~.top-layer {
                display: block;
            }
        }

        .top-layer {
            z-index: 7;
            pointer-events: none;
            background-color: rgba(150, 200, 250, 0.15);
            display: none;
        }

        &.default-theme {
            --table-background-color: white;
            --table-header-background: rgb(245, 245, 245);
            --table-footer-background: rgb(245, 245, 245);
            --table-border-color: rgb(215, 220, 225);
            --table-content-horizontal-padding: 10px;
            --table-row-height: 43px;
            --table-header-border-color: rgb(200, 205, 210);
            --table-cell-border-color: rgb(230, 233, 235);
            --table-row-alternating-color: rgb(252, 253, 254);
            --table-cell-editing-background: rgb(250, 250, 250);
            --table-cell-hover-background: var(--selected-color);
            --table-group-background-color: rgb(160, 165, 170);
            --table-group-foreground-color: white;
        }

        .table-options {
            height: 36px;
            background-color: white;
            border-left: 1px solid var(--table-header-border-color);
            border-bottom: 1px solid var(--table-header-border-color);

            .starship-button {
                border-right: 1px solid var(--table-header-border-color);
            }

            .starship-dropdown-tree {
                position: absolute;
                top: 35px;
                left: 0;
                width: 200px;
                
                .vue-treeselect__menu {
                    max-height: 300px !important;
                }
            }
        }

        .table-header {

            min-height: 43px;

            .deletion-column,.selection-column {
                background-color: var(--table-header-background);
            }

            .table-column {

                @include unselectable();

                background-color: var(--table-header-background);

                justify-content: space-between;
                align-items: center;

                border-left: 1px solid var(--table-header-border-color);

                padding-left: var(--table-content-horizontal-padding);
                padding-right: var(--table-content-horizontal-padding);

                .header-label {
                    white-space: nowrap;
                }
            }

            .scrollbar-filler {
                background-color: var(--table-header-background);
            }
        }

        &.sortable {

            .table-column {

                cursor: pointer;

                &:hover {
                    background-color: var(--border-accent);
                }


                .sort-icon {
                    position: relative;
                    display: flex;

                    &.down {
                        bottom: 4px;
                    }

                    &.up {
                        top: 4px;
                    }
                }
            }
        }

        .cell {
            display: flex;
            min-height: var(--table-row-height);
            cursor: pointer;

            .cell-value {
                padding-left: var(--table-content-horizontal-padding);
                padding-right: var(--table-content-horizontal-padding);
                margin-top: auto;
                margin-bottom: auto;
                width: 100%;
            }
        }

        &.editable {
            .cell:hover {
                background-color: var(--table-cell-hover-background) !important;
            }
        }

        .align-left {
            .cell,.cell-value {
                text-align: left !important;
            }
        }

        .align-right {
            .cell,.cell-value {
                text-align: right !important;
            }
        }

        .viewport {
            border-top: solid 1px var(--table-header-border-color);
            overflow: auto;
            overflow-y: scroll;
            //overflow-y: auto;
            //overflow-x: hidden;
            position: relative;
            height: 100%;
            border-left: solid 1px var(--table-border-color);

            .column {

                .cell {
                    border-right: solid 1px var(--table-border-color);
                }

                .column-footer {
                    font-size: 0.9em;
                    border-top: solid 1px var(--divider-color);
                    background-color: var(--table-footer-background);

                    display: flex;
                    min-height: var(--table-row-height);

                    .cell-value {
                        padding-left: var(--table-content-horizontal-padding);
                        padding-right: var(--table-content-horizontal-padding);
                        font-weight: 500;
                        margin-top: auto;
                        margin-bottom: auto;
                        width: 100%;
                    }
                }

                &:last-of-type {
                    .column-footer {
                        border-right: solid 1px var(--table-border-color);
                    }
                }
            }

            .cell {

                font-size: 0.9em;
                min-height: var(--table-row-height);

                &:not(:first-of-type) {
                    border-top: 1px solid var(--table-border-color);
                }

                &:nth-child(even) {
                    background-color: var(--table-row-alternating-color);
                }

                &.selected {
                    background-color: var(--border-accent) !important;
                }

                &.hovered {
                    background-color: var(--selected-color);
                    cursor: pointer;
                }

                &.editing {
                    padding: 2px;
                    max-height: var(--table-row-height);
                }

                &:not(.editing) {
                    min-height: calc(var(--table-row-height) - 10px);
                }

                &.group {
                    border: 0;
                    background-color: var(--table-group-background-color);

                    .group-label,
                    .group-value {
                        position: absolute;
                        color: var(--table-group-foreground-color);
                        //font-weight: 500;
                        padding-top: 6px;
                        padding-left: 10px;
                    }

                    .group-value {
                        right: 12px;
                        font-weight: bold;
                    }
                }
            }

            .column .editing {
                background-color: var(--table-cell-editing-background);
            }
        }

        .header-shadow {

            position: relative;
            margin-top: -10px;
            height: 5px;
            width: 100%;
            margin-right: 16px;

            -webkit-transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
            transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);

            -webkit-box-shadow: 0 5px 6px -2px rgba(0, 0, 0, 0.4);
	        -moz-box-shadow: 0 5px 6px -2px rgba(0, 0, 0, 0.4);
	        box-shadow: 0 5px 6px -2px rgba(0, 0, 0, 0.4);

            &.scrolled {
                -webkit-box-shadow: 0 5px 6px -1px rgba(0, 0, 0, 0.2);
	            -moz-box-shadow: 0 5px 6px -1px rgba(0, 0, 0, 0.2);
	            box-shadow: 0 5px 6px -1px rgba(0, 0, 0, 0.2);
            }
        }

        .deletion-column,.selection-column {
            max-width: 40px;
            min-width: 40px;

            .starship-checkbox {
                width: 100%;
                align-content: center;

                .v-input {
                    padding-left: 4px;
                    justify-content: center;
                    align-content: center;
                }

                .v-input__slot {
                    margin-bottom: 0;
                }
            }

            .delete-icon {
                position: relative;
                left: 9px;
                margin-top: 7px;
            }
        }
    }
</style>

<script>
    import _ from 'underscore';
    import moment from 'moment';
    import { Component, Formatters, DynamicField } from 'starship';
    
    export default Component('starship-table', {

        props: {
            componentResolver: {
                type: Function,

                default: function (header, row) {
                    return header.field.component;
                }
            },
        },

        properties: {

            $columns: [],
            $data: [],

            $selected: null,
            $theme: 'default',

            $keyField: 'id',

            hovered: null,
            editing: null,

            $selectable: false,
            $sortable: false,
            $editable: false,
            $deletable: false,
            $multipleSelection: false,
            
            $filters: [],

            showOptions: false,
            optionValues: [],

            //groupBy: [],

            sortBy: '',
            sortDirection: 0,

            scrollbarWidth: 0,
            scrollY: 0,
            scrollX: 0,

            headers: [],
            
            classes() {
                return {
                    editable: this.editable,
                    sortable: this.sortable,
                    selectable: this.selectable,
                    [this.theme + '-theme']: true
                };
            },
            
            rows() {
                let rows = this.data;

                if (this.sortable && this.sortBy) {

                    let column = this.headers.find(each => each.name == this.sortBy);

                    rows = rows.sortBy(each => {
                        
                        if (column) {

                            switch (column.type) {

                                case 'text':
                                    return each[this.sortBy].toString().toLowerCase();

                                case 'money':
                                    return parseFloat(each[this.sortBy]);
                            }
                        }

                        return each[this.sortBy];
                    });
                    
                    if (this.sortDirection >= 1) {
                        rows.reverse();
                    }

                    rows = rows.sortBy(each => {

                        if (column && !each[this.sortBy] && column.type != 'money') {
                            return 1;
                        }

                        return 0;
                    });
                }

                return rows;
            },
            
            showDeletionColumn() {
                return this.deletable && this.rows.length;
            },

            showHeader() {
                return this.rows.length && this.columns.any(column => column.groupable);
            },

            showFooter() {
                return this.rows.length && this.columns.any(column => column.aggregate);
            },
            
            options() {
                
                return [

                    { id: 'columns', label: 'Columns', children: this.headers.map(each => {

                        return {
                            id: 'column-' + each.name,
                            label: each.title
                        }
                    })},

                    { id: 'group', label: 'Group', children: this.headers.where(each => each.groupable).map(each => {

                        return {
                            id: 'group-' + each.name,
                            label: each.title
                        }
                    })}

                    /*{ id: 'filter', label: 'Filter', children: this.headers.map(each => {

                        return {
                            id: 'filter-' + each.name,
                            label: each.title
                        }
                    })},*/

                    /*{
                        id: 'export', label: 'Export', children: [

                            { id: 'export-pdf', label: 'PDF' },
                            { id: 'export-excel', label: 'Excel' }
                        ]
                    }*/
                ];
            },

            groupBy() {

                if (!this.optionValues) {
                    return [];
                }

                return this.optionValues.where(each => each.startsWith('group-')).map(each => each.replace('group-', ''));
            },

            groups() {

                let groups = [];

                if (this.groupBy.length == 0) {
                    groups.push({ name: '', values: {}, rows: this.rows, header: this.headers[0] });
                }
                else {
                    let header = this.headers.find(header => header.name == this.groupBy[0]);
                    let grouping = this.rows.groupBy(this.groupBy[0]);

                    for (var group in grouping) {

                        let model = {
                            name: group,
                            header: header,
                            values: {},
                            rows: grouping[group]
                        };
                    
                        groups.push(model);
                    }
                }

                let aggregateHeaders = this.headers.where(header => header.aggregate);

                groups.each(group => {
                    
                    aggregateHeaders.each(header => {

                        switch (header.aggregate) {
                            case 'sum':
                            default:
                                group.values[header.name] = group.rows.sum(each => each[header.name]);
                        }
                    });
                });

                return groups;
            },

            visibleHeaders() {

                return this.headers.where(header => {
                    if (this.groupBy.includes(header.name)) {
                        return false;
                    }

                    if (header.hidden) {
                        return false;
                    }

                    return true;
                });
            }
        },

        watch: {
            
            data: {

                immediate: true,

                async handler() {
                    await this.updateSize();
                }
            },

            columns: {

                immediate: true,

                async handler() {
                    
                    this.headers = this.columns.map(column => {

                        if (_.has(column, 'sorted')) {
                            this.sortBy = column.name;
                            this.sortDirection = parseInt(column.sorted) || 0;
                        }
                        
                        let header = {
                            type: column.type || 'text',
                            title: column.title || '',
                            name: column.name || '',
                            width: column.width || 0,
                            hidden: column.hidden || false,
                            readonly: column.readonly || false,
                            align: column.align || 'left',
                            size: column.size || '',
                            flex: '0 0 auto',
                            shrink: column.shrink || false,
                            groupable: column.groupable || false,
                            aggregate: column.aggregate || '',
                            minWidth: '0px'
                        };

                        if (!header.hidden) {
                            this.optionValues.push('column-' + header.name);
                        }

                        if (column.formatter && _.isFunction(column.formatter)) {
                            header.formatter = column.formatter.bind(this.$parent);
                        }
                        else {
                            header.formatter = function (value, row /* For custom formatter */) {

                                if (column.formatter) {

                                    let formatter = column.formatter;
                                    let options = {};

                                    if (_.isObject(formatter)) {
                                        options = formatter.options;
                                        formatter = formatter.type;
                                    }

                                    return Formatters[formatter](value, options);
                                }

                                switch (column.type) {

                                    case 'phone':
                                        return Formatters.phone(value);

                                    case 'money':
                                        return Formatters.money(parseFloat(value), { includeSign: true, showCents: true });

                                    case 'date':
                                        
                                        if (!value) {
                                            return '';
                                        }

                                        return moment(value).format(column.format || 'MM/DD/YYYY');
                                }

                                return value;
                            }
                        }

                        if (this.editable && !header.hidden && !header.readonly) {
                            header.field = new DynamicField(column);
                        }

                        return header;
                    });
                    
                    await this.updateSize();
                }
            }
        },

        async ready() {
            this.$refs.viewport.addEventListener('scroll', this.onScroll);
        },

        async updated() {
            this.onScroll();
        },

        beforeDestroy() {
            this.$refs.viewport.removeEventListener('scroll', this.onScroll);
        },
        
        cellClicked(e, item, field) {
            
            if (this.editing == item) {
                return;
            }
            
            this.$emit('click', item, field);
            this.$emit('select', item);
            this.$emit('update:selected', item);
        },

        edit(item) {
            this.editing = item;
        },

        focused(e, component) {
            if (this.editable) {
                this.editingElement = component;
            }
        },

        async sort(column) {

            if (!this.sortable) {
                return;
            }
            
           await this.stopEditing();

            if (this.sortBy == column.name) {
                if (this.sortDirection === 0) {
                    this.sortDirection = 1;
                }
                else {
                    this.sortDirection = 0;
                }
            }
            else {
                this.sortBy = column.name;
                this.sortDirection = 0;
            }
        },

        onScroll() {
            let viewport = this.$refs.viewport;

            this.scrollY = viewport.scrollTop;
            this.scrollX = viewport.scrollLeft;

            this.scrollbarWidth = viewport.offsetWidth - viewport.clientWidth;
        },

        async updateSize() {
            
            await this.$nextTick();
            
            if (!this.$refs.columns || !this.$refs.headers) {
                
                this.headers.each(header => {
                    header.width = 0;
                    header.flex = '1 0 0';
                    header.minWidth = '0px';
                });

                return;
            }

            this.headers.each(header => {
                header.width = 0;
                header.flex = '0 0 auto';
                header.minWidth = '0px';
            });

            await this.$nextTick();

            let minimumWidth = 40;
            let padding = 35;
            
            this.$refs.columns.each((column) => {

                let headerElement = this.$refs.headers.find(header => header.dataset.name == column.dataset.name);

                let header = this.headers.find(each => each.name == column.dataset.name);
                header.flex = '1 0 0';
                header.minWidth = (Math.max(column.offsetWidth, headerElement.firstChild.offsetWidth, minimumWidth) + padding) + 'px';
            });
        },

        async stopEditing() {

            await this.$nextTick();

            this.$emit('commit', this.editing);

            this.editing = null;
            this.editingElement = null;

            await this.$nextTick();
        },

        async blurred(e) {
            
            if (!this.editingElement) {
                return;
            }
            
            let element = this.editingElement;

            setTimeout(() => {

                if (element === this.editingElement) {
                    this.stopEditing();
                }
            }, 100);
        },

        remove(row) {
            this.$emit('remove', row);
            //this.data.remove(row);
        },

        async changed(row) {
            await this.$nextTick();
            this.$emit('change', row);
        },

        toggleOptions() {
            this.showOptions = !this.showOptions;
        }
    });
</script>