import React from 'react';
import { Link } from 'react-router';
class ConfirmationDialog extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <div id={this.props.id}
                className="modal fade"
                tabIndex="-1"
                aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.message}
                        </div>
                        <div className="modal-footer">
                            <button type="button" data-dismiss="modal" className="btn dark btn-outline">No</button>
                            <button
                                type="button"
                                className="btn green"
                                onClick={this.props.confirmationHandler}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfirmationDialog;