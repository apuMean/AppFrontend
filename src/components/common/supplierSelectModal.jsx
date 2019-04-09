import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import "../../styles/bootstrap-fileinput.css";
class SelectSupplierModal extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            supplierData: null
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ supplierData: nextProps.supplierData })
    }

    render() {
        return (
            <div id={this.props.selectSupplierId} ref={this.props.selectSupplierId} className="modal fade" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="caption">
                                <span className="caption-subject bold uppercase">Select Supplier</span>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="table-container table-responsive" style={{ height: "150px", overflow: "auto" }}>
                                        <table className="table table-striped table-bordered">
                                            <thead >
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Dealer Price</th>
                                                    <th>List Price</th>
                                                    <th>Demo Price</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.supplierData}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn dark btn-outline"
                                onClick={this.props.handlePopUpClose.bind(this, 'supplier')}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SelectSupplierModal;