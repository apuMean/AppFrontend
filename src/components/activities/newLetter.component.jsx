import React, { PropTypes } from 'react';
import { Link } from 'react-router';
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

class NewLetter extends React.Component {
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
            templateList: []
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

    saveLetter() {
        var subject = ReactDOM
            .findDOMNode(this.refs.letter_subject)
            .value
            .trim();
        var description = ReactDOM
            .findDOMNode(this.refs.letter_subject)
            .value
            .trim();

        if (jQuery('#createLetter').valid()) {
            $('div#create_letter').block({
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
                description: ReactDOM
                    .findDOMNode(this.refs.letter_desc)
                    .value,
                subject: ReactDOM
                    .findDOMNode(this.refs.letter_subject)
                    .value,
                template: ReactDOM
                    .findDOMNode(this.refs.template)
                    .value,
                createdBy: localStorage.userName
            }
            this
                .props
                .actActions
                .createLetter(details);
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
        var template = this
            .state
            .templateList
            .map(function (template, index) {
                return <option value={template._id} key={index}>{template.title}</option>;
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
                            }}>New Letter</span>
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
                        }} className="btn blue" onClick={this.saveLetter}>Save</button>
                    </div>
                </div>
                <div className="portlet light bordered" id="create_letter">
                    <div className="portlet-body">
                        <form role="form" id="createLetter">
                            <div className="form-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <input
                                                type="text"
                                                className="form-control"
                                                ref="letter_subject"
                                                name="subject"
                                                defaultValue="" />
                                            <label htmlFor="form_control_1">Subject<span className="required">*</span>
                                            </label>
                                        </div>
                                        <div className="form-group  form-md-floating-label">
                                            <label htmlFor="form_control_1">Description<span className="required">*</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                placeholder="Description"
                                                ref="letter_desc"
                                                name="description"
                                                rows="9"></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group form-md-line-input ">
                                            <select className="form-control edited" ref="template" name="template">
                                                {template}
                                            </select>
                                            <label htmlFor="form_control_1">Template</label>
                                        </div>
                                        <div className="col-md-12">
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
                                        </div>
                                        <div className="col-md-12">
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
                                        </div>
                                        <div className="col-md-12">
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
export default connect(mapStateToProps, mapDispatchToProps)(NewLetter);