import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import "../../styles/bootstrap-fileinput.css";
class ConfirmModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {

        return (
            <div
                id={this.props.duplicateModalId}
                className="modal fade"
                tabIndex="-1"
                aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title">Duplicate Estimate</h4>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to duplicate estimate ?
                        </div>
                        <div className="modal-footer">
                            <button type="button" data-dismiss="modal" className="btn dark btn-outline">No</button>
                            <button
                                type="button"
                                className="btn green"
                                onClick={this.props.duplicateEstimate}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfirmModal;