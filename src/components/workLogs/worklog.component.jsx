import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as functions from '../common/functions';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as dashboardActions from '../../actions/dashboardActions';
import { browserHistory } from 'react-router';
import moment from 'moment';
// import * as timerAction from '../../actions/timerActions';
import * as worklogAction from '../../actions/worklogAction';
import autoBind from 'react-autobind';

class Worklog extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			timerData: [],
			timerId: '',
			deleteIndex: ''
		};
	}

	componentWillMount() {
		let data = {
			parent: 'Work Logs',
			childone: '',
			childtwo: ''
		};

		let companyId = {
			companyId: localStorage.companyId,
			companyEmployeeId:localStorage.employeeId
		};

		this.props.breadCrumb(data);
		this
			.props
			.worklogActions
			.getWorklogList(companyId);
	}

	componentDidMount() {
		functions.showLoader('timerList');
	}

	handleDetail(worklogId) {
		browserHistory.push('/worklog/' + worklogId);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.worklogList) {
			var timerState = JSON.parse(JSON.stringify(nextProps.worklogList));
			this.setState({ timerData: timerState });
			var timer_list = $('#timer_list').DataTable();
			timer_list.destroy();
			setTimeout(function () {
				datatable
					.TimerTable
					.init();
				$('div#timerList').unblock();
			}, 3000);
		}
	}
	render() {
		
		var timerList = this
			.state
			.timerData
			.map(function (timer, index) {
				return <tr key={index} onClick={this.handleDetail.bind(this, timer._id)}>
					<td>{timer.worklogNumber?timer.worklogNumber:'-'}</td>
					<td>{timer.projectId?timer.projectId.title:timer.serviceOrderId?timer.serviceOrderId.orderNumber:timer.otherValueId?timer.otherValueId.otherTitle:'-'}</td>
					<td>{timer.status==1 ? 'Checked In':'Checked Out'}</td>
					<td>{moment(timer.createdAt).format('ddd, MMM D, YYYY hh:mm a')}</td>
				</tr>;
			}.bind(this));
		return (
			<div className="portlet light portlet-fit portlet-datatable bordered" id="timerList">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject bold uppercase">Work Logs</span>
					</div>

					<div className="actions">
						<Link to="/worklog/add" className="btn btn-sm btn-circle green">
							<i className="icon-plus"></i> Add Entry </Link>
					</div>
				</div>
				<div className="portlet-body">
					<div className="table-container table-responsive">
						<table className="table table-striped table-bordered table-hover" id="timer_list">
							<thead >
								<tr>
									<th>Worklog #</th> 
									<th>Project/SO</th>
									<th>Check In/Out</th>
									<th>Date/Time</th>
								</tr>
							</thead>
							<tbody>
								{timerList}
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

	return { worklogList: state.worklog.worklogList };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(dashboardActions, dispatch),
		worklogActions: bindActionCreators(worklogAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Worklog);