<template>
    <div class="starship-permissions layout column">

        <div class="layout row flex shrink py-3">
            <div class="flex" style="min-width: 300px; max-width: 300px;"></div>
            <div class="flex" style="text-align: center;" v-for="action in actions">
                <starship-help :tooltip="action.description" class="mr-1" style="position: relative; top: -1px;"></starship-help>{{ action.name | capitalize }}
            </div>
        </div>

        <div class="layout column flex">
            <div v-for="permission in permissions" :key="permission.subject.id" class="subjects layout row flex shrink">

                <div class="layout row flex" style="min-width: 300px; max-width: 300px;">
                    <div class="flex shrink">
                        <v-avatar size="46"><img :src="permission.subject.getPhoto()"></v-avatar>
                    </div>
                    <div class="subject-name flex shrink ml-2">{{ permission.subject.name }}</div>
                </div>

                <div class="flex" style="text-align: center;">
                    <div style="width: 50px; display: inline-block;">
                        <starship-toggle mode="switch" v-model="permission.active"></starship-toggle>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .starship-permissions {

        overflow: hidden;

        .subjects {
            border-top: solid 1px var(--divider-color-light);
            padding-left: 20px;
            padding-top: 10px;
            padding-bottom: 10px;
        }

        .subject-name {
            padding-top: 12px;
        }

        .starship-toggle {
            margin-top: 6px;
        }
    }
</style>

<script>
    import { Component } from 'starship';

    export default Component('starship-permissions', {

        properties: {

            $actions: [],
            $entity: null,
            $subjects: [],

            permissions() {

                if (!this.entity || !this.entity.permissions) {
                    return [];
                }

                return this.subjects.map(subject => {

                    let permission = this.entity.permissions.find(permission => permission.subject == subject.id);

                    return {
                        subject: subject,
                        active: permission != null
                    }
                });
            }
        },

        async save() {

            await this.$starship.load(async () => {

                this.entity.permissions = this.permissions.where(permission => permission.active).map(permission => {

                    return {
                        subject: permission.subject.id,
                        actions: this.actions.map(action => action.name)
                    }
                });

                await this.entity.save();
            });
        }
    });
</script>