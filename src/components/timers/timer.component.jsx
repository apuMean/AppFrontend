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
import * as timerAction from '../../actions/timerActions';
import autoBind from 'react-autobind';

class Timer extends React.Component {
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
			parent: 'Timers',
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
			.timerActions
			.getTimersList(companyId);
	}

	componentDidMount() {
		functions.showLoader('timerList');
	}

	handleDetail(timerId) {
		browserHistory.push('/timer/' + timerId);
	}

	componentWillReceiveProps(nextProps) {

		if (nextProps.timerList) {
			var timerState = JSON.parse(JSON.stringify(nextProps.timerList));
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
					<td>{localStorage.userName}</td>
					<td>{moment(timer.startDate).format('MM-DD-YYYY')} {timer.startTime}</td>
					<td>{moment(timer.endDate).format('MM-DD-YYYY')} {timer.endTime}</td>
					<td>{timer.totalHours ? timer.totalHours : '-'}</td>
					<td>{timer.hoursDt ? timer.hoursDt : '-'}</td>
					<td>{timer.hoursOt ? timer.hoursOt : '-'}</td>
					<td>{timer.hoursRt ? timer.hoursRt : '-'}</td>
					<td>-</td>
					<td>{timer.projectId ? timer.projectId.title : '-'}</td>
					<td>{timer.employeeApproved ? 'Approved' : 'Pending'}</td>
				</tr>;
			}.bind(this));
		return (
			<div className="portlet light portlet-fit portlet-datatable bordered" id="timerList">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject bold uppercase">Timers</span>
					</div>

					<div className="actions">
						<Link to="/timer/add" className="btn btn-sm btn-circle green">
							<i className="icon-plus"></i> Add Timer </Link>
					</div>
				</div>
				<div className="portlet-body">
					<div className="table-container table-responsive">
						<table className="table table-striped table-bordered table-hover" id="timer_list">
							<thead >
								<tr>
									<th>User</th>
									<th>Start</th>
									<th>End</th>
									<th>Total Hrs</th>
									<th>Hrs DT</th>
									<th>Hrs OT</th>
									<th>Hrs RT</th>
									<th>Bill To</th>
									<th>Project</th>
									<th>Employee Approved</th>
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

	return { timerList: state.timer.timerList };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(dashboardActions, dispatch),
		timerActions: bindActionCreators(timerAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Timer);