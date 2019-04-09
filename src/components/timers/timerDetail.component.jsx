import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import * as timerAction from '../../actions/timerActions';
import { connect } from 'react-redux';
import moment from 'moment';
import * as functions from '../common/functions';
import { bindActionCreators } from 'redux';
import "../../styles/bootstrap-fileinput.css";
import DeleteModal from '../common/deleteModal.component.js';
import autoBind from 'react-autobind';

class TimerDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
    }

    componentWillMount() {
        var data1 = {
            parent: 'Timers',
            childone: '',
            childtwo: ''
        };

        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        var timerId = {
            companyId: localStorage.companyId,
            timerId: this.props.params.timerId
        }
        this
            .props
            .actions
            .getTimerDetailValues(timerId);
    }

    handleDelete() {
        $('#timer_delete').modal('show');
    }

    deleteTimerHandler() {
        if (this.props.params.timerId) {
            $('#timer_delete').modal('hide');
            // functions.showLoader('timer_detail');
            var data = {
                timerId: this.props.params.timerId
            }
            this.props.actions.deleteTimer(data);
        }
    }

    render() {
        var timerData = this.props.timerDetail;
        return (
            <div>
                {timerData
                    ? <div>
                        <div className="portlet-title tabbable-line">
                            <ul className="nav nav-tabs">
                                <li className="active">
                                    <a href="#timer-add" data-toggle="tab"> Timer </a>
                                </li>
                                <li>
                                    <a href="#timer-moreinfo" data-toggle="tab"> More Info </a>
                                </li>
                                <div className="text-right">
                                    <Link to="/timer" className="btn btn-sm btn-circle red">
                                        Cancel </Link>&nbsp;&nbsp;
                                        <button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
                                        Delete </button>&nbsp;&nbsp;
                                    <Link to={"/timer/" + this.props.params.timerId + '/edit'} className="btn btn-sm btn-circle green">
                                        Edit </Link>
                                </div>
                            </ul>
                        </div>
                        <div className="portlet light bordered" id="timer_detail">
                            <div className="portlet-body">
                                <div className="tab-content">
                                    <div className="tab-pane active" id="timer-add">
                                        <div className="portlet-title">
                                            <div className="caption">
                                                <span className="caption-subject bold uppercase">General Details</span>
                                            </div>
                                        </div>
                                        <form role="form">
                                            <div className="form-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {localStorage.userName} </div>
                                                            <label htmlFor="form_control_1">User</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {timerData.projectId ? timerData.projectId.title : ''} </div>
                                                            <label htmlFor="form_control_1">Project</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {moment(timerData.startDate).format("MM-DD-YYYY")}{timerData.startTime} </div>
                                                            <label htmlFor="form_control_1">Start</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {moment(timerData.endDate).format("MM-DD-YYYY")}{timerData.endTime} </div>
                                                            <label htmlFor="form_control_1">End</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {timerData.totalHours} </div>
                                                            <label htmlFor="form_control_1">Total Hrs</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {timerData.description} </div>
                                                            <label htmlFor="form_control_1">Description</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {timerData.contactId.firstname + ' ' + timerData.contactId.lastname} </div>
                                                            <label htmlFor="form_control_1">Contact</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {timerData.projectTaskId ? timerData.projectTaskId.itemName : ''} </div>
                                                            <label htmlFor="form_control_1">Project Item</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {timerData.wageRate} </div>
                                                            <label htmlFor="form_control_1">Wage Rate</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {timerData.employeeApproved ? "Approved" : "Pending"} </div>
                                                            <label htmlFor="form_control_1">Emp Approved</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="tab-pane" id="timer-moreinfo">
                                        <div className="portlet-title tabbable-line">
                                            <div className="caption">
                                                <span className="caption-subject font-dark bold uppercase">Other Details</span>
                                            </div>
                                        </div>
                                        <div className="portlet-body">
                                            <div className="tab-content">
                                                <form action="#" className="horizontal-form">
                                                    <div className="form-body">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                                    <div className="form-control form-control-static"> {timerData.description} </div>
                                                                    <label htmlFor="form_control_1">Desc</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                                    <div className="form-control form-control-static"> - </div>
                                                                    <label htmlFor="form_control_1">Created By</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                                    <div className="form-control form-control-static"> {timerData.createdAt} </div>
                                                                    <label htmlFor="form_control_1">On</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                                    <div className="form-control form-control-static"> {timerData.timerNumber} </div>
                                                                    <label htmlFor="form_control_1">Timer #</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                                    <div className="form-control form-control-static"> - </div>
                                                                    <label htmlFor="form_control_1">Modified By</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                                    <div className="form-control form-control-static"> - </div>
                                                                    <label htmlFor="form_control_1">On</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : null}
                <DeleteModal
                    deleteModalId="timer_delete"
                    deleteUserHandler={this.deleteTimerHandler} />
            </div >

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return { timerDetail: state.timer.timerDetailData };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(timerAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(TimerDetail)