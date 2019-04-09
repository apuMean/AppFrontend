import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as itemAction from '../../actions/itemAction.js';
import * as dashboardActions from '../../actions/dashboardActions';
import * as config from '../../../tools/config';
import * as functions from '../common/functions';
import autoBind from 'react-autobind';
import { isValidMaterialSheet } from '../shared/isValidMaterialSheet';
import { UPLOAD_CSV, UPLOAD_CRESTRON_CSV, UPLOAD_EXTRON_CSV } from '../../../tools/apiConfig';

class ImportItems extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			itemData: []
		};
	}

	componentWillMount() {
		var data1 = {
			parent: 'Materials',
			childone: '',
			childtwo: ''
		};

		this.props.breadCrumb(data1);
	}

	componentDidMount() {

		setTimeout(function () {
			datatable
				.ItemTable
				.init();
		}, 2000);

	}

	componentWillReceiveProps(nextProps) {
		let self = this;
		if (nextProps.itemLogs) {
			$('input[type="file"]').val(null);
			let itemState = JSON.parse(JSON.stringify(nextProps.itemLogs));
			let data = Object.values(itemState);
			let currentLength = data.length;
			data.splice(currentLength - 1, 1);
			this.setState({ itemData: data });
			let dtable = findDOMNode(self.refs.item_list);
			var item_list = $(dtable).DataTable();
			item_list.destroy();
			const el = findDOMNode(self.refs.itemList);
			setTimeout(function () {
				datatable
					.ItemTable
					.init();
				$(el).unblock();
			}, 3000);
		}
	}

	uploadCsvItems(e) {
		debugger;
		let itemsCsv = e.target.files[0];
		let name = itemsCsv.name;
		if (!isValidMaterialSheet(name)) {
			console.log('');
		}
		else {
			let result = name.match(/crestron|extron/i);
			if (result) {
				let supplierName = result[0].toUpperCase();
				switch (supplierName) {
				case 'CRESTRON':
					functions.showLoader('itemList');
					this.props.actions.uploadItemsCsv(itemsCsv, UPLOAD_CRESTRON_CSV);
					break;
				case 'EXTRON':
					functions.showLoader('itemList');
					this.props.actions.uploadItemsCsv(itemsCsv, UPLOAD_EXTRON_CSV);
					break;
				}
			}
			else {
				functions.showLoader('itemList');
				this.props.actions.uploadItemsCsv(itemsCsv, UPLOAD_CSV);
			}
		}
	}
	render() {
		var itemList = this.state.itemData.map(function (item, index) {
			return <tr key={index}>
				<td>{item.mfg ? item.mfg : '-'}</td>
				<td>{item.model ? item.model : '-'}</td>
				<td>{item.partNumber ? item.partNumber : '-'}</td>
				<td>{item.name ? item.name : '-'}</td>
			</tr>;
		}.bind(this));
		return (
			<div className="portlet light portlet-fit portlet-datatable bordered" id="itemList" ref="itemList">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject bold uppercase">Rejected imported materials log</span>
					</div>

					<div className="actions">
						<a href={config.IMPORT_ITEM_SAMPLE_HEROKU} target="_blank" className="btn btn-sm btn-circle blue">
							<i className="icon-paper-clip"></i> Download Import Sample </a>&nbsp;&nbsp;&nbsp;
						<span className="btn btn-sm btn-circle yellow btn-file">
							<span className="fileinput-new">
								<i className="icon-plus"></i> Upload Import File
							</span>
							<input type="hidden" />
							<input type="file" name="itemFileUpload" ref="itemFileUpload" id="itemFileUpload" accept='.csv' onChange={this.uploadCsvItems.bind(this)} />
						</span>&nbsp;&nbsp;&nbsp;
						<Link to="/material" className="btn btn-sm btn-circle red">Back </Link>
					</div>
				</div>
				<div className="portlet-body">
					<div className="table-container table-responsive">
						<table className="table table-striped table-bordered table-hover" id="item_list" ref="item_list">
							<thead >
								<tr>
									<th>Mfg</th>
									<th>Model</th>
									<th>Part No</th>
									<th>Name</th>
								</tr>
							</thead>
							<tbody>
								{itemList}
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
	return {
		itemLogs: state.itemCreation.itemLogs
	};
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(itemAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(ImportItems);
