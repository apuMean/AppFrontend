import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import POrder from '../components/purchaseOrder/pos.component';
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
describe('Purchase Orders Controlled component', () => {

    it('Heading should have purchase orders as text', function () {
        const wrapper = mount(<Provider store={store}><POrder {...props} /></Provider>);
        expect(wrapper.find('span').text()).toEqual('Purchase Orders');
    });

    it('Should have a link for new purchase order', function (done) {
        const wrapper = mount(<Provider store={store}><POrder {...props} /></Provider>);
        expect(wrapper.find(Link).length).toBe(1);
        done();
    });

    it('Should have a table for purchase order list', function (done) {
        const wrapper = mount(<Provider store={store}><POrder {...props} /></Provider>);
        expect(wrapper.find('table').length).toBe(1);
        done();
    });
});