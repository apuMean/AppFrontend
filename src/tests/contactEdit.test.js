import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import TextareaAutosize from 'react-autosize-textarea';
import ContactsEdit from '../components/contacts/contactEdit.component.jsx';
import { Provider } from 'react-redux';
import jQuery from 'jquery';
import localStorage from 'mock-local-storage';
var window = document.defaultView;
global.window = window
global.jQuery = require('jquery');
global.$ = require('jquery');
import configureStore from '../store/configureStore';

const store = configureStore();
var props = {
    params: { contactId: 1 }
};
describe('Update Contact Controlled component', () => {
    it('Should have active tab with text Contact', function (done) {
        const wrapper = mount(<Provider store={store}><ContactsEdit {...props}/></Provider>);
        expect(wrapper.find('a').first().text()).toEqual('Contact');
        done();
    });

    it('Should have class portlet-title for all title', function (done) {
        const wrapper = mount(<Provider store={store}><ContactsEdit {...props}/></Provider>);
        expect(wrapper.find('div.portlet-title').length).toBe(5);
        done();
    });

    it('Should have class portlet-body for active tabs and table', function (done) {
        const wrapper = mount(<Provider store={store}><ContactsEdit {...props}/></Provider>);
        expect(wrapper.find('div.portlet-body').length).toBe(5);
        done();
    });

    it('Should have <img/> for contact profile image', function (done) {
        const wrapper = mount(<Provider store={store}><ContactsEdit {...props}/></Provider>);
        expect(wrapper.find('img').length).toBe(1);
        done();
    });

    it('Should have <button/> for save contact,update contact,cancel, date picker, modal close,modal done', function (done) {
        const wrapper = mount(<Provider store={store}><ContactsEdit {...props}/></Provider>);
        expect(wrapper.find('button').length).toBe(21);
        done();
    });

    it('Should have <table/> for new phone,new address,new mail,delete department or industry', function (done) {
        const wrapper = mount(<Provider store={store}><ContactsEdit {...props}/></Provider>);
        expect(wrapper.find('table').length).toBe(4);
        done();
    });

});