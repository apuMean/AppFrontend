import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import ContactEstimates from '../components/contacts/contactoptions/contactestimates.component';
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
describe('Contact Estimates controlled component', () => {
    it('Should have a link for Back to contact details', function (done) {
        const wrapper = mount(<Provider store={store}><ContactEstimates {...props}/></Provider>);
        expect(wrapper.find(Link).length).toBe(1);
        done();
    });

    it('Heading caption should have Contact Estimates as text', function () {
        const wrapper = mount(<Provider store={store}><ContactEstimates {...props}/></Provider>);
        expect(wrapper.find('span.caption-subject').text()).toEqual('Contact Estimates');
    });

    it('Should have a table for contact Estimates', function (done) {
        const wrapper = mount(<Provider store={store}><ContactEstimates {...props}/></Provider>);
        expect(wrapper.find('table').length).toBe(1);
        done();
    });
});