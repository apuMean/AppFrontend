import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import CreateItem from '../components/items/createitem.component';
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
describe('Add Material Controlled component', () => {
    it('Should have active tab with text Material', function (done) {
        const wrapper = mount(<Provider store={store}><CreateItem {...props} /></Provider>);
        expect(wrapper.find('a').first().text()).toEqual('Material');
        done();
    });

    it('Should have class portlet-title for all title', function (done) {
        const wrapper = mount(<Provider store={store}><CreateItem {...props} /></Provider>);
        expect(wrapper.find('div.portlet-title').length).toBe(3);
        done();
    });

    it('Should have class portlet-body for active tabs and table', function (done) {
        const wrapper = mount(<Provider store={store}><CreateItem {...props} /></Provider>);
        expect(wrapper.find('div.portlet-body').length).toBe(2);
        done();
    });

    it('Should have <img/>', function (done) {
        const wrapper = mount(<Provider store={store}><CreateItem {...props} /></Provider>);
        expect(wrapper.find('img').length).toBe(1);
        done();
    });

    it('Material save button should be of type button', (done) => {
        const wrapper = mount(<Provider store={store}><CreateItem {...props} /></Provider>);
        const saveButton = wrapper.find('button.blue');
        expect(saveButton.prop('type')).toBe('button');
        done();
    });

    it('Should have Add supplier button', function (done) {
        const wrapper = mount(<Provider store={store}><CreateItem {...props} /></Provider>);
        expect(wrapper.find('button.green').text()).toEqual('Add supplier');
        done();
    });

});