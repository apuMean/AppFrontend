import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as appValid from '../../scripts/app';
import jQuery from 'jquery';
import * as layout from '../../scripts/app';
import moment from 'moment';
import * as loader from '../../constants/actionTypes.js';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as opportunityAction from '../../actions/opportunityAction';
import * as documentAction from '../../actions/documentActions';
import * as activityAction from '../../actions/activityActions.js';
import Select from 'react-select';
import "../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class NewEmail extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            disabled: false,
            contactValue: [],
            projectValue: [],
            opportunitieValue: [],
            contactOptions: [],
            projectOptions: [],
            opportunityOptions: [],
            contactids: [],
            oppids: [],
            projectids: [],
            templateList: [],
            attachmentName: ''
        }
    }

    componentDidMount() {
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
            appValid
                .FormValidationMd
                .init();
        }, 400);

        this
            .props
            .actActions
            .getTemplate();
    }

    handleContactChange(value) {
        this.state.contactids = [];
        this.setState({ contactValue: value })
        var val = value.map(function (res, index) {
            this
                .state
                .contactids
                .push(res.value);
        }.bind(this));

    }

    handleProjectChange(value) {
        this.state.projectids = [];
        this.setState({ projectValue: value })
        var val = value.map(function (res, index) {
            this
                .state
                .projectids
                .push(res.value);
        }.bind(this));
    }

    handleOppChange(value) {
        this.state.oppids = [];
        this.setState({ opportunityValue: value });
        var val = value.map(function (res, index) {
            this
                .state
                .oppids
                .push(res.value);
        }.bind(this));
    }

    onInputChangeContact(value) {
        var data = {
            firstname: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .oppActions
            .getIndividualData(data);
    }

    onInputChangeProject(value) {
        if (this.state.contactids.length > 0) {
            var data = {
                title: value,
                companyId: localStorage.companyId,
                contactArr: this.state.contactids
            }
            this
                .props
                .actions
                .getProjectData(data);
        }
    }

    onInputChangeOpp(value) {
        if (this.state.contactids.length > 0) {
            var data = {
                title: value,
                companyId: localStorage.companyId,
                contactId: this.state.contactids
            }
            this
                .props
                .actions
                .getOpportunityData(data);
        }
    }

    selectAttachment() {
        var upload = ReactDOM.findDOMNode(this.refs.uploadAttach);
        upload.click();
    }
    getAttachment(e) {
        var name = e.target.files[0].name;
        this.setState({ attachmentName: name })
    }
    removeAttachment() {
        this.setState({ attachmentName: '' })
    }
    saveEmail() {
        if (jQuery('#createEmail').valid()) {
            $('div#create_email').block({
                message: loader.GET_LOADER_IMAGE,
                css: {
                    width: '25%'
                },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });
            var details = {
                companyId: localStorage.companyId,
                contactId: this.state.contactids,
                projectId: this.state.projectids,
                opportunityId: this.state.oppids,
                subject: ReactDOM
                    .findDOMNode(this.refs.subject)
                    .value,
                // template: ReactDOM
                //     .findDOMNode(this.refs.template)
                //     .value,
                from: localStorage.userName,
                to: ReactDOM
                    .findDOMNode(this.refs.email_to)
                    .value,
                cc: ReactDOM
                    .findDOMNode(this.refs.email_cc)
                    .value,
                bcc: ReactDOM
                    .findDOMNode(this.refs.email_bcc)
                    .value,
                description: ReactDOM
                    .findDOMNode(this.refs.description)
                    .value
            }
            var attachment = this.state.attachmentName ? ReactDOM.findDOMNode(this.refs.uploadAttach).files[0] : '';
            this
                .props
                .actActions
                .createEmail(details, attachment);
        }
    }

    componentWillReceiveProps(nextProps) {
        var individual = [];
        var project = [];
        var opportunity = [];

        var individualList = nextProps
            .individualList
            .map(function (list, index) {
                var obj = {
                    value: list._id,
                    label: list.firstname + ' ' + list.lastname
                }
                individual.push(obj)
            }.bind(this));

        var projectList = nextProps
            .projectList
            .map(function (list, index) {
                var obj = {
                    value: list._id,
                    label: list.title
                }
                project.push(obj)
            }.bind(this));

        var opportunityList = nextProps
            .oppList
            .map(function (list, index) {
                var obj = {
                    value: list._id,
                    label: list.title
                }
                opportunity.push(obj)
            }.bind(this));

        if (nextProps.templateList.length > 0) {
            this.setState({ templateList: nextProps.templateList })
        } else {
            this.setState({ templateList: this.state.templateList })
        }

        this.setState({ contactOptions: individual, opportunityOptions: opportunity, projectOptions: project })

        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
    }
    render() {
        // var template = this
        //     .state
        //     .templateList
        //     .map(function (template, index) {
        //         return <option value={template._id} key={index}>{template.title}</option>;
        //     }.bind(this));
        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span
                            className="caption-subject bold uppercase"
                            style={{
                                "fontSize": "15px"
                            }}>New Email</span>
                    </div>
                    <hr></hr>
                    <div className="form-actions noborder text-right">
                        <Link to="/activity" style={{
                            "marginBottom": "5px"
                        }} className="btn red">
                            Cancel
                            </Link>&nbsp;&nbsp;
                            <button type="button" style={{
                            "marginBottom": "5px"
                        }} className="btn blue" onClick={this.saveEmail}>Save</button>
                    </div>
                </div>
                <div className="portlet light bordered" id="create_email">
                    <div className="portlet-body">
                        <form role="form" id="createEmail">
                            <div className="form-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input type="text" className="form-control" ref="email_from" disabled={true} key={localStorage.userEmail} defaultValue={localStorage.userEmail} />
                                                    <label htmlFor="email_from">From</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input type="text" className="form-control" ref="email_to" name="email_to" defaultValue="" />
                                                    <label htmlFor="email_to">To<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input type="text" className="form-control" ref="email_cc" name="email_cc" defaultValue="" />
                                                    <label htmlFor="email_cc">Cc</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input type="text" className="form-control" ref="email_bcc" name="email_bcc" defaultValue="" />
                                                    <label htmlFor="email_bcc">Bcc</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <input type="text" className="form-control" ref="subject" name="subject" defaultValue="" />
                                            <label htmlFor="subject">Subject<span className="required">*</span></label>
                                        </div>
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <label htmlFor="form_control_1">
                                                Attachment
                                             </label>&nbsp;
                                         <i className="fa fa-paperclip"></i>
                                            <div>  <input type="file" name="uploadAttach" ref="uploadAttach" style={{ display: "none" }} onChange={this.getAttachment} />
                                                <a className="btn btn-sm btn-circle green" onClick={this.selectAttachment}>
                                                    Browse
                                                </a>&nbsp;
                                                <span>{this.state.attachmentName}</span>&nbsp;&nbsp;
                                                {this.state.attachmentName ? <a href="javascript:;"><img src="../img/remove-icon-small.png" className="fa fa-times" onClick={this.removeAttachment} /></a> : null}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Contact">Contact<span className="required">*</span>
                                            </label>
                                            <Select
                                                multi
                                                disabled={this.state.disabled}
                                                value={this.state.contactValue}
                                                placeholder="Select Contact"
                                                options={this.state.contactOptions}
                                                onChange={this.handleContactChange}
                                                onInputChange={this.onInputChangeContact} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Project">Project<span className="required">*</span>
                                            </label>
                                            <Select
                                                multi
                                                disabled={this.state.disabled}
                                                value={this.state.projectValue}
                                                placeholder="Select Project"
                                                options={this.state.projectOptions}
                                                onChange={this.handleProjectChange}
                                                onInputChange={this.onInputChangeProject} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Opportunity">Opportunity<span className="required">*</span>
                                            </label>
                                            <Select
                                                multi
                                                disabled={this.state.disabled}
                                                value={this.state.opportunityValue}
                                                placeholder="Select Opportunity"
                                                options={this.state.opportunityOptions}
                                                onChange={this.handleOppChange}
                                                onInputChange={this.onInputChangeOpp} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/*<div className="form-group form-md-line-input ">
                                            <select className="form-control edited" ref="template" name="template">
                                                {template}
                                            </select>
                                            <label htmlFor="form_control_1">Template</label>
                                        </div>*/}
                                        <div className="form-group  form-md-floating-label">
                                            <label htmlFor="form_control_1">Description<span className="required">*</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                ref="description"
                                                placeholder="Description"
                                                rows="27"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { templateList: state.activityCreation.templateList, projectList: state.documentCreation.projectList, individualList: state.opportunity.individualList, oppList: state.documentCreation.oppList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(documentAction, dispatch),
        oppActions: bindActionCreators(opportunityAction, dispatch),
        actActions: bindActionCreators(activityAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(NewEmail);