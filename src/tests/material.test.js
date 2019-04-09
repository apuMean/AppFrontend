import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import Item from '../components/items/item.component';
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
describe('Items Controlled component', () => {

    it('Heading should have Materials as text', function () {
        const wrapper = mount(<Provider store={store}><Item {...props} /></Provider>);
        expect(wrapper.find('span').text()).toEqual('Materials');
    });

    it('Should have a link for add material and import materials', function (done) {
        const wrapper = mount(<Provider store={store}><Item {...props} /></Provider>);
        expect(wrapper.find(Link).length).toBe(2);
        done();
    });

    it('Should have a table for material list', function (done) {
        const wrapper = mount(<Provider store={store}><Item {...props} /></Provider>);
        expect(wrapper.find('table').length).toBe(1);
        done();
    });
});