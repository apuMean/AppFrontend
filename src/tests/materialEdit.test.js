import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import TextareaAutosize from 'react-autosize-textarea';
import ItemEdit from '../components/items/edititem.component';
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
describe('Update Material Controlled component', () => {
    it('Should have active tab with text Material', function (done) {
        const wrapper = mount(<Provider store={store}><ItemEdit {...props}/></Provider>);
        expect(wrapper.find('a').first().text()).toEqual('Material');
        done();
    });

    it('Should have class portlet-title for all title', function (done) {
        const wrapper = mount(<Provider store={store}><ItemEdit {...props}/></Provider>);
        expect(wrapper.find('div.portlet-title').length).toBe(4);
        done();
    });

    it('Should have class portlet-body for active tabs and table', function (done) {
        const wrapper = mount(<Provider store={store}><ItemEdit {...props}/></Provider>);
        expect(wrapper.find('div.portlet-body').length).toBe(4);
        done();
    });

    it('Should have <img/> ', function (done) {
        const wrapper = mount(<Provider store={store}><ItemEdit {...props}/></Provider>);
        expect(wrapper.find('img').length).toBe(1);
        done();
    });

    it('Should have Add/Update supplier button', function (done) {
        const wrapper = mount(<Provider store={store}><ItemEdit {...props} /></Provider>);
        expect(wrapper.find('button.green').text()).toEqual('Add Supplier');
        done();
    });

});