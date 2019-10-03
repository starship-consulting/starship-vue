<template>
    <v-layout class="file-manager mx-2" column fill-height>

        <v-flex class="mt-2" shrink>
            <v-layout row>

                <v-flex shrink>
                    <prompt-button icon="folder-plus" text="New Folder" label="Folder Name" @save="newFolder"></prompt-button>
                    <starship-button icon="file-plus" text="Upload" @click="$events.emit('upload')" class="ml-2"></starship-button>
                </v-flex>

                <v-flex>
                    <template v-if="selected">
                        <starship-button class="ml-3" icon="edit">Rename</starship-button>
                        <starship-button class="ml-3" icon="trash-alt" background-color="var(--delete-color)" @click="deleteFile">Delete</starship-button>
                    </template>
                </v-flex>

            </v-layout>
        </v-flex>

        <page-column class="mt-2">
            <starship-route-breadcrumb slot="beforeTitle"></starship-route-breadcrumb>

            <v-layout style="overflow: auto;" column fill-height>
                <starship-files ref="files" :path="path" @selected="selected = $event"></starship-files>
            </v-layout>
        </page-column>
    </v-layout>
</template>

<style lang="scss">
    .starship-files {
        background-color: white;
    }
</style>

<script>
    import {Component} from 'starship';
    
    export default Component('starship-file-manager', {
        
        properties: {

            selected: null,
            
            path: function () {
                return decodeURIComponent(this.$route.path);
            }
        },

        ready() {
            this.$events.on('file-uploaded', (file) => {
                this.$refs.files.newFile(file);
            });
        },

        newFolder(name) {
            if (name) {
                this.$refs.files.newFolder(name);
            }
        },

        deleteFile() {
            this.$refs.files.delete(this.selected.path);
        }
    });
</script>