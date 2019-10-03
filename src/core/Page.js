import Component from './Component';
import Router from './Router';
import _ from 'underscore';

export default function (name, definition) {

    if (_.isUndefined(name)) {
        throw ('Page missing name: ' + JSON.stringify(definition));
    }

    var component = Component(name, definition);
    var route = '';
    
    if (_.isUndefined(definition.route)) {
        route = '/' + name.toLowerCase();
    }
    else if(definition.route) {
        route = definition.route;
    }

    Router.routes.push({
        path: route,
        name: name,
        component: component,
        props: true
    });

    return component;
};