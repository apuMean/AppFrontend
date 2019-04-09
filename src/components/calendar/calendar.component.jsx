import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardActions from '../../actions/dashboardActions.js';
import * as calendarAction from '../../actions/calendarAction.js';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import autoBind from 'react-autobind';
import events from '../common/events';
import '../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css';
// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

//Calendar component
let contactIds = [];
class Calendar extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			isChecked: false,
			eventsList: []
		};
	}

	handleContactsChange(value, eve) {
		this.state = {
			isChecked: true
		};

		let isContacts = eve.target.checked;
		if (isContacts) {
			contactIds.push(value);
		} else {
			contactIds.splice(value, 1);
		}
		var data = {
			companyId: localStorage.companyId,
			contactId: contactIds
		};
		this
			.props
			.actions
			.getEventsListByContact(data);
	}

	handleGetEvents() {
		$('input[name=contacts]').prop('checked', false);
		this.state = {
			isChecked: false
		};
		var data = {
			companyId: localStorage.companyId
		};
		this
			.props
			.actions
			.getEventsList(data);
	}

	componentWillMount() {
		var data = {
			companyId: localStorage.companyId
		};
		this.props.actions.getEventsList(data);
		this.props.actions.getIndividualList(data);
	}
	componentWillReceiveProps(nextProps) {

		this.setState({
			eventsList: nextProps.getEventList,
			individualList: nextProps.getIndividualList
		});
	}

	selectEvent(event) {
	}
	componentDidMount() {
		var data = {
			parent: 'Calendar',
			childone: '',
			childtwo: ''
		};
		this.props.breadCrumb(data);
	}
	render() {
		var eventsRecord = this.state.eventsList;
		var individualsList = this.state.individualList;
		if (individualsList) {
			var individualArray = individualsList.map(function (individual, index) {
				return <tr key={index}>
					<td><label className="mt-checkbox"> {individual.firstname ? individual.firstname : '--'}
						<input type="checkbox"
							key={individual._id}
							defaultValue={individual._id}
							name="contacts"
							className="contacts"
							ref="contacts"
							onChange={this.handleContactsChange.bind(this, individual._id)} />
						<span></span>
					</label></td>
				</tr>;
			}.bind(this));
		}
		return (
			<div>
				<div className="portlet-title">
					<div className="caption">
						<i className="icon-users "></i>
						<span className="caption-subject bold uppercase" style={{ 'fontSize': '17px' }}>Calendar</span>
					</div>
				</div><hr></hr>
				<div className="portlet light bordered">
					<div className="row">
						<div className="col-md-9">
							<div style={{ height: '600px' }}>
								<BigCalendar
									selectable={true}
									events={eventsRecord}
									defaultView='month'
									scrollToTime={new Date(1970, 1, 1, 6)}
									defaultDate={new Date()}
									onSelectEvent={this.selectEvent}
									popup={true}
								/>
							</div>
						</div>
						<div className="col-md-3">
							<div className="portlet light portlet-fit portlet-datatable bordered">
								<div className="portlet-body">
									<div className="table-container table-responsive">
										<table className="table table-striped table-bordered table-hover" id="sample_3">
											<thead>
												<tr>
													<th>Contacts</th>
												</tr>
											</thead>
											<tbody>
												{individualArray}
											</tbody>
										</table>
										<button onClick={this.handleGetEvents} className="btn blue">Clear</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {

	return {
		getEventList: state.eventRecordsList.eventRecordsList,
		getIndividualList: state.individualList.individualList
	};
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		oppActions: bindActionCreators(dashboardActions, dispatch),
		actions: bindActionCreators(calendarAction, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
