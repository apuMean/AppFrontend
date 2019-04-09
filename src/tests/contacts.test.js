import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import Contacts from '../components/contacts/contacts.component';
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
    params: { contactId: 1 },
    breadCrumb: breadCrumb
};
describe('Contacts Controlled component', () => {
    it('Should have a link for add contact', function (done) {
        const wrapper = mount(<Provider store={store}><Contacts {...props}/></Provider>);
        expect(wrapper.find(Link).length).toBe(1);
        done();
    });

    it('Should have a table for all company contacts list', function (done) {
        const wrapper = mount(<Provider store={store}><Contacts {...props}/></Provider>);
        expect(wrapper.find('table').length).toBe(1);
        done();
    });
});