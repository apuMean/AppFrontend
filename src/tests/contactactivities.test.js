import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import ContactActivities from '../components/contacts/contactoptions/contactactivities.component';
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
describe('Contact Activities controlled component', () => {

    it('Heading caption should have Contact Activities as text', function () {
        const wrapper = render(<Provider store={store}><ContactActivities {...props} /></Provider>);
        expect(wrapper.find('span.caption-subject').text()).toEqual('Contact Activities');
    });

    it('Should have a table for all contact activities', function (done) {
        const wrapper = render(<Provider store={store}><ContactActivities {...props} /></Provider>);
        expect(wrapper.find('table').length).toBe(1);
        done();
    });
});