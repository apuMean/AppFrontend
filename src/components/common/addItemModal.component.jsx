import React, { PropTypes } from 'react';
// import { Link } from 'react-router';
import MaskedInput from 'react-text-mask';
import { priceMask } from '../../constants/customMasks';
import '../../styles/bootstrap-fileinput.css';
class AddItemModal extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		return (
			<div id={this.props.itemModalId} className="modal fade bs-modal-md" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-md">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
							<div className="actions">
								<h5 className="modal-title">Add Item</h5>
							</div>
						</div>
						<div className="modal-body">
							<form role="form" id="add_other_item">
								<div className="form-body">
									<div className="row">
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label contactForm">
												<input
													type="text"
													className="form-control contactForm"
													id="item_manufacturer"
													name="item_manufacturer"
													ref="item_manufacturer"
													autoComplete={'off'}
													onChange={this.props.onInputChange}
													value={this.props.manufacturerValue} />
												<label htmlFor="item_manufacturer">Mfg<span className="required">*</span></label>
												{this.props.mfgList ? <div className="dropdown open">
													<ul className="dropdown-menu" style={{ maxHeight: this.props.mfgList ? '200px' : '', overflow: 'auto', width: '100%' }}>
														{this.props.mfgList}
													</ul>
												</div> : null}
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label  contactForm">
												<input
													type="text"
													className="form-control contactForm"
													id="item_name"
													name="item_name"
													ref="item_name"
													value={this.props.itemNameValue}
													key={this.props.itemNameValue} />
												<label htmlFor="item_name">Name<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label  contactForm">
												<input
													type="text"
													className="form-control contactForm"
													id="item_modalNo"
													name="item_modalNo"
													ref="item_modalNo"
													defaultValue="" />
												<label htmlFor="item_modalNo">Model No<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label  contactForm">
												<input
													type="text"
													className="form-control contactForm"
													id="item_partNo"
													name="item_partNo"
													ref="item_partNo"
													defaultValue="" />
												<label htmlFor="item_partNo">Part No<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label contactForm">
												<input
													type="text"
													className="form-control contactForm"
													id="supplierName"
													name="supplierName"
													ref="supplierName"
													defaultValue="" />
												<label htmlFor="supplierName">Supplier Name<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label contactForm">
												<MaskedInput
													mask={priceMask}
													guide={false}
													className="form-control contactForm"
													id="listPrice"
													ref="listPrice"
													name="listPrice"
													defaultValue="" />
												<label htmlFor="listPrice">List Price<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label contactForm">
												<MaskedInput
													mask={priceMask}
													guide={false}
													className="form-control contactForm"
													id="dealerPrice"
													ref="dealerPrice"
													name="dealerPrice"
													defaultValue="" />
												<label htmlFor="dealerPrice">Dealer Price<span className="required">*</span></label>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn red" onClick={this.props.handlePopUpClose} >Cancel</button>
							<button type="button" className="btn green"
								id="send-invite-button" onClick={this.props.addItemHandler} >Add</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddItemModal;