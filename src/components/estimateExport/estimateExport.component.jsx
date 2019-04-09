import React from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EstimatePdfViewer from './estimatePdfViewer.component';
import EstimateConfig from './estimateConfig.component';
import * as estimateActions from '../../actions/estimateActions';
import * as pdfGeneration from '../../actions/estimatePdfGenerationAction';
import Sortable from 'sortablejs';
import AddOther from '../common/addOtherModal.component';
import BlockUi from 'react-block-ui';
import moment from 'moment';
import autoBind from 'react-autobind';
import { EXPORT_LOADER_IMAGE } from '../../constants/actionTypes';
import socketIOClient from 'socket.io-client';
import * as api from '../../../tools/apiConfig';
import RichTextEditor from 'react-rte';
import LZUTF8 from 'lzutf8';


class EstimateExport extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			revisedItems: [],
			estimateDetails: '',
			itemLists: [],
			individualPhone: '',
			individualAddress: '',
			individualInternet: '',
			currentRevisionId: '',
			formats: [],
			columns: [],
			totals: [],
			currentFormatId: '',
			currentRevisionName: '',
			currentRevName: '',
			portrait: false,
			landscape: false,
			combineMfgModelPartDesc: true,
			blocking: true,
			dataRecieved: false,
			showDollarSign: true,
			includeSign: false,
			formatAdd: false,
			currentSelectedFormat: {
				columnsConfig: [],
				totalConfig: [],
				portrait: true,
				landscape: false,
				cmmpd: true,
				dollarSign: true,
				signature: false,
				showShipping: true,
				estimateName:false
			},
			note: '',
			projectName: '',
			proposedServices:RichTextEditor.createEmptyValue(),
			defaultProService:RichTextEditor.createEmptyValue(),
			projectLocation: '',
			loaderMessage: '',
			endpoint:api.SOCKETURL,
			showWarnHead:false,
			modifierName:'',
			selectedRevision:''
		};
	}

	componentWillMount() {
		const socket = socketIOClient(this.state.endpoint);
		socket.on('update estimate', (username) => {
			this.setState({
				showWarnHead: true,
				modifierName:username
			});
		});
		this.setState({ dataRecieved: true });
		let companyId = {
			companyId: localStorage.companyId
		};
		let estimateId = {
			estimateId: this.props.params.estimateId
		};
		this.props.actions.getAssociatedFormats(estimateId);
		this.props.estactions.getEstimateDetails(estimateId);
		this.props.actions.getRevisionList(estimateId);

	}

	componentWillReceiveProps(nextProps) {

		if (nextProps.isLoaded) {
			this.setState({ blocking: false });
		}
		if (nextProps.newFormat) {
			let formatList = this.state.formats;
			formatList.push(nextProps.newFormat);
			this.setState({ formats: formatList });
		}
		if (nextProps.estimateDetails && nextProps.formatsList.length && this.state.dataRecieved && nextProps.revisionList.length) {
			let estimateDetailState = JSON.parse(JSON.stringify(nextProps.estimateDetails.estimateDetails));
			let estimateItemState = nextProps.revisionList.length ? JSON.parse(JSON.stringify(nextProps.revisionList[0].lineItems)) : [];
			let revisions = JSON.parse(JSON.stringify(nextProps.revisionList));
			let formatConfigs = nextProps.formatsList.length ? JSON.parse(JSON.stringify(nextProps.formatsList)) : [];

			if (estimateDetailState.formatId) {
				let currentFormatData = formatConfigs.find(o => o._id === estimateDetailState.formatId);
				this.setState({
					currentFormatId: estimateDetailState.formatId,
					currentSelectedFormat: currentFormatData
				});
			}
			else {
				this.setState({
					currentFormatId: '',
					currentSelectedFormat: JSON.parse(JSON.stringify(nextProps.formatsList[0]))
				});
			}
			let phone = nextProps.estimateDetails.individualPhone?nextProps.estimateDetails.individualPhone:'';
			var str = phone;
			var newStr = str.replace(/_/g, '');
			phone = newStr;
			if(revisions[0].revisionName=='Rev0'){
				var res = estimateDetailState.proposedServices.toString('html');
				this.setState({
					proposedServices: RichTextEditor.createValueFromString(res, 'html')
				});
			}else if(revisions[0].proposedServices){
				var res = revisions[0].proposedServices.toString('html');
				this.setState({
					proposedServices: RichTextEditor.createValueFromString(res, 'html')
				});
			}else{
				this.setState({
					proposedServices:  RichTextEditor.createEmptyValue()
				});
			}

			this.setState({
				estimateDetails: estimateDetailState,
				itemLists: estimateItemState ? estimateItemState : [],
				taxRate: estimateItemState ? estimateItemState.taxRate : 1.8,
				note: estimateDetailState.note ? estimateDetailState.note : '',
				projectName: estimateDetailState.projectId ? estimateDetailState.projectId.title : '',
				individualPhone: phone,
				individualAddress: nextProps.estimateDetails.individualAddress,
				individualInternet: nextProps.estimateDetails.individualInternet,
				formats: formatConfigs,
				blocking: revisions.length ? false : true,
				revisedItems: revisions,
				currentRevisionId: revisions.length ? revisions[0]._id : '',
				selectedRevision:revisions.length ? revisions[0].revisionName : '',
				dataRecieved: false,
				defaultProService:estimateDetailState.proposedServices
			});
			
		}

		setTimeout(function () {
			this.setState({ blocking: false });
		}.bind(this), 15000);
	}

	componentDidMount() {
		let self = this;
		// let el = document.getElementById('list_item');
		const el = findDOMNode(this.refs.est_config.refs.list_item);
		Sortable.create(el, {
			onEnd: function (/**Event*/evt) {
				var itemEl = evt.item;  // dragged HTMLElement
				evt.to;    // target list
				evt.from;  // previous list
				evt.oldIndex;  // element's old index within old parent
				evt.newIndex;  // element's new index within new parent
				self.columnsmove(evt.oldIndex, evt.newIndex);
			},
		});

		const el1 = findDOMNode(this.refs.est_config.refs.list_total);
		Sortable.create(el1, {
			onEnd: function (/**Event*/evt) {
				var itemEl = evt.item;  // dragged HTMLElement
				evt.to;    // target list
				evt.from;  // previous list
				evt.oldIndex;  // element's old index within old parent
				evt.newIndex;  // element's new index within new parent
				self.totalmove(evt.oldIndex, evt.newIndex);
			},
		});
	}

	totalmove(fromIndex, toIndex) {
		let currentState = this.state.currentSelectedFormat;
		let arr = currentState.totalConfig;
		var element = arr[fromIndex];
		arr.splice(fromIndex, 1);
		arr.splice(toIndex, 0, element);
		let updatedState = this.state.currentSelectedFormat;
		updatedState.totalConfig = arr;
		this.setState({
			currentSelectedFormat: updatedState
		});
		this.handleFormatListUpdate(updatedState);
	}

	columnsmove(fromIndex, toIndex) {
		let currentState = this.state.currentSelectedFormat;
		let arr = currentState.columnsConfig;
		var element = arr[fromIndex];
		arr.splice(fromIndex, 1);
		arr.splice(toIndex, 0, element);
		let updatedState = this.state.currentSelectedFormat;
		updatedState.columnsConfig = arr;
		this.setState({
			currentSelectedFormat: updatedState
		});
		this.handleFormatListUpdate(updatedState);
	}

	updateOrientation(e) {
		//  1- Portrait, 2- Landscape  // 
		let orientation = e.target.value;
	}

	changeRevision(e) {
		let revisionIndex = e.target.selectedIndex;
		let currentItems = this.state.revisedItems;
		let newRevisionItems = currentItems[revisionIndex].lineItems;
		this.setState({selectedRevision:currentItems[revisionIndex].revisionName})
		if(currentItems[revisionIndex].revisionName=='Rev0'){
			var res = this.state.defaultProService.toString('html');
			this.setState({
				proposedServices: RichTextEditor.createValueFromString(res, 'html')
			});
		}else if(currentItems[revisionIndex].proposedServices){
			var res = currentItems[revisionIndex].proposedServices.toString('html');
			this.setState({
				proposedServices: RichTextEditor.createValueFromString(res, 'html')
			});
		}else{
			this.setState({
				proposedServices:  RichTextEditor.createEmptyValue()
			});
		}
		this.setState({
			currentRevisionName: currentItems[revisionIndex].revisionName,
			currentRevName: currentItems[revisionIndex].revName ? currentItems[revisionIndex].revName : '',
			itemLists: newRevisionItems
		});
		
	}

	handleUpdateEnable(index, type) {
		let currentFormatData = this.state.currentSelectedFormat;
		if (type == 'HEADER') {
			for (let i = 0; i < currentFormatData.columnsConfig.length; i++) {
				currentFormatData.columnsConfig[i].disabled = true;
				this.refs.est_config.refs['columnInput' + currentFormatData.columnsConfig[i].seqNo].value = currentFormatData.columnsConfig[i].fieldName;
			}
			currentFormatData.columnsConfig[index].disabled = false;
			this.setState({ currentSelectedFormat: currentFormatData });
			this.handleFormatListUpdate(currentFormatData);
		}
		else if (type == 'TOTAL') {
			for (let i = 0; i < currentFormatData.totalConfig.length; i++) {
				currentFormatData.totalConfig[i].disabled = true;
				this.refs.est_config.refs['totalInput' + currentFormatData.totalConfig[i].seqNo].value = currentFormatData.totalConfig[i].fieldName;
			}
			currentFormatData.totalConfig[index].disabled = false;
			this.setState({ currentSelectedFormat: currentFormatData });
			this.handleFormatListUpdate(currentFormatData);
		}
	}

	handleVisibleToggle(ind, type, e) {
		let currentState = this.state.currentSelectedFormat;
		if (type == 'HEADER') {
			currentState.columnsConfig[ind].isVisible = e.target.checked;
			this.setState({ currentSelectedFormat: currentState });
			this.handleFormatListUpdate(currentState);
		}
		else if (type == 'TOTAL') {
			currentState.totalConfig[ind].isVisible = e.target.checked;
			this.setState({ currentSelectedFormat: currentState });
			this.handleFormatListUpdate(currentState);
		}
	}

	handleMergeColumn(e) {
		let index1 = this.state.currentSelectedFormat.columnsConfig.findIndex(p => p.columnName == 'itemMfg');
		let index2 = this.state.currentSelectedFormat.columnsConfig.findIndex(p => p.columnName == 'modelNo');
		let index3 = this.state.currentSelectedFormat.columnsConfig.findIndex(p => p.columnName == 'partNo');
		let index4 = this.state.currentSelectedFormat.columnsConfig.findIndex(p => p.columnName == 'itemName');

		let currentState = this.state.currentSelectedFormat;
		if (e.target.checked) {
			currentState.columnsConfig[index1].isHidden = true;
			currentState.columnsConfig[index2].isHidden = true;
			currentState.columnsConfig[index3].isHidden = true;
			currentState.columnsConfig[index4].isHidden = true;
			currentState.cmmpd = true;
			this.setState({ currentSelectedFormat: currentState });
			this.handleFormatListUpdate(currentState);
		} else {
			currentState.columnsConfig[index1].isHidden = false;
			currentState.columnsConfig[index2].isHidden = false;
			currentState.columnsConfig[index3].isHidden = false;
			currentState.columnsConfig[index4].isHidden = false;
			currentState.cmmpd = false;
			this.setState({ currentFormatData: currentState });
			this.handleFormatListUpdate(currentState);
		}
	}

	handleSavePopUp() {
		const el = findDOMNode(this.refs.formatAddId);
		$(el).modal({ backdrop: 'static', keyboard: false });
	}

	handleEnterInputEvent(index, type, e) {
		let currentFormatData = this.state.currentSelectedFormat;
		e.preventDefault();
		if (e.keyCode === 13) {
			let res = e.target.value.trim();
			if (res) {
				if (type == 'HEADER') {
					currentFormatData.columnsConfig[index].disabled = true;
					currentFormatData.columnsConfig[index].fieldName = e.target.value;
					this.setState({ currentSelectedFormat: currentFormatData });
					this.handleFormatListUpdate(currentFormatData);
				}
				else if (type == 'TOTAL') {
					currentFormatData.totalConfig[index].disabled = true;
					currentFormatData.totalConfig[index].fieldName = e.target.value;
					this.setState({ currentSelectedFormat: currentFormatData });
					this.handleFormatListUpdate(currentFormatData);
				}
			}
			else {
				toastr.remove();
				toastr.error('Please enter a valid name!');
			}
		} else if (e.keyCode === 27) {
			if (type == 'HEADER') {
				for (let i = 0; i < currentFormatData.columnsConfig.length; i++) {
					currentFormatData.columnsConfig[i].disabled = true;
					this.refs.est_config.refs['columnInput' + currentFormatData.columnsConfig[i].seqNo].value = currentFormatData.columnsConfig[i].fieldName;
				}
				this.setState({ currentSelectedFormat: currentFormatData });
			} else if (type == 'TOTAL') {
				for (let i = 0; i < currentFormatData.totalConfig.length; i++) {
					currentFormatData.totalConfig[i].disabled = true;
					this.refs.est_config.refs['totalInput' + currentFormatData.totalConfig[i].seqNo].value = currentFormatData.totalConfig[i].fieldName;
				}
				this.setState({ currentSelectedFormat: currentFormatData });
			}
			this.handleFormatListUpdate(currentFormatData);
		}
	}

	handleDollarShow(e) {
		let currentFormatData = this.state.currentSelectedFormat;
		currentFormatData.dollarSign = e.target.checked;
		this.setState({ currentSelectedFormat: currentFormatData });
		this.handleFormatListUpdate(currentFormatData);
	}

	handleSignInclude(e) {
		let currentFormatData = this.state.currentSelectedFormat;
		currentFormatData.signature = e.target.checked;
		this.setState({ currentSelectedFormat: currentFormatData });
		this.handleFormatListUpdate(currentFormatData);
	}
	handleMergeName(e){
		let currentFormatData=this.state.currentSelectedFormat;
		currentFormatData.estimateName = e.target.checked;
		this.setState({ currentSelectedFormat: currentFormatData });
		this.handleFormatListUpdate(currentFormatData);
	}

	handleShowShipping(e) {

		let currentFormatData = this.state.currentSelectedFormat;
		currentFormatData.showShipping = e.target.checked;
		this.setState({ currentSelectedFormat: currentFormatData });
		this.handleFormatListUpdate(currentFormatData);
	}

	saveEditableColumns(index, val) {
		let currentState = this.state.currentSelectedFormat;
		currentState.columnsConfig[index].disabled = true;
		currentState.columnsConfig[index].fieldName = val;
		this.setState({ currentSelectedFormat: currentState });
		this.handleFormatListUpdate(currentState);
	}

	handleEditableColumn(index, type, isSave, seqNo, e) {
		let currentFormatData = this.state.currentSelectedFormat;
		if (type == 'HEADER') {
			let res = this.refs.est_config.refs['columnInput' + seqNo].value.trim();
			if (isSave) {
				if (res) {
					this.saveEditableColumns(index, res);
				} else {
					toastr.remove();
					toastr.error('Please enter a valid name!');
				}
			} else {
				currentFormatData.columnsConfig[index].disabled = true;
				this.refs.est_config.refs['columnInput' + seqNo].value = currentFormatData.columnsConfig[index].fieldName;
				this.setState({ currentSelectedFormat: currentFormatData });
				this.handleFormatListUpdate(currentFormatData);
			}
		} else if (type == 'TOTAL') {
			let res1 = this.refs.est_config.refs['totalInput' + seqNo].value.trim();
			if (isSave) {
				if (res1) {
					let currentState = this.state.currentSelectedFormat;
					currentState.totalConfig[index].disabled = true;
					currentState.totalConfig[index].fieldName = res1;
					this.setState({ currentSelectedFormat: currentState });
				} else {
					toastr.remove();
					toastr.error('Please enter a valid name!');
				}
			} else {
				currentFormatData.totalConfig[index].disabled = true;
				this.refs.est_config.refs['totalInput' + seqNo].value = currentFormatData.totalConfig[index].fieldName;
				this.setState({ currentSelectedFormat: currentFormatData });
			}
		}
	}

	handleFormatListUpdate(data) {

		let currentFormats = this.state.formats;
		if (this.state.currentFormatId) {
			let res = this.state.formats.findIndex(o => o._id === this.state.currentFormatId);
			currentFormats[res].columnsConfig = data.columnsConfig;
			currentFormats[res].totalConfig = data.totalConfig;
			currentFormats[res].portrait = data.portrait;
			currentFormats[res].landscape = data.landscape;
			currentFormats[res].cmmpd = data.cmmpd;
			currentFormats[res].dollarSign = data.dollarSign;
			currentFormats[res].signature = data.signature;
			currentFormats[res].showShipping = data.showShipping;
			currentFormats[res].estimateName=data.estimateName;
			this.setState({ formats: currentFormats });
		}
		else {
			currentFormats[0].columnsConfig = data.columnsConfig;
			currentFormats[0].totalConfig = data.totalConfig;
			currentFormats[0].portrait = data.portrait;
			currentFormats[0].landscape = data.landscape;
			currentFormats[0].cmmpd = data.cmmpd;
			currentFormats[0].dollarSign = data.dollarSign;
			currentFormats[0].signature = data.signature;
			currentFormats[0].showShipping = data.showShipping;
			currentFormats[0].estimateName=data.estimateName;
			this.setState({ formats: currentFormats });
		}
	}

	handleFormatChange(e) {

		let res = e.target.selectedIndex;
		let currentFormats = this.state.formats;
		if (res > 0) {
			let value = currentFormats[res]._id;
			let formatData = currentFormats[res];
			this.setState({
				currentFormatId: value,
				currentSelectedFormat: formatData
			});
		}
		else {
			let formatData = currentFormats[0];
			this.setState({
				currentFormatId: '',
				currentSelectedFormat: formatData
			});
		}
	}

	handleAddFormat() {
		let currentFormatData = this.state.currentSelectedFormat;
		let value = this.refs.formatAddId.refs.addvalue.value.trim();
		if (value) {
			let data = {
				estimateId: this.props.params.estimateId,
				formatNo: value,
				cmmpd: currentFormatData.cmmpd,
				portrait: true,
				landscape: false,
				signature: currentFormatData.signature,
				dollarSign: currentFormatData.dollarSign,
				showShipping: currentFormatData.showShipping,
				totalConfig: currentFormatData.totalConfig,
				columnsConfig: currentFormatData.columnsConfig,
				estimateName:currentFormatData.estimateName
			};
			const el = findDOMNode(this.refs.formatAddId);
			$(el).modal('hide');
			this.props.actions.addNewFormat(data);
		}
		else {
			toastr.remove();
			toastr.error('Please enter a valid format name!');
		}
	}

	handleUpdateFormat() {
		let currentFormatData = this.state.currentSelectedFormat;
		if (this.state.currentFormatId) {
			let data = {
				configId: this.state.currentFormatId,
				estimateId: this.props.params.estimateId,
				formatNo: currentFormatData.formatNo,
				cmmpd: currentFormatData.cmmpd,
				portrait: true,
				landscape: false,
				signature: currentFormatData.signature,
				dollarSign: currentFormatData.dollarSign,
				totalConfig: currentFormatData.totalConfig,
				columnsConfig: currentFormatData.columnsConfig,
				estimateName:currentFormatData.estimateName

			};
			this.props.actions.updateFormat(data);
		}
		else {
			toastr.remove();
			toastr.error('Please enter a valid format name!');
		}
	}

	handlePdfGeneration() {
		let revisionName = this.state.currentRevisionName ? this.state.currentRevisionName : this.state.revisedItems[0].revisionName;
		let revName = this.state.currentRevName ? this.state.currentRevName : (this.state.revisedItems[0].revName ? this.state.revisedItems[0].revName : '');

		let pdfName = 'TelPro-Estimate-' + this.state.estimateDetails.estimateNumber + '-' + (revisionName ? revisionName : '') + (revName ? '[-' + revName + ']' : '');

		let resOne = this.refs.pdfDiv.refs.pdfDiv;
		let resTwoString = resOne.innerHTML;
		let finalHtml = '<div style="width: 100%;color: #616262;font-family: sans-serif;background: #fff;cursor: default;font-style: normal;font-weight: normal;line-height: 1;margin: 0;padding: 0;position: relative;font-size: 100%;height: 100%;">' + resTwoString + '</div>';
		let output = LZUTF8.compress(finalHtml,{outputEncoding: 'StorageBinaryString'});
		let data = {
			estimateId: this.props.params.estimateId,
			htmlContent: output,
			configId: this.state.currentFormatId ? this.state.currentFormatId : '',
			pdfName: pdfName
		};
		this.setState({ blocking: true, loaderMessage: 'Exporting PDF' });
		this.props.actions.generateEstimatePdf(data);
		setTimeout(function () {
			this.setState({ blocking: false });
		}.bind(this), 7000);
	}

	render() {
       
       
		let revisions = this.state.revisedItems.map(function (lst, i) {
			return <option key={i} value={lst._id}>{lst.revisionName}</option>;
		}.bind(this));

		return (
			<BlockUi tag="div" blocking={this.state.blocking} message={this.state.loaderMessage}>
				{this.state.showWarnHead?<div className='Notify'>
					<p>This estimate has been updated by {this.state.modifierName}.  To see the latest changes, "<Link onClick={() => window.location.reload()}>click here</Link>".<button style={{float:'right'}} onClick={() => this.setState({showWarnHead:false})}type="button"  className="fa fa-close"aria-hidden="true"></button></p>
				</div>:''}
				<div className="container-fluid">
					<div className="page-content page-content-popup">
						<div className="page-content-fixed-header">
                      
							<ul className="page-breadcrumb">
								<li>Estimate# {this.state.estimateDetails ? this.state.estimateDetails.estimateNumber + ' ' + this.state.estimateDetails.customerId.companyName : ''}</li>
								{/* <li>Pages: 2</li> */}
							</ul>
							<div className="content-header-menu">
								<div className="btn-group">
									<Link to={'/estimate/' + this.props.params.estimateId}> <button type="button" className="btn btn-lrg red" style={{ marginTop: '8px' }}>
                                        Close
									</button></Link>
                                    &nbsp;&nbsp;&nbsp;
									<button onClick={this.handlePdfGeneration}
										type="button"
										className="btn btn-lrg blue"
										style={{ marginTop: '8px', marginRight: '8px' }}>
                                        Save PDF
									</button>
								</div>
								<button type="button" className="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
									<span className="toggle-icon">
										<span className="icon-bar"></span>
										<span className="icon-bar"></span>
										<span className="icon-bar"></span>
									</span>
								</button>
							</div>
						</div>
						<div className="page-fixed-main-content" style={{ marginLeft: '8px', background: '#808080' }}>
							<div className="row">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
									<EstimatePdfViewer
										ref="pdfDiv"
										estimateDetails={this.state.estimateDetails}
										itemLists={this.state.itemLists}
										taxRate={this.state.taxRate}
										itemColumns={this.state.currentSelectedFormat.columnsConfig}
										totalColumns={this.state.currentSelectedFormat.totalConfig}
										individualPhone={this.state.individualPhone}
										individualAddress={this.state.individualAddress}
										individualInternet={this.state.individualInternet}
										combineMfgModelPartDesc={this.state.currentSelectedFormat.cmmpd}
										includeEstimateName={this.state.currentSelectedFormat.estimateName}
										handleMergeName={this.handleMergeName}
										showDollarSign={this.state.currentSelectedFormat.dollarSign}
										includeSign={this.state.currentSelectedFormat.signature}
										showShipping={this.state.currentSelectedFormat.showShipping}
										note={this.state.note}
										projectName={this.state.projectName}
										proposedServices={this.state.proposedServices}
										selectedRevision={this.state.selectedRevision}
									/>
									<EstimateConfig
										ref="est_config"
										revisions={revisions}
										changeRevision={this.changeRevision}
										itemColumns={this.state.currentSelectedFormat.columnsConfig}
										totalColumns={this.state.currentSelectedFormat.totalConfig}
										formatList={this.state.formats}
										formatId={this.state.currentFormatId}
										updateOrientation={this.updateOrientation}
										handleFormatChange={this.handleFormatChange}
										handleUpdateEnable={this.handleUpdateEnable.bind(this)}
										handleVisibleToggle={this.handleVisibleToggle}
										handleMergeColumn={this.handleMergeColumn}
										handleUpdateFormat={this.handleUpdateFormat}
										handleSavePopUp={this.handleSavePopUp}
										handleEnterInputEvent={this.handleEnterInputEvent}
										combineMfgModelPartDesc={this.state.currentSelectedFormat.cmmpd}
										includeEstimateName={this.state.currentSelectedFormat.estimateName}
										handleMergeName={this.handleMergeName}
										showDollarSign={this.state.currentSelectedFormat.dollarSign}
										handleDollarShow={this.handleDollarShow}
										includeSign={this.state.currentSelectedFormat.signature}
										handleSignInclude={this.handleSignInclude}
										showShipping={this.state.currentSelectedFormat.showShipping}
										handleShowShipping={this.handleShowShipping}
										handleEditableColumn={this.handleEditableColumn}
									/>
								</div>
							</div>
							{/* <p className="copyright-v2">
                                {moment().year() == '2017' ? '2017' : '2017 - ' + moment().year()} &copy; Hive
                    </p> */}
						</div>
						<AddOther
							ref={'formatAddId'}
							addId={'formatAddId'}
							addType={'Format'}
							handleAddFormat={this.handleAddFormat}
						/>
					</div>
				</div>
			</BlockUi>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		revisionList: state.pdfGeneration.revisionList,
		estimateDetails: state.pdfGeneration.estimateDetails,
		formatsList: state.pdfGeneration.formatsList,
		isLoaded: state.pdfGeneration.isLoaded,
		newFormat: state.pdfGeneration.newFormat
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(pdfGeneration, dispatch),
		estactions: bindActionCreators(estimateActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(EstimateExport);