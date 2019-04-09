import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import Order from '../components/orders/order.component';
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
    breadCrumb: breadCrumb
};
describe('Service Orders Controlled component', () => {

    it('Heading should have service orders as text', function () {
        const wrapper = mount(<Provider store={store}><Order {...props} /></Provider>);
        expect(wrapper.find('span').text()).toEqual('Service Orders');
    });

    it('Should have a link for new service order', function (done) {
        const wrapper = mount(<Provider store={store}><Order {...props} /></Provider>);
        expect(wrapper.find(Link).length).toBe(0);
        done();
    });

    it('Should have a table for service order list', function (done) {
        const wrapper = mount(<Provider store={store}><Order {...props} /></Provider>);
        expect(wrapper.find('table').length).toBe(1);
        done();
    });
});