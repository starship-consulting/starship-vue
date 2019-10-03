<template>
    <v-flex class="starship-files">
        <ul ref="files" @click="unselect">
            <li v-for="file in files" :key="file.full" v-bind:class="{ selected: file.selected }">
                <a :style="{ 'width': width + 'px' }" target="_blank" :href="file.link" @click="select($event, file)">
                    <v-icon v-if="shouldUseIcon(file)" :size="40" color="grey darken-1">{{ resolveIcon(file) }}</v-icon>
                    <img v-else :src="'/api/thumbnails/' + file.path + '?width=' + width + '&height=' + height" />
                    <div class="unselectable filename">{{ file.name }}</div>
                </a>
            </li>
        </ul>
    </v-flex>
</template>

<style lang="scss">

    .starship-files {

        ul {
            margin: 0;
            padding: 0;
            display: flex;
            list-style-type: none;
            flex-direction: row;
            flex-wrap: wrap;
            align-content: flex-start;
            justify-content: flex-start;
            width: 100%;
            height: 100%;
        }

        li {
            margin-top: 10px;
            margin-left: 10px;
            padding: 5px;
            align-self: flex-start;
            text-align: center;
        }

        li a {
            margin: 0;
            display: block;
            border: solid 1px transparent;
            text-decoration: initial !important;
        }

        li.selected {
            background-color: rgb(230, 230, 230) !important;
            outline: 1px solid gray;
            outline-offset: -1px;
        }

        li .filename {
            word-wrap: break-word;
            color: rgb(80, 80, 80);
        }

        li:hover {
            cursor: pointer;
            background-color: rgb(240, 240, 240);
        }

        li .filename {
            font-size: 12px;
        }

        .text {
            text-align: center;
        }
    }
</style>

<script>
    import _ from 'underscore';
    import {Component} from 'starship';
    
    export default Component('starship-files', {

        properties: {

            // Which folders are open by default
            //open: [],

            $path: '',

            width: 96,
            height: 96,

            types: {
                csv: 'fa-file-csv',
                html: 'fab fa-html5',
                pdf: 'fa-file-pdf',

                png: 'fa-image',
                jpg: 'fa-image',

                txt: 'fa-file-alt',
                doc: 'fa-file-alt',
                rtf: 'fa-file-alt',

                xls: 'fa-excel'
            },

            files() {
                var items = _.filter(this.items, (item) => {
                    return item.path.startsWith(this.path);
                });
                
                return _(items).chain().sortBy('name').sortBy((each) => {
                    return each.isFolder ? 0 : 1;
                })
                .value();
            },

            file: null,

            items: []
        },

        watch: {

            async path() {
                await this.fetch();
            }
        },

        async ready() {
            await this.fetch();
        },

        shouldUseIcon(file) {

            switch (file.extension) {

                case 'bmp':
                case 'gif':
                case 'png':
                case 'jpeg':
                case 'jpg':
                    return false;
            }

            return true;
        },

        async fetch() {
            
            await this.$starship.load(async () => {

                this.items = [];

                let files = await this.$files.list(this.path);

                _.each(files, (each) => {
                    each.selected = false;
                });

                this.items = files;
            });
        },
        
        select(e, file) {
            if (file.selected) {
                this.open(file);
            }
            else {
                if (this.file) {
                    this.file.selected = false;
                }

                this.file = file;
                this.file.selected = true;
                this.$emit('selected', this.file);

                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        },

        open(file) {
            file.selected = false;
            this.$emit('selected', null);

            if (file.isFolder) {
                this.$router.push(file.path);
            }
            else {
                window.open('/api' + file.path);
                //window.open('/api' + file.path + '?attachment=true')
                return true;
            }
        },

        unselect() {
            _.each(this.items, (item) => {
                item.selected = false;
            });

            this.$emit('selected', null);
        },

        newFolder(name) {
            this.items.push(this.$files.newFolder(this.path, name));
        },

        newFile(file) {
            this.items.push(this.$files.newFile(file));
        },

        async delete(file) {
            await this.$starship.load(async () => {
                await this.$files.delete(file);
                this.items = _.filter(this.items, (each) => each.path != file);
            });
        },

        resolveIcon(file) {
            
            if (file.isFolder) {
                return 'far fa-folder';
            }

            var match = this.types[file.extension];

            if (match) {
                return match;
            }

            return 'fa-file';
        }
    });
</script>