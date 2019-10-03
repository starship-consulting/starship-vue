import { Component } from 'starship';
    
export default Component('scoped-node', {

    functional: true,

    render(createElement, context) {
        return context.props.node;
    }
});