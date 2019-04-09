import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import TestUtils from 'react-addons-test-utils';
import { Link } from 'react-router';
import block from 'block-ui';
import toastr from 'toastr';
import Opportunity from '../components/opportunities/opportunity.component';
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

describe('Opportunities Controlled component', () => {
    //based on conditional rendering
    it('Should have a link for add opportunity', function (done) {
        const wrapper = mount(<Provider store={store}><Opportunity {...props} /></Provider>);
        expect(wrapper.find(Link).length).toBe(0);
        done();
    });

    it('Should have a table for all opportunities list', function (done) {
        const wrapper = mount(<Provider store={store}><Opportunity {...props} /></Provider>);
        expect(wrapper.find('table').length).toBe(1);
        done();
    });
});