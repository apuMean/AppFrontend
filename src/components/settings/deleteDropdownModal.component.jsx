import React from 'react';
import ReactDOM from 'react-dom';
import autoBind from 'react-autobind';

import Modal from 'react-responsive-modal';

class DeleteDropdownModal extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
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
					<div className="modal-header">
						<button type="button" className="close" onClick={this.props.closeModal}></button>
						<h4 className="modal-title">Delete {this.props.title}</h4>
					</div>
					<div className="modal-body">
						<p>Are you sure you want to delete this record ?</p>
					</div>
					<div className="modal-footer" style={{border:'none'}}>
						<button type="button" onClick={this.props.closeModal} className="btn dark btn-outline">No</button>
						<button
							type="button"
							className="btn green"
							onClick={this.props.deleteHandler}>Yes</button>
					</div>
				</Modal>
				{/* <Modal
                    isOpen={this.props.modalIsOpen}
                    onRequestClose={this.props.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal">
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <button type="button" className="close" onClick={this.props.closeModal} aria-hidden="true"></button>
                                <h4 className="modal-title">Add {this.props.title}</h4>
                            </div>
                            <div className="modal-body">

                            </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal" onClick={this.props.closeModal} className="btn dark btn-outline">No</button>
                                <button
                                    type="button"
                                    className="btn green"
                                    onClick={this.props.deleteHandler}>Yes</button>
                            </div>
                        </div>
                    </div>
                </Modal> */}
			</div>
		);
	}

}

export default DeleteDropdownModal;