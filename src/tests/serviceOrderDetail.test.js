import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import OrderDetails from '../components/orders/orderdetails.component';
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
    params: { orderId: 1 },
    breadCrumb: breadCrumb
};
describe('Service Order Detail Presentational component', () => {
    it('Should have active tab with text Service Order', function (done) {
        const wrapper = mount(<Provider store={store}><OrderDetails {...props} /></Provider>);
        expect(wrapper.find('a').first().text()).toEqual(' Service Order ');
        done();
    });

    //Only tests unconditional rendered values.
    it('Should have class portlet-title for all title', function (done) {
        const wrapper = mount(<Provider store={store}><OrderDetails {...props} /></Provider>);
        expect(wrapper.find('div.portlet-title').length).toBe(6);
        done();
    });

    //Only tests unconditional rendered values.
    it('Should have class portlet-body for active tabs and table', function (done) {
        const wrapper = mount(<Provider store={store}><OrderDetails {...props} /></Provider>);
        expect(wrapper.find('div.portlet-body').length).toBe(4);
        done();
    });

    it('Should have a link for Edit service order,cancel,delete', function (done) {
        const wrapper = mount(<Provider store={store}><OrderDetails {...props} /></Provider>);
        expect(wrapper.find(Link).length).toBe(1);
        done();
    });

});