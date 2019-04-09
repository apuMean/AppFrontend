import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardActions from '../../../actions/dashboardActions';
class ItemInventory extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount(){
        var data1 = {
            parent: 'Materials',
            childone: 'Inventory Log',
            childtwo: ''
        };

        this.props.breadCrumb(data1);
    }

    render() {
        return (
            <div className="portlet light portlet-fit portlet-datatable bordered">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Inventory Log</span>
                    </div>
                    <div className="actions">
                        <Link to={"/material/" + this.props.params.materialId} className="btn btn-sm btn-circle green">
                            <i className="icon-arrow-left"></i> Back </Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container table-responsive">
                        <table className="table table-striped table-bordered table-hover">
                            <thead >
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>User</th>
                                    <th>Adjustment Type</th>
                                    <th>Adjustment Info</th>
                                    <th>Previous Qty</th>
                                    <th>Qty Adjusted</th>
                                    <th>Final Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>22/05/2017</td>
                                    <td>-</td>
                                    <td>John Miller</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(dashboardActions, dispatch)
    };
}
export default connect(null, mapDispatchToProps)(ItemInventory);
