import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import TestUtils from 'react-addons-test-utils';
import { Link } from 'react-router';
import block from 'block-ui';
import toastr from 'toastr';
import EstimateEdit from '../components/estimates/estimateEdit.component';
import AddMaterial from '../components/common/materialAddModal';
import AddShipping from '../components/common/shippingAddModal';
import AddHeader from '../components/common/headerAddModal';
import AddLabor from '../components/common/laborAddModal';
import AddContactModal from '../components/common/newContactModal.component';
import AddItemModal from '../components/common/addItemModal.component';
import DeleteModal from '../components/common/deleteModal.component';
import ConfirmationModal from '../components/common/confirmationModal.component';
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

describe('Update Estimate Controlled component', () => {
    it('Should have active tab with text Estimate', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        expect(wrapper.find('a').first().text()).toEqual('Estimate');
        done();
    });

    it('Should have class portlet-title for all title', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        expect(wrapper.find('div.portlet-title').length).toBe(6);
        done();
    });

    it('Should have class portlet-body for active tabs and table', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        expect(wrapper.find('div.portlet-body').length).toBe(2);
        done();
    });

    it('Estimate save button should be of type button', (done) => {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        const saveButton = wrapper.find('button.blue');
        expect(saveButton.prop('type')).toBe('button');
        done();
    });

    it('Should have <AddMaterial/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        expect(wrapper.find(<AddMaterial />));
        done();
    });

    it('Should have <AddHeader/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        expect(wrapper.find(<AddHeader />));
        done();
    });

    it('Should have <AddShipping/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        expect(wrapper.find(<AddShipping />));
        done();
    });

    it('Should have <AddLabor/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        expect(wrapper.find(<AddLabor />));
        done();
    });

    it('Should have <AddContactModal/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        expect(wrapper.find(<AddContactModal />));
        done();
    });

    it('Should have <AddItemModal/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        expect(wrapper.find(<AddItemModal />));
        done();
    });

    it('Should have <DeleteModal/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        expect(wrapper.find(<DeleteModal />));
        done();
    });

    it('Should have <ConfirmationModal/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateEdit {...props} /></Provider>);
        expect(wrapper.find(<ConfirmationModal />));
        done();
    });
});