import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jQuery from 'jquery';
import moment from 'moment';
import * as loader from '../../../constants/actionTypes.js';
import * as appValid from '../../../scripts/app';
import * as layout from '../../../scripts/app';
import * as projectOptionAction from '../../../actions/projectOptionActions.js';
import * as projectActions from '../../../actions/projectActions';
import "../../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class NewDaily extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            projectDetails: '',
            roleDetails: [],
            customerId: '',
            date: '',
            projectNumber: '',
            daysOfWeek: '',
            projectTitle: '',
            attention: '',
            secondaryContact: '',
            projectManager: '',
            leadTech: ''
        }
    }

    componentWillMount() {
        var projectId = {
            projectId: this.props.params.projectId
        }
        if (this.props.params.projectId) {
            this.props.projectactions.getProjectDetails(projectId);
        }
    }

    componentWillReceiveProps(nextProps) {
        var roles = [];
        let leadTech = '';
        let projectManager = '';
        if (nextProps.projectDetail) {
            var projectstate = JSON.parse(JSON.stringify(nextProps.projectDetail.projectdetail));
            var roleState = JSON.parse(JSON.stringify(nextProps.projectDetail.roleList));
            if (nextProps.projectDetail.roleList != 0) {
                var roleList = nextProps.projectDetail.roleList.map(function (role, index) {
                    if (role.roleType == 1) {
                        projectManager = role.firstname + ' ' + role.lastname
                    }
                    else if (role.roleType == 2) {
                        leadTech = role.firstname + ' ' + role.lastname
                    }
                });
            }
            this.setState({
                projectDetails: projectstate,
                projectManager: projectManager,
                leadTech: leadTech
            });
            setTimeout(function () {
                appValid
                    .FormValidationMd
                    .init();
            }, 400);
        }
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
    }

    componentDidMount() {
        appValid
            .FormValidationMd
            .init();
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
    }

    handleDailiesAdd() {
        var dailyData = {
            projectId: this.props.params.projectId,
            companyId: localStorage.companyId,
            customerId: this.state.projectDetails ? this.state.projectDetails.customerId._id : '',
            problems: ReactDOM.findDOMNode(this.refs.problems).value,
            date: moment().format('L'),
            projectNumber: this.state.projectDetails ? this.state.projectDetails.projectNumber : '',
            daysOfWeek: moment().format('dddd'),
            attention: this.state.projectDetails ? this.state.projectDetails.individualId._id : '',
            projectManager: this.state.projectManager,
            leadTech: this.state.leadTech,
            projectTitle: this.state.projectDetails ? this.state.projectDetails.title : '',
            dailyProduction: ReactDOM.findDOMNode(this.refs.dailyProduction).value,
            resolution: ReactDOM.findDOMNode(this.refs.resolution).value,
            workPlan: ReactDOM.findDOMNode(this.refs.workPlan).value,
            onSiteTeamMember: ReactDOM.findDOMNode(this.refs.onSiteTeamMember).value,
            notes: ReactDOM.findDOMNode(this.refs.notes).value,
            preparedBy: localStorage.userName
        }
        if (jQuery('#createDaily').valid()) {
            $('div#create_daily').block({
                message: loader.GET_LOADER_IMAGE,
                css: { width: '25%' },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });
            this.props.actions.addDailies(dailyData);
        }
    }
    render() {
        return (
            <div>
                {this.state.projectDetails ?
                    <div id="createPdf">
                        <div className="portlet-title tabbable-line">
                            <ul className="nav nav-tabs">
                                <li className="active">
                                    <a href="#daily-add" data-toggle="tab">
                                        Daily
                            </a>
                                </li>
                                <div className="form-actions noborder text-right">
                                    <Link to={"/project_dailies/" + this.props.params.projectId} className="btn red" >Cancel</Link>&nbsp;&nbsp;
                                    <button type="button" className="btn blue" onClick={this.handleDailiesAdd}>Save</button>
                                </div>
                            </ul>
                        </div>
                        <div className="portlet light bordered" id="create_daily">
                            <div className="portlet-body">
                                <div className="tab-content">
                                    <div className="tab-pane active" id="daily-add">

                                        <form role="form" id="createDaily">
                                            <div className="form-body">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {this.state.projectDetails.customerId.companyName ? this.state.projectDetails.customerId.companyName : ''}
                                                            </div>
                                                            <label htmlFor="form_control_1">Company</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {moment().format('L')}
                                                            </div>
                                                            <label htmlFor="form_control_1">Date</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {this.state.projectDetails.projectNumber ? this.state.projectDetails.projectNumber : ''}
                                                            </div>
                                                            <label htmlFor="form_control_1">Project #</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {moment().format('dddd')}
                                                            </div>
                                                            <label htmlFor="form_control_1">Day Of Week</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {this.state.projectManager ? this.state.projectManager : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Project Manager</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {this.state.leadTech ? this.state.leadTech : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Lead Tech</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {this.state.projectDetails.individualId._id ? this.state.projectDetails.individualId.firstname + ' ' + this.state.projectDetails.individualId.lastname : ''}
                                                            </div>
                                                            <label htmlFor="form_control_1">Attention</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {this.state.projectDetails.title ? this.state.projectDetails.title : ''}
                                                            </div>
                                                            <label htmlFor="form_control_1">Project Title</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <textarea
                                                                className="form-control"
                                                                ref="dailyProduction"
                                                                name="dailyProduction"
                                                                rows="2"></textarea>
                                                            <label htmlFor="user">Daily Production<span className="required">*</span></label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <textarea
                                                                className="form-control"
                                                                ref="problems"
                                                                name="problems"
                                                                rows="2"></textarea>
                                                            <label htmlFor="user">Problems<span className="required">*</span></label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <textarea className="form-control" ref="resolution" name="resolution" rows="2"></textarea>
                                                            <label htmlFor="user">Resolutions<span className="required">*</span></label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <textarea
                                                                className="form-control"
                                                                ref="workPlan"
                                                                name="workPlan"
                                                                rows="2"></textarea>
                                                            <label htmlFor="user">Work plan for tommorrow<span className="required">*</span></label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <textarea
                                                                className="form-control"
                                                                ref="onSiteTeamMember"
                                                                name="onSiteTeamMember"
                                                                rows="2"></textarea>
                                                            <label htmlFor="user">Alliance Team Members on Site</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <textarea className="form-control" ref="notes" name="notes" rows="2"></textarea>
                                                            <label htmlFor="user">Notes</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id=""
                                                                name="user"
                                                                readOnly={"readonly"}
                                                                defaultValue={localStorage.userName ? localStorage.userName : ''} />
                                                            <label htmlFor="user">Prepared By</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : null}
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return {
        projectDetail: state.project.projectDetailData
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(projectOptionAction, dispatch),
        projectactions: bindActionCreators(projectActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(NewDaily);