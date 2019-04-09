import React from 'react';
import ReactDOM from 'react-dom';
import * as datatable from '../../scripts/table-datatables-buttons';
import moment from 'moment';
import '../../styles/plugins/datatables/datatables.min.css';
import '../../styles/custom.css';
import '../../styles/plugins/bootstrap/datatables.bootstrap.css';
import '../../scripts/datatable.js';
import '../../scripts/table-datatables-buttons.js';

export default class ActivityTab extends React.Component {
	render() {
		var activityList = this.props.activityData.map(function (useractivity, index) {
			// Activity tab activites partials
			if (useractivity.activity_type == 'success') {
				var successActivity = <div className="col1">
					<div className="cont">
						<div className="cont-col1">
							<div className="label label-sm label-info">
								<i className="fa fa-check"></i>
							</div>
						</div>
						<div className="cont-col2">
							<div className="desc"><span onClick={(e) => this.userActivityHandler(e, index)}>{useractivity.fullname}</span> {useractivity.activity}</div>
						</div>
					</div>
				</div>;
			}
			else if (useractivity.activity_type == 'notify') {

				var successActivity = <div className="col1">
					<div className="cont">
						<div className="cont-col1">
							<div className="label label-sm label-warning">
								<i className="fa fa-bell-o"></i>
							</div>
						</div>
						<div className="cont-col2">
							<div className="desc"><span onClick={(e) => this.userActivityHandler(e, index)}>{useractivity.fullname}</span> {useractivity.activity}</div>
						</div>
					</div>
				</div>;
			}
			else if (useractivity.activity_type == 'disable') {
				var successActivity = <div className="col1">
					<div className="cont">
						<div className="cont-col1">
							<div className="label label-sm label-default">
								<i className="fa fa-user"></i>
							</div>
						</div>
						<div className="cont-col2">
							<div className="desc"><span onClick={(e) => this.userActivityHandler(e, index)}>{useractivity.fullname}</span> {useractivity.activity}</div>
						</div>
					</div>
				</div>;
			}
			else if (useractivity.activity_type == 'errornotify') {
				var successActivity = <div className="col1">
					<div className="cont">
						<div className="cont-col1">
							<div className="label label-sm label-danger">
								<i className="fa fa-bell-o"></i>
							</div>
						</div>
						<div className="cont-col2">
							<div className="desc"><span onClick={(e) => this.userActivityHandler(e, index)}>{useractivity.fullname}</span> {useractivity.activity}</div>
						</div>
					</div>
				</div>;
			}
			else if (useractivity.activity_type == 'enable') {
				var successActivity = <div className="col1">
					<div className="cont">
						<div className="cont-col1">
							<div className="label label-sm label-success">
								<i className="fa fa-user"></i>
							</div>
						</div>
						<div className="cont-col2">
							<div className="desc"><span onClick={(e) => this.userActivityHandler(e, index)}>{useractivity.fullname}</span> {useractivity.activity}</div>
						</div>
					</div>
				</div>;
			}
			var currentTime = moment(useractivity.updatedAt).fromNow();
			return <tr key={index} className="feeds">
				<td><li>
					{successActivity}
					<div className="col2">
						<div className="date"> {currentTime} </div>
					</div>
				</li></td>
			</tr>;
		}.bind(this));
		return (<div className="tab-pane" id={this.props.tabId}>
			<div className="table-container">
				<table className="table table-striped table-bordered table-hover" id="activity_3">
					<thead>
						<tr>
							<th>Activity</th>
						</tr>
					</thead>
					<tbody>

						{activityList}

					</tbody>
				</table>
			</div>
		</div>);
	}
}