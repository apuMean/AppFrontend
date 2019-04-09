import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from "moment";
import * as loader from '../../../constants/actionTypes.js';
import * as datatable from '../../../scripts/table-datatables-buttons.js';
import * as projectOptionAction from '../../../actions/projectOptionActions.js';
import "../../../styles/bootstrap-fileinput.css";
class ProjectActivities extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    componentWillMount() {

        var estimate = {
            companyId: localStorage.companyId,
            projectId: this.props.params.projectId
        }
        this
            .props
            .actions
            .getActivityList(estimate);

        var data = {
            parent: 'Projects',
            childone: 'Activities',
            childtwo: ''
        };
        this.props.breadCrumb(data);
    }

    componentDidMount() {
        $('div#activityList').block({
            message: loader.GET_LOADER_IMAGE,
            css: {
                width: '25%'
            },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });

        setTimeout(function () {
            datatable
                .ProjectMoreOptions
                .init();
            $('div#activityList').unblock();
        }, 2000);
    }

    componentWillReceiveProps(nextProps) { }
    render() {
        var activityType = '';
        var activityList = this
            .props
            .activityList
            .map(function (act, index) {
                if (act.activityType == "1") { activityType = "Note" }
                else if (act.activityType == "2") { activityType = "Event" }
                else if (act.activityType == "3") { activityType = "Task" }
                else if (act.activityType == "4") { activityType = "Email" }
                else if (act.activityType == "5") { activityType = "Fax" }
                else if (act.activityType == "6") { activityType = "Call" }
                else if (act.activityType == "7") { activityType = "Letter" }
                return <tr key={index}>
                    <td>{activityType}</td>
                    <td>{moment(act.createdAt).format('MM-DD-YYYY')}</td>
                    <td>{moment(act.createdAt).format('hh:mm:ss a')}</td>
                    <td>{act.activityId
                        ? act.activityId.subject
                        : ''}</td>
                    {/*<td>-</td>
                    <td>-</td>
                    <td>-</td>*/}
                    {/*<td>
                        <i
                            className="icon-close "
                            onClick={this
                            .handleDelete
                            .bind(this, act._id, index)}
                            id={act._id}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i
                            className="icon-eye "
                            onClick={this
                    .handleDetail
                    .bind(this, act._id)}></i>
                    </td>*/}
                </tr>;
            }.bind(this));
        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span
                            className="caption-subject bold uppercase"
                            style={{
                                "fontSize": "15px"
                            }}>Activities</span>
                    </div>
                </div>
                <hr></hr>
                <div className="text-right">
                    <Link
                        to={"/project/" + this.props.params.projectId}
                        className="btn btn-sm btn-circle red"
                        style={{
                            "marginBottom": "5px"
                        }}>
                        BACK
                    </Link>
                </div>
                <div className="portlet-body" id="activityList">
                    <div className="tab-content">
                        <div className="tab-pane active">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover"
                                                    id="project_activity">
                                                    <thead >
                                                        <tr>
                                                            <th>Type</th>
                                                            <th>Date</th>
                                                            <th>Time</th>
                                                            <th>Subject</th>
                                                            {/*<th>Priority</th>
                                                            <th>From/Assign by</th>
                                                            <th>To/Assign to</th>*/}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {activityList}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return { activityList: state.projectOption.activityList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(projectOptionAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectActivities);