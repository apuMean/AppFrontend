import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import Orders from '../components/dashboard/orders.component';
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
describe('Dashboard Service Order Controlled component', () => {

    it('Heading should have Orders as text', function () {
        const wrapper = mount(<Provider store={store}><Orders {...props} /></Provider>);
        expect(wrapper.find('span').first().text()).toEqual('Orders');
    });

    it('Should have a button for sales rep', function (done) {
        const wrapper = mount(<Provider store={store}><Orders {...props} /></Provider>);
        expect(wrapper.find('a.green').length).toBe(1);
        done();
    });

    it('Should have a table for Orders list and sales rep', function (done) {
        const wrapper = mount(<Provider store={store}><Orders {...props} /></Provider>);
        expect(wrapper.find('table').length).toBe(2);
        done();
    });

    it('Should have a Select box for stage field', function (done) {
        const wrapper = mount(<Provider store={store}><Orders {...props} /></Provider>);
        expect(wrapper.find('Select').length).toBe(1);
        done();
    });
});