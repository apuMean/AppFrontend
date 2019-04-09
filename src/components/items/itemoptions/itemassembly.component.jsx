import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardActions from '../../../actions/dashboardActions';
class ItemAssembly extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        var data1 = {
            parent: 'Materials',
            childone: 'Related Assemblies',
            childtwo: ''
        };

        this.props.breadCrumb(data1);
    }

    render() {
        return (
            <div className="portlet light portlet-fit portlet-datatable bordered">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Related Assemblies</span>
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
                                    <th>Name</th>
                                    <th>SKU</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Qty on Hand</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Lan Cable</td>
                                    <td>478541</td>
                                    <td>Tool</td>
                                    <td>-</td>
                                    <td>45</td>
                                    <td>$1400</td>
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
export default connect(null, mapDispatchToProps)(ItemAssembly);
