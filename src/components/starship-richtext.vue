<template>
    <div class="starship-richtext" :class="{ readOnly: readOnly, hideToolbar: hideToolbar }">

        <div v-if="loaded" class="layout column fill-height">
            <label style="margin-bottom: 3px;" v-if="label">{{label}}</label>
            <div class="starship-quill-wrapper" ref="editor"></div>
        </div>

        <starship-menu2 v-if="filteredMentions.length" title="Mention" :items="filteredMentions" @select="mentionSelected"></starship-menu2>
    </div>
</template>

<style lang="scss">

    .starship-richtext {
        color: black;
        overflow: hidden;

        &.readOnly,
        &.hideToolbar {
            border-top: solid 1px rgb(204, 204, 204);

            .ql-toolbar {
                display: none;
            }
        }

        &.readOnly {
            .ql-editor {
                background-color: rgb(245, 245, 245);
            }
        }

        .starship-menu2 {
            position: absolute;
            padding-top: 8px;
            min-width: 200px;
        }
    }

    .starship-quill-wrapper {
        background: white;
        overflow-y: auto;
        flex: 1;
    }

    .ql-editor {
        overflow: visible;
    }

    .ql-container {
        height: auto !important;
    }
</style>

<script>
    import Quill from 'quill';
    import { Component, Util } from 'starship';
    import 'quill/dist/quill.snow.css';

    let defaultPhoto = require('starship/src/theme/images/avatar.png');

    export default Component('starship-richtext', {

        properties: {

            $label: '',
            $value: '',
            $readOnly: false,
            $hideToolbar: false,
            $placeholder: '',

            show: true,

            quill: null,
            loaded: false,
            ignoreUpdate: false,
            cursorIndex: -1,

            options: {
                debug: false,
                theme: 'snow', 

                modules: {

                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        //[{ 'size': ['small', false, 'large', 'huge'] }],
                        //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        //[{ 'font': [] }],
                        [{ 'align': [] }]
                    ]
                }
            },
            
            $mentions: [],

            textBeforeCursor() {
                if (this.cursorIndex >= 0) {
                    return this.quill.getText(0, this.cursorIndex);
                }

                return '';
            },

            mention() {
                if (this.mentionIndex >= 0) {
                    return this.textBeforeCursor.substring(this.mentionIndex + 1);
                }

                return '';
            },

            mentionIndex() {
                if (this.cursorIndex >= 0) {
                    return this.textBeforeCursor.lastIndexOf('@');
                }

                return -1;
            },

            filteredMentions() {

                if (this.mentionIndex < 0) {
                    return [];
                }

                if (!this.mention) {
                    return this.mentions;
                }

                let mention = this.mention.toLowerCase();

                return this.mentions.where(each => {
                    let name = each.name.toLowerCase();

                    if (name == mention) {
                        return false;
                    }

                    return name.startsWith(mention);
                });
            }
        },

        watch: {

            value: {
                immediate: true,
                handler: 'update'
            },

            readOnly() {
                this.quill.enable(!this.readOnly);
            }
        },

        async ready() {
            
            this.loaded = true;

            await this.$nextTick();

            if (this.readOnly) {
                this.options.readOnly = true;
            }

            if (this.placeholder) {
                this.options.placeholder = this.placeholder;
            }

            this.quill = new Quill(this.$refs.editor, this.options);
            this.quill.root.spellcheck = false;

            this.quill.on('text-change', (delta, oldDelta, source) => {

                let selection = this.quill.getSelection();

                if (selection) {
                    this.cursorIndex = selection.index;
                    //this.quill.formatText(0, 5, 'bold', true);
                }
                else {
                    this.cursorIndex = -1;
                }

                if (source == 'user') {
                    this.updateText();
                }
            });
            
            this.quill.pasteHTML(this.value);
        },

        update() {
            if (this.quill && !this.ignoreUpdate) {
                this.quill.setText('');
                this.quill.clipboard.dangerouslyPasteHTML(0, this.value);
            }
        },

        beforeDestroy() {
            this.quill = null;
            delete this.quill;
            this.loaded = false;
        },

        mentionSelected(mention) {
            if (this.mention.length < mention.name.length) {
                let appendText = mention.name.substring(this.mention.length);
                this.quill.insertText(this.cursorIndex, appendText);
                this.updateText();
            }
        },

        updateText() {

            try {
                this.ignoreUpdate = true;
                let html = this.quill.root.innerHTML;
                    
                html = Util.replace(html, '\t', '    ');

                while (html.indexOf('  ') >= 0) {
                    html = Util.replace(html, '  ', '&nbsp;&nbsp;');
                }

                html = Util.replace(html, '<p> ', '<p>&nbsp;');
                html = Util.replace(html, '&nbsp; ', '&nbsp;&nbsp;');
                    
                this.$emit('input', html);
            }
            finally {
                this.$nextTick(() => {
                    this.ignoreUpdate = false;
                });
            }
        }
    });
</script>