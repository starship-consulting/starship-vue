<template>
    <v-dialog v-model="active" :max-width="400" persistent light>
        <v-card class="starship-confirm">

            <div class="confirm-question pa-3">{{ text }}</div>

            <v-divider></v-divider>

            <div class="confirm-actions pa-2">
                <starship-button background-color="rgb(220, 220, 220)" color="rgb(120, 120, 120)" icon="times" @click="close">{{ noText }}</starship-button>
                <starship-button class="yes-button" icon="check" @click="confirm">{{ yesText }}</starship-button>
            </div>
        </v-card>
    </v-dialog>
</template>

<style lang="scss">
    .starship-confirm {

        .confirm-question {
            text-align: center;
        }

        .confirm-actions {
            text-align: right;
        }

        .starship-button {
            min-width: 80px;
            margin-left: 10px;
        }
    }
</style>

<script>
    import {Component} from 'starship';
    
    export default Component('starship-confirm', {

        properties: {
            $yesText: 'Yes',
            $noText: 'No',
            $value: false,
            active: false,
            text: ''
        },

        watch: {

            active() {
                this.$emit('input', this.active);
            },

            value: {
                immediate: true,

                handler() {
                    this.active = this.value;
                }
            }
        },

        ready() {
            this.$events.on('confirm', async text => {
                this.text = text;
                this.show();
            });
        },

        show() {
            this.active = true;
        },

        close() {
            this.active = false;
            this.$emit('closed');
            this.$events.emit('confirmed', false);
        },

        confirm() {
            this.active = false;
            this.$events.emit('confirmed', true);
        }
    });
</script>