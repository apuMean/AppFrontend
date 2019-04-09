import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { browserHistory } from 'react-router';
import * as functions from '../common/functions';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as projectActions from '../../actions/projectActions';
import * as dashboardActions from '../../actions/dashboardActions';
import autoBind from 'react-autobind';

class Project extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			projectData: ''
		};
	}

	componentWillMount() {
		var data = {
			parent: 'Projects',
			childone: '',
			childtwo: ''
		}; var companyId = {
			companyId: localStorage.companyId
		};
		this.props.breadCrumb(data);
		this.props.projectactions.getProjects(companyId);
	}

	componentDidMount() {
		functions.showLoader('projects_list');
	}

	componentWillReceiveProps(nextProps) {

		if (this.props.projectdata) {
			var projectstate = JSON.parse(JSON.stringify(nextProps.projectdata));
			this.setState({
				projectData: projectstate
			});
			var projects_table = $('#projects_table').DataTable();
			projects_table.destroy();
			setTimeout(function () {
				datatable.ProjectTable.init();
				$('div#projects_list').unblock();
			}, 3000);
		}
	}

	handleDetail(projectId, projectName) {
		if (projectId) {
			localStorage.setItem('projectName', projectName);
			browserHistory.push('/project/' + projectId);
		}
	}

	render() {
		var projectdata = this.state.projectData;
		if (projectdata) {
			var projectsList = projectdata.map(function (project, index) {
				let stage;
				let from = moment(project.startDate, moment.ISO_8601); // format in which you have the date
				let to = moment(project.endDate, moment.ISO_8601);     // format in which you have the date

				/* using diff */
				let duration = to.diff(from, 'days');
				if (project.stageId == 1) {
					stage = 'Open';
				}
				else if (project.stageId == 2) {
					stage = 'In-Progress';
				}
				else if (project.stageId == 3) {
					stage = 'Closed';
				}
				return <tr key={index} onClick={this.handleDetail.bind(this, project._id, project.title)}>
					<td>{project.title}</td>
					<td>{project.categoryId?project.categoryId.categoryName:'-'}</td>
					<td>{stage?stage:'-'}</td>
					<td>{project.startDate?moment(project.startDate, moment.ISO_8601).format('L'):'-'}</td>
					<td>{project.endDate?moment(project.endDate, moment.ISO_8601).format('L'):'-'}</td>
					<td>{project.startDate&&project.startDate?duration + ' ' + 'days':'-'}</td>
				</tr>;
			}.bind(this));
		}
		return (
			<div className="portlet light portlet-fit portlet-datatable bordered">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject bold uppercase">Projects</span>
					</div>

					<div className="actions">
						<Link to="/project/add" className="btn btn-sm btn-circle green">
							<i className="icon-plus"></i> Add Project </Link>
					</div>
				</div>
				<div className="portlet-body" id="projects_list">
					<div className="table-container table-responsive">
						<table className="table table-striped table-bordered table-hover" id="projects_table">
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
								{projectsList}
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

	return { projectdata: state.project.projectList };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(dashboardActions, dispatch),
		projectactions: bindActionCreators(projectActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Project);
