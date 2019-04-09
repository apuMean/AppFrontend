import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardActions from '../../actions/dashboardActions';

class SafetyTopic extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        var data = {
            parent: 'Dashboard',
            childone: 'Tailgates',
            childtwo: 'Safety Topic'
        };
        this.props.breadCrumb(data);
    }
    render() {

        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span className="caption-subject bold uppercase" style={{ "fontSize": "17px" }}>Safety Topics</span>
                    </div>
                </div><hr></hr>
                <div className="profile">
                    <div className="tabbable-line tabbable-full-width">
                        <ul className="nav nav-tabs">
                            <li className="active">
                                <a href="#tab_1_1" data-toggle="tab"> Content </a>
                            </li>
                            <li>
                                <a href="#tab_1_6" data-toggle="tab"> Attendees </a>
                            </li>
                            <div className="text-right">
                                <Link to="/tailgates" className="btn btn-sm btn-circle red">
                                    Cancel </Link>
                            </div>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane active" id="tab_1_1">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <div className="form-control form-control-static"> 22/05/2017 </div>
                                            <label htmlFor="lastname">Effective</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <div className="form-control form-control-static"> 28/05/2017 </div>
                                            <label htmlFor="lastname">Thru</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <div className="form-control form-control-static"> Camp meet </div>
                                            <label htmlFor="lastname">Safety Topic</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="portlet light bordered" style={{ "height": "300px" }}>
                                </div>
                            </div>

                            <div className="tab-pane" id="tab_1_6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <div className="form-control form-control-static"> 22/05/2017 </div>
                                            <label htmlFor="lastname">Effective</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <div className="form-control form-control-static"> 28/05/2017 </div>
                                            <label htmlFor="lastname">Thru</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <div className="form-control form-control-static"> Camp meet </div>
                                            <label htmlFor="lastname">Safety Topic</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="portlet light portlet-fit portlet-datatable bordered" style={{ "marginTop": "10px" }}>
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table className="table table-striped table-bordered table-hover" id="sample_3">
                                                    <thead>
                                                        <tr>
                                                            <th>Date Taken</th>
                                                            <th>Name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>23/05/2017</td>
                                                            <td>Sarvesh Dwivedi</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
export default connect(null, mapDispatchToProps)(SafetyTopic);
