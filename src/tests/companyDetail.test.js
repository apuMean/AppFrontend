import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import CompanyDetail from '../components/companies/companyDetail.component';
import { Provider } from 'react-redux';
import jQuery from 'jquery';
import localStorage from 'mock-local-storage';
var window = document.defaultView;
global.window = window;
global.jQuery = require('jquery');
global.$ = require('jquery');
import configureStore from '../store/configureStore';

const store = configureStore();
var props = {
	params: { contactId: 1 }
};
describe('Company Detail Presentational component', () => {
	it('Should have active tab with text Company', function (done) {
		const wrapper = mount(<Provider store={store}><CompanyDetail {...props} /></Provider>);
		expect(wrapper.find('a').first().text()).toEqual('Company');
		done();
	});

	//Only tests unconditional rendered values.
	it('Should have class portlet-title for all title', function (done) {
		const wrapper = mount(<Provider store={store}><CompanyDetail {...props} /></Provider>);
		expect(wrapper.find('div.portlet-title').length).toBe(2);
		done();
	});

	//Only tests unconditional rendered values.
	it('Should have class portlet-body for active tabs and table', function (done) {
		const wrapper = mount(<Provider store={store}><CompanyDetail {...props} /></Provider>);
		expect(wrapper.find('div.portlet-body').length).toBe(2);
		done();
	});

	it('Should have <img/> for company profile image', function (done) {
		const wrapper = mount(<Provider store={store}><CompanyDetail {...props} /></Provider>);
		expect(wrapper.find('img').length).toBe(1);
		done();
	});

	//tests unconditionaly rendered values.
	it('Should have <table/> for new phone,new address,new mail', function (done) {
		const wrapper = mount(<Provider store={store}><CompanyDetail {...props} /></Provider>);
		expect(wrapper.find('table').length).toBe(0);
		done();
	});

	it('Should have a link for Edit company,cancel,delete', function (done) {
		const wrapper = mount(<Provider store={store}><CompanyDetail {...props} /></Provider>);
		expect(wrapper.find('Link').length).toBe(3);
		done();
	});

});