import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import TextareaAutosize from 'react-autosize-textarea';
import CompanyEdit from '../components/companies/companyEdit.component';
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
describe('Update Company Controlled component', () => {
    it('Should have active tab with text Company', function (done) {
        const wrapper = mount(<Provider store={store}><CompanyEdit {...props} /></Provider>);
        expect(wrapper.find('a').first().text()).toEqual('Company');
        done();
    });

    it('Should have class portlet-title for all title', function (done) {
        const wrapper = mount(<Provider store={store}><CompanyEdit {...props} /></Provider>);
        expect(wrapper.find('div.portlet-title').length).toBe(7);
        done();
    });

    it('Should have class portlet-body for active tabs and table', function (done) {
        const wrapper = mount(<Provider store={store}><CompanyEdit {...props} /></Provider>);
        expect(wrapper.find('div.portlet-body').length).toBe(6);
        done();
    });

    it('Should have <img/> for company profile image', function (done) {
        const wrapper = mount(<Provider store={store}><CompanyEdit {...props} /></Provider>);
        expect(wrapper.find('img').length).toBe(1);
        done();
    });

    it('Should have <button/> for save contact,update contact,cancel, date picker, modal close,modal done', function (done) {
        const wrapper = mount(<Provider store={store}><CompanyEdit {...props} /></Provider>);
        expect(wrapper.find('button').length).toBe(18);
        done();
    });

    it('Should have <table/> for new phone,new address,new mail,delete department or industry', function (done) {
        const wrapper = mount(<Provider store={store}><CompanyEdit {...props} /></Provider>);
        expect(wrapper.find('table').length).toBe(4);
        done();
    });

});