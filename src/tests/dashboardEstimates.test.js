import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import Estimates from '../components/dashboard/estimates.component';
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
describe('Dashboard Estimates Controlled component', () => {

    it('Heading should have Estimates as text', function () {
        const wrapper = mount(<Provider store={store}><Estimates {...props} /></Provider>);
        expect(wrapper.find('span').first().text()).toEqual('Estimates');
    });

    it('Should have a button for sales rep', function (done) {
        const wrapper = mount(<Provider store={store}><Estimates {...props} /></Provider>);
        expect(wrapper.find('button.green').length).toBe(1);
        done();
    });

    it('Should have a table for Estimates list and sales rep', function (done) {
        const wrapper = mount(<Provider store={store}><Estimates {...props} /></Provider>);
        expect(wrapper.find('table').length).toBe(2);
        done();
    });

    it('Should have a Select box for stage field', function (done) {
        const wrapper = mount(<Provider store={store}><Estimates {...props} /></Provider>);
        expect(wrapper.find('Select').length).toBe(1);
        done();
    });
});