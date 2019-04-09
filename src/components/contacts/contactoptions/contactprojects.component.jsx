import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { browserHistory } from 'react-router';
import * as loader from '../../../constants/actionTypes.js';
import * as datatable from '../../../scripts/table-datatables-buttons';
import * as contactsactions from '../../../actions/contactOptionsActions';
import * as functions from '../../common/functions';
import autoBind from 'react-autobind';

class ContactProjects extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = { contactProjectData: [] };
    }

    componentWillMount() {
        var data = {
            companyId: localStorage.companyId,
            contactId: this.props.params.contactId
        }
        this
            .props
            .actions
            .getContactProjects(data);

        var data1 = {
            parent: 'Contacts',
            childone: 'Projects',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        setTimeout(function () {
            datatable.ContactProjectTable.init();
        }, 3000);
        functions.showLoader('project_list');
    }

    contactProject() {
        localStorage.setItem("contactProjId", this.props.params.contactId);
        browserHistory.push('/project/add');
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.contactoptions) {
            var contactproject = JSON.parse(JSON.stringify(nextProps.contactoptions));
            this.setState({ contactProjectData: contactproject });
            const el = findDOMNode(self.refs.project_list);
            setTimeout(function () {
                datatable.ContactProjectTable.init();
                $(el).unblock();
            }, 3000);
        }
    }

    render() {
        var projectList = this.state.contactProjectData;
        let stage;
        if (projectList) {
            var projectdata = projectList.map(function (project, index) {
                if (project.stageId == 1) {
                    stage = "Open"
                }
                else if (project.stageId == 2) {
                    stage = "In-Progress"
                }
                else if (project.stageId == 3) {
                    stage = "Closed"
                }
                let from = moment(project.startDate, moment.ISO_8601); // format in which you have the date
                let to = moment(project.endDate, moment.ISO_8601);     // format in which you have the date
                let duration = to.diff(from, 'days')
                return <tr key={index}>
                    <td>{project.title}</td>
                    <td>{project.categoryId ? project.categoryId.categoryName : '-'}</td>
                    <td>{stage}</td>
                    <td>{moment(project.startDate).format("MM/DD/YYYY")}</td>
                    <td>{moment(project.endDate).format("MM/DD/YYYY")}</td>
                    <td>{duration + ' ' + "days"}</td>
                </tr>;
            }.bind(this));
        }
        return (
            <div className="portlet light portlet-fit portlet-datatable bordered" id="project_list" ref="project_list">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Contact Projects</span>
                    </div>

                    <div className="actions">
                        {/* <a onClick={this.contactProject} className="btn btn-sm btn-circle green">
                            <i className="icon-plus"></i> New Project </a>&nbsp; */}
                        <Link to={"/contact/" + this.props.params.contactId} className="btn btn-sm btn-circle red">Back</Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container">
                        <table className="table table-striped table-bordered table-hover" id="contac_project_table">
                            <thead >
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Stage</th>
                                    <th>Date Begin</th>
                                    <th>Date End</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectdata}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { contactoptions: state.contactoptions.contactProjectsData };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(contactsactions, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactProjects);
