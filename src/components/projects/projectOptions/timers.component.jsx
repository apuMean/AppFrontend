import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from "moment";
import { browserHistory } from 'react-router';
import * as loader from '../../../constants/actionTypes.js';
import * as datatable from '../../../scripts/table-datatables-buttons.js';
import * as projectOptionAction from '../../../actions/projectOptionActions.js';
import "../../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class ProjectTimers extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
    }
    componentWillMount() {

        var timer = {
            companyId: localStorage.companyId,
            projectId: this.props.params.projectId
        }
        this
            .props
            .actions
            .getTimerList(timer);

        var data1 = {
            parent: 'Projects',
            childone: 'Timers',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        $('div#timerList').block({
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
            $('div#timerList').unblock();
        }, 2000);
    }
    projectTimer() {
        localStorage.setItem("projectTimerId", this.props.params.projectId);
        localStorage.setItem("timerProjectName", localStorage.projectName);
        browserHistory.push('/timer/add');
    }
    componentWillReceiveProps(nextProps) { }
    render() {
        var timerList = this
            .props
            .timerList
            .map(function (timer, index) {
                return <tr key={index}>
                    <td>{timer.projectId
                        ? timer.projectId.projectNumber
                        : '-'}</td>
                    <td>{timer.projectId
                        ? timer.projectId.title
                        : '-'}</td>
                    <td>NA</td>
                    <td>-</td>
                    <td>{localStorage.userName}</td>
                    <td>{moment(timer.startDate).format('MM-DD-YYYY hh:mm:ss a')}</td>
                    <td>{moment(timer.endDate).format('MM-DD-YYYY hh:mm:ss a')}</td>
                    {/*<td>
                        <i
                            className="icon-close "
                            onClick={this
                            .handleDelete
                            .bind(this, timer._id, index)}
                            id={timer._id}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i
                            className="icon-eye "
                            onClick={this
                    .handleDetail
                    .bind(this, timer._id)}></i>
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
                            }}>Timers</span>
                    </div>
                </div>
                <hr></hr>
                <div className="text-right" style={{ "marginBottom": "5px" }}>
                    <a className="btn btn-sm btn-circle green" onClick={this.projectTimer}>
                        <i className="icon-plus"></i>
                        New Timer
                    </a>&nbsp;&nbsp;
                    <Link
                        to={"/project/" + this.props.params.projectId}
                        className="btn btn-sm btn-circle red">
                        Back
                    </Link>
                </div>
                <div className="portlet-body" id="timerList">
                    <div className="tab-content">
                        <div className="tab-pane active">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-title">

                                        </div>
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover"
                                                    id="project_timer">
                                                    <thead >
                                                        <tr>
                                                            <th>Project #</th>
                                                            <th>Project Title</th>
                                                            <th>Notes</th>
                                                            <th>Time Card</th>
                                                            <th>User</th>
                                                            <th>Start Date</th>
                                                            <th>End Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {timerList}
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
    return { timerList: state.projectOption.timerList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(projectOptionAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectTimers);