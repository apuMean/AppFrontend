import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import TestUtils from 'react-addons-test-utils';
import { Link } from 'react-router';
import block from 'block-ui';
import toastr from 'toastr';
import OpportunityAdd from '../components/opportunities/opportunityAdd.component';
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

describe('Add Opportunity Controlled component', () => {
    it('Should have active tab with text Opportunity', function (done) {
        const wrapper = mount(<Provider store={store}><OpportunityAdd {...props} /></Provider>);
        expect(wrapper.find('a').first().text()).toEqual('Opportunity');
        done();
    });

    it('Should have class portlet-title for all title', function (done) {
        const wrapper = mount(<Provider store={store}><OpportunityAdd {...props} /></Provider>);
        expect(wrapper.find('div.portlet-title').length).toBe(3);
        done();
    });

    it('Should have class portlet-body for active tabs and table', function (done) {
        const wrapper = mount(<Provider store={store}><OpportunityAdd {...props} /></Provider>);
        expect(wrapper.find('div.portlet-body').length).toBe(1);
        done();
    });

    it('Opportunity save button should be of type button', (done) => {
        const wrapper = mount(<Provider store={store}><OpportunityAdd {...props} /></Provider>);
        const saveButton = wrapper.find('button.blue');
        expect(saveButton.prop('type')).toBe('button');
        done();
    });

    it('Should have <button/> ', function (done) {
        const wrapper = mount(<Provider store={store}><OpportunityAdd {...props} /></Provider>);
        expect(wrapper.find('button').length).toBe(9);
        done();
    });

});