import React from 'react';
import expect from 'expect';
import { mount, shallow, render } from 'enzyme';
import TestUtils from 'react-addons-test-utils';
import { Link } from 'react-router';
import block from 'block-ui';
import toastr from 'toastr';
import EstimateDuplicate from '../components/estimates/estimateDuplicate.component';
import AddMaterial from '../components/common/materialAddModal';
import AddShipping from '../components/common/shippingAddModal';
import AddHeader from '../components/common/headerAddModal';
import AddLabor from '../components/common/laborAddModal';
import AddContactModal from '../components/common/newContactModal.component';
import AddItemModal from '../components/common/addItemModal.component';
import DeleteModal from '../components/common/deleteModal.component';
import ConfirmationModal from '../components/common/confirmationModal.component';
import RevisionModal from '../components/common/addRevisionModal.component'
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
describe('Duplicate Estimates controlled component',()=>{
    it('Should have <ConfirmationModal/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDuplicate {...props} /></Provider>);
        expect(wrapper.find(<ConfirmationModal />));
        done();
    });
    it('Should have <AddMaterial/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDuplicate {...props} /></Provider>);
        expect(wrapper.find(<AddMaterial />));
        done();
    });

    it('Should have <AddHeader/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDuplicate {...props} /></Provider>);
        expect(wrapper.find(<AddHeader />));
        done();
    });

    it('Should have <AddShipping/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDuplicate {...props} /></Provider>);
        expect(wrapper.find(<AddShipping />));
        done();
    });

    it('Should have <AddLabor/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDuplicate {...props} /></Provider>);
        expect(wrapper.find(<AddLabor />));
        done();
    });

    it('Should have <AddContactModal/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDuplicate {...props} /></Provider>);
        expect(wrapper.find(<AddContactModal />));
        done();
    });

    it('Should have <AddItemModal/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDuplicate {...props} /></Provider>);
        expect(wrapper.find(<AddItemModal />));
        done();
    });

    it('Should have <DeleteModal/> component', function (done) {
        const wrapper = mount(<Provider store={store}><EstimateDuplicate {...props} /></Provider>);
        expect(wrapper.find(<DeleteModal />));
        done();
    });
    
    it('Should have <RevisionModal/> component',function(done){
        const wrapper=mount(<Provider store={store}><EstimateDuplicate {...props} /></Provider>);
        expect(wrapper.find(<RevisionModal/>));
    })
})