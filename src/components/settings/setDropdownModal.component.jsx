import React from 'react';
import ReactDOM from 'react-dom';
import autoBind from 'react-autobind';

import Modal from 'react-responsive-modal';

class SetDropdownModal extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	saveIt() {
		toastr.remove();
		let value = ReactDOM.findDOMNode(this.refs.add).value.trim();
		if (!value) {
			toastr.error('Please enter a valid value.');
		}
		else {
			this.props.saveHandler(value);
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
					classNames={{ modal: 'custom-modal' }}
				>
					<form className="form-horizontal">
						<div className="modal-body">

							<button type="button" className="close" onClick={this.props.closeModal} aria-hidden="true"></button>
							<h4 className="modal-title">{this.props.editable ? 'Update' : 'Add'} {this.props.title}</h4>

							<div className="col-md-12" >
								<div className="form-group form-md-line-input form-md-floating-label custom-form-line" style={{ paddingTop: '25px', marginTop: '25px' }}>
									{this.props.editable ? <input
										maxLength={200}
										type="text"
										className="form-control"
										id='add'
										ref='add'
										name='add'
										defaultValue={this.props.editData ? this.props.editData : ''}
										key={this.props.editData ? this.props.editData : ''} /> :
										<input
											maxLength={200}
											type="text"
											className="form-control"
											id='add'
											ref='add'
											name='add' />}
									<label htmlFor={this.props.title}>{this.props.title}<span className="required">*</span></label>
								</div>
							</div>

						</div>
						<div className="modal-footer" style={{ borderTop: 0 }}>
							<button type="button" onClick={this.props.closeModal} className="btn dark btn-outline">CANCEL</button>
							<button
								type="button"
								className="btn green"
								onClick={this.saveIt}>SAVE</button>
						</div>
					</form>
				</Modal>
			</div>
		);
	}

}

export default SetDropdownModal;