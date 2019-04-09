import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import Estimates from '../components/estimates/estimate.component';
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
describe('Estimates Controlled component', () => {

    it('Heading should have Estimates as text', function () {
        const wrapper = mount(<Provider store={store}><Estimates {...props} /></Provider>);
        expect(wrapper.find('span').text()).toEqual('Estimates');
    });

    it('Should have a link for new estimate', function (done) {
        const wrapper = mount(<Provider store={store}><Estimates {...props} /></Provider>);
        expect(wrapper.find(Link).length).toBe(0);
        done();
    });

    it('Should have a table for estimates list', function (done) {
        const wrapper = mount(<Provider store={store}><Estimates {...props} /></Provider>);
        expect(wrapper.find('table').length).toBe(1);
        done();
    });
});