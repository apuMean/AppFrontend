import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
class GridFilter extends React.Component {
	constructor(props, context) {
		super(props, context);
		// this.state = {};
	}

	componentWillMount() {
	}
	render() {
		return (
			<form className="form-inline" >
				<div className="form-group">
					<label className="filter-col" style={{ marginRight: '0' }} htmlFor="pref-perpage">Show:</label>
					<select id="pref-perpage"
						className="form-control"
						value={this.props.per_page}
						onChange={this.props.handlePagingChange}>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
						<option value="20">20</option>
						<option value="25">25</option>
						<option value="30">30</option>
						<option value="35">35</option>
						<option value="40">40</option>
						<option value="45">45</option>
						<option value="50">50</option>
						<option value="55">55</option>
						<option value="60">60</option>
					</select>
				</div>
				<div className="form-group pull-right">
					<label className="filter-col" style={{ marginRight: '0' }} htmlFor="pref-search">Search:</label>
					<input type="text" className="form-control input-sm" id="pref-search"
						onChange={this.props.handleSearchChange}
						onKeyPress={this.props._search}
						value={this.props.searchText?this.props.searchText:''} />
				</div>
			</form>
		);
	}
}

export default GridFilter;