import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import { Link } from 'react-router';
import block from 'block-ui';
import EstimateDetail from '../components/estimates/estimateDetail.component';
import AddRevision from '../components/common/addRevisionModal.component';
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
    params: { estimateId: 1 },
    breadCrumb: breadCrumb
};
describe('Estimate Detail Presentational component', () => {
    it('Should have active tab with text Estimate', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDetail {...props} /></Provider>);
        expect(wrapper.find('li a').first().text()).toEqual(' Estimate ');
        done();
    });

    //Only tests unconditional rendered values.
    it('Should have class portlet-title for all title', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDetail {...props} /></Provider>);
        expect(wrapper.find('div.portlet-title').length).toBe(3);
        done();
    });

    //Only tests unconditional rendered values.
    it('Should have class portlet-body for active tabs and table', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDetail {...props} /></Provider>);
        expect(wrapper.find('div.portlet-body').length).toBe(3);
        done();
    });

    it('Should have <AddRevision/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDetail {...props} /></Provider>);
        expect(wrapper.find(<AddRevision />));
        done();
    });

    it('Should have a link for Export estimate and cancel button', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDetail {...props} /></Provider>);
        expect(wrapper.find(Link).length).toBe(2);
        done();
    });

});