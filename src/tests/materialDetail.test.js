import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import ItemDetail from '../components/items/itemdetails.component';
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
    params: { itemId: 1 },
    breadCrumb: breadCrumb
};
describe('Material Detail Presentational component', () => {
    it('Should have active tab with text Material', function (done) {
        const wrapper = mount(<Provider store={store}><ItemDetail {...props} /></Provider>);
        expect(wrapper.find('a').first().text()).toEqual(' Material ');
        done();
    });

    //Only tests unconditional rendered values.
    it('Should have class portlet-title for all title', function (done) {
        const wrapper = mount(<Provider store={store}><ItemDetail {...props} /></Provider>);
        expect(wrapper.find('div.portlet-title').length).toBe(4);
        done();
    });

    //Only tests unconditional rendered values.
    it('Should have class portlet-body for active tabs and table', function (done) {
        const wrapper = mount(<Provider store={store}><ItemDetail {...props} /></Provider>);
        expect(wrapper.find('div.portlet-body').length).toBe(4);
        done();
    });

    it('Should have <img/> ', function (done) {
        const wrapper = mount(<Provider store={store}><ItemDetail {...props} /></Provider>);
        expect(wrapper.find('img').length).toBe(1);
        done();
    });


    it('Should have  Material Options dropdown', function (done) {
        const wrapper = mount(<Provider store={store}><ItemDetail {...props} /></Provider>);
        expect(wrapper.find('span.hidden-xs').text()).toEqual(' Material Options ');
        done();
    });

});