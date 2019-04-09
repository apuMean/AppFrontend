import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import Opportunities from '../components/dashboard/opportunities.component';
import { Provider } from 'react-redux';
import jQuery from 'jquery';
import localStorage from 'mock-local-storage';
var window = document.defaultView;
global.window = window
global.jQuery = require('jquery');
global.$ = require('jquery');
import configureStore from '../store/configureStore';

const store = configureStore();
function breadCrumb() {
    return true
}
var props = {
    breadCrumbs: breadCrumb
};
describe('Dashboard Opportunities Controlled component', () => {

    it('Heading should have Opportunities as text', function () {
        const wrapper = mount(<Provider store={store}><Opportunities {...props} /></Provider>);
        expect(wrapper.find('span').first().text()).toEqual('Opportunities');
    });

    it('Should have a button for sales rep', function (done) {
        const wrapper = mount(<Provider store={store}><Opportunities {...props} /></Provider>);
        expect(wrapper.find('button.green').length).toBe(1);
        done();
    });

    it('Should have a table for Opportunities list and sales rep', function (done) {
        const wrapper = mount(<Provider store={store}><Opportunities {...props} /></Provider>);
        expect(wrapper.find('table').length).toBe(2);
        done();
    });

    it('Should have a Select box for stage field', function (done) {
        const wrapper = mount(<Provider store={store}><Opportunities {...props} /></Provider>);
        expect(wrapper.find('Select').length).toBe(1);
        done();
    });
});