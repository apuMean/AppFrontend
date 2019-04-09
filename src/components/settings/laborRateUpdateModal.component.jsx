import React from 'react';
import ReactDOM from 'react-dom';
import autoBind from 'react-autobind';
import MaskedInput from 'react-text-mask';
import Modal from 'react-responsive-modal';

import { priceMask } from '../../constants/customMasks';

class LaborRateUpdateModal extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	saveLaborRateDetails() {
         
		toastr.remove();
		// ReactDOM.findDOMNode(this.refs.add).value;
		let values = {
			laborType: ReactDOM.findDOMNode(this.refs.laborType).value.trim(),
			displayName: ReactDOM.findDOMNode(this.refs.displayName).value.trim(),
			rate: parseFloat((ReactDOM.findDOMNode(this.refs.rate).value).replace(/[^0-9.]/g, '')),
			ourCost:parseFloat((ReactDOM.findDOMNode(this.refs.ourCost).value).replace(/[^0-9.]/g, ''))
		};
		if (!values.laborType) {
			toastr.error('Please enter a valid labor type.');
		}
		else if (!values.displayName) {
			toastr.error('Please enter a valid display name.');
		}
		else if (!values.rate) {
			toastr.error('Please enter a valid rate.');
		}
		else if (!values.ourCost) {
			toastr.error('Please enter a valid cost.');
		}
		else {
			let data = {
				companyId: localStorage.companyId,
				laborType: values.laborType,
				displayName: values.displayName,
				rate: values.rate,
				ourCost:values.ourCost
			};
			this.props.saveHandler(data);
		}
	}

	render() {
         
		return (
			<div>
				<Modal
					open={this.props.modalIsOpen}
					onClose={this.props.closeModal}
					closeOnEsc={false}
					closeOnOverlayClick={false}
					showCloseIcon={false}
				>
					<form className="form-horizontal">
						<div className="modal-body">

							<button type="button" className="close" onClick={this.props.closeModal} aria-hidden="true"></button>
							<h4 className="modal-title">{this.props.editable ? 'Update' : 'Add'} {this.props.title}</h4>
							<div className="row">
								<div className="col-md-12 col-sm-12 col-xs-6" >
									<div className="form-group form-md-line-input form-md-floating-label custom-form-line" style={{ paddingTop: '25px' }}>
										{this.props.editable ? <input
											maxLength={100}
											type="text"
											className="form-control"
											id='laborType'
											ref='laborType'
											name='laborType'
											defaultValue={this.props.editData ? this.props.editData.laborType : ''}
											key={this.props.editData ? this.props.editData.laborType : ''} /> :
											<input
												maxLength={100}
												type="text"
												className="form-control"
												id='laborType'
												ref='laborType'
												name='laborType' />}
										<label htmlFor="laborType">Labor Type<span className="required">*</span></label>
									</div>
								</div>
								<div className="col-md-12 col-sm-12 col-xs-6" >
									<div className="form-group form-md-line-input form-md-floating-label custom-form-line" style={{ paddingTop: '25px' }}>
										{this.props.editable ? <input
											maxLength={200}
											type="text"
											className="form-control"
											id='displayName'
											ref='displayName'
											name='displayName'
											defaultValue={this.props.editData ? this.props.editData.displayName : ''}
											key={this.props.editData ? this.props.editData.displayName : ''} /> :
											<input
												maxLength={200}
												type="text"
												className="form-control"
												id='displayName'
												ref='displayName'
												name='displayName' />}
										<label htmlFor="displayName">Display Name<span className="required">*</span></label>
									</div>
								</div>
								<div className="col-md-12 col-sm-12 col-xs-6" >
									<div className="form-group form-md-line-input form-md-floating-label custom-form-line" style={{ paddingTop: '25px' }}>
										{this.props.editable ? <MaskedInput
											mask={priceMask}
											guide={false}
											className="form-control"
											id='rate'
											ref='rate'
											name='rate'
											value={this.props.editData ? this.props.editData.rate : ''}
											key={this.props.editData ? this.props.editData.rate : ''} /> :
											<MaskedInput
												mask={priceMask}
												guide={false}
												className="form-control"
												id='rate'
												ref='rate'
												name='rate' />}
										<label htmlFor="rate">Rate<span className="required">*</span></label>
									</div>
								</div>
								<div className="col-md-12 col-sm-12 col-xs-6" >
									<div className="form-group form-md-line-input form-md-floating-label custom-form-line" style={{ paddingTop: '25px' }}>
										{this.props.editable ? <MaskedInput
											mask={priceMask}
											guide={false}
											className="form-control"
											id='ourCost'
											ref='ourCost'
											name='ourCost'
											value={this.props.editData ? this.props.editData.ourCost : ''}
											key={this.props.editData ? this.props.editData.ourCost : ''} /> :
											<MaskedInput
												mask={priceMask}
												guide={false}
												className="form-control"
												id='ourCost'
												ref='ourCost'
												name='ourCost' />}
										<label htmlFor="ourCost">Our Cost<span className="required">*</span></label>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer" style={{ borderTop: 0 }}>
							<button type="button" onClick={this.props.closeModal} className="btn dark btn-outline">CANCEL</button>
							<button
								type="button"
								className="btn green"
								onClick={this.saveLaborRateDetails}>SAVE</button>
						</div>
					</form>
				</Modal>
			</div>
		);
	}

}

export default LaborRateUpdateModal;