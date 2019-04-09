import React from 'react';
import expect from 'expect';
import jQuery from 'jquery';
import { mount, shallow } from 'enzyme';
import Pricing from '../components/common/pricing.component.jsx';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';

const store = configureStore();
describe('Landing page Pricing Presentational component', () => {
    it('Should have div class jumbotron', function (done) {
        const wrapper = mount(<Provider store={store}><Pricing /></Provider>);
        const mainDiv = wrapper.find('div').last();
        expect(mainDiv.prop('className')).toBe('jumbotron');
        done();
    });

    it('Heading should have Pricing as text', function () {
        const wrapper = mount(<Provider store={store}><Pricing /></Provider>);
        expect(wrapper.find('h2').text()).toEqual('Pricing');
    });
}); 