<template>
    <div class="starship-dropzone">
        <div type="file" ref="picker" class="dropzone-file-picker" style="width: 0; height: 0; visibility: hidden; position: absolute;"></div>
        <div v-show="loading" class="overlay"></div>
        <div class="dropzone-component" ref="dropzone">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss">
    .starship-dropzone {
        width: 100%;
        height: 100%;
        z-index: 99999;

        .overlay {
            position: fixed;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.15);
            z-index: 9999;
        }
    }
</style>

<script>
    import _ from 'underscore';
    import {Component} from 'starship';
    import Dropzone from 'dropzone';
    import Event from 'EventEmitter';

    Dropzone.autoDiscover = false;

    export default Component('starship-dropzone', {

        properties: {

            $mappings: [],

            dropzone: null,

            loading: 0
        },

        watch: {

            $route(route) {
                this.dropzone.options.url = '/api' + route.path;
            }
        },

        ready() {
            
            this.$events.on('loading.start', () => {
                setTimeout(() => {
                    this.loading += 1;
                });
            });

            this.$events.on('loading.stop', () => {
                setTimeout(() => {
                    this.loading -= 1;
                });
            });

            var self = this;
            var mappings = this.mappings;
            var events = this.$events;
            var loading = this.$starship.load;
            var route = this.$route;
            var files = this.$files;
            
            var settings = {
                previewTemplate: '<div></div>',
                clickable: false,
                url: '/api' + route.path,
                clickable: ['.dropzone-file-picker']
            };

            window.route = route;

            this.dropzone = new Dropzone(this.$refs.dropzone, settings);

            this.dropzone.on('processing', function (file) {
                
                if (mappings && mappings.length) {
                    
                    let match = mappings.find(mapping => mapping.from == self.$route.path);

                    if (match) {
                        this.options.url = match.to;
                    }
                    else {
                        throw 'No dropzone mapping found.';
                    }
                }
                
                events.emit('loading.start');
            });

            this.dropzone.on('success', function (file, response) {
                events.emit('file-uploaded', response);
            });

            this.dropzone.on('complete', function (file) {
                events.emit('loading.stop');
            });

            this.$events.on('upload', () => {
                this.$refs.picker.value = null;
                this.$refs.picker.click();
            });

            this.$events.on('import', () => {
                this.$refs.picker.value = null;
                this.$refs.picker.click();
                //this.dropzone.clickableElements[0].trigger('click');
                //console.log(this.dropzone)
                //this.dropzone.hiddenFileInput.click();
            });
        }
    });
</script>