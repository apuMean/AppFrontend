import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import "../../styles/bootstrap-fileinput.css";
class PopupModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {

        return (
            <div
                id={this.props.modalId}
                className="modal fade bs-modal-lg"
                tabIndex="-1"
                data-backdrop="static"
                data-keyboard="false"
                aria-hidden="true">
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title">{this.props.header}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" data-dismiss="modal" className="btn red">Cancel</button>
                            <button
                                type="button"
                                /*data-dismiss="modal"*/
                                className="btn green"
                                id="send-invite-button"
                                onClick={this.props.addDone}>Save</button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default PopupModal;