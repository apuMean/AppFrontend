import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import ImportItems from '../components/items/importItems.component';
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
describe('Items Controlled component', () => {

    it('Heading should have Rejected imported materials log as text', function () {
        const wrapper = mount(<Provider store={store}><ImportItems {...props} /></Provider>);
        expect(wrapper.find('span').first().text()).toEqual('Rejected imported materials log');
    });

    it('Should have a link for download sample and upload files', function (done) {
        const wrapper = mount(<Provider store={store}><ImportItems {...props} /></Provider>);
        expect(wrapper.find('input').last().prop('type')).toBe('file');
        done();
    });

    it('Should have a table for material list', function (done) {
        const wrapper = mount(<Provider store={store}><ImportItems {...props} /></Provider>);
        expect(wrapper.find('table').length).toBe(1);
        done();
    });
});