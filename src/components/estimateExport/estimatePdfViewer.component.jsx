import React from 'react';
import EstimateConfig from './estimateConfig.component';
import moment from 'moment';
import _ from 'lodash';
import * as validate from '../common/validator';
import { LOCAL_IMAGES_PATH } from '../../../tools/config';
import RichTextEditor from 'react-rte';


class EstimatePdfViewer extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			proposedS:'',

		};
     
	}
	componentDidUpdate(){
		if(this.props.proposedServices.toString('html')!=this.state.proposedS){
           
			var res = this.props.proposedServices.toString('html');
			this.setState({
				proposedS: res
			});
			// this.setState({
			//     proposedS: RichTextEditor.createValueFromString(res, 'html')
			// });
		}
	}
	render() {

		//    let style={
		// 	@media screen {
		// 		.page-break	{ height:10px; background:url(page-break.gif) 0 center repeat-x; border-top:1px dotted #999; margin-bottom:13px; }
		// 	}
		// 	@media print {
		// 		.page-break { height:0; page-break-before:always; margin:0; border-top:none; }
		// 	}
		//    }
		let style={
			table: {pageBreakInside:'auto' },
			tr :   { pageBreakInside:'avoid', pageBreakAfter:'auto' },
			thead :{ display:'table-header-group' },
			tfoot :{ display:'table-footer-group' },
		    background: '#fff' 
			
		};
       
		let total = this.props.itemLists.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + (next.mTaxExtended + next.lExtended) : prev, 0);
		let materialTotal = this.props.itemLists.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mExtended : prev, 0);
		let laborTotal = this.props.itemLists.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
		let mTaxTotal = this.props.itemLists.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTax : prev, 0);
		let totalShipping = this.props.itemLists.reduce((prev, next) => (next.itemTypeId === 3) ? prev + next.rowTotal : prev, 0);
		let grandTotal = materialTotal + laborTotal + mTaxTotal + totalShipping;
		let filteredColumns = _.filter(this.props.itemColumns, { isVisible: true, isHidden: false });
		let filteredTotals = _.filter(this.props.totalColumns, { isVisible: true });

		let viewerColumns = filteredColumns.map(function (column, i) {
			return <th key={i} style={{ padding: '5px', textAlign: 'center', background: '#fff', fontSize: '12px', color: '#63bfe1' }}>{column.fieldName}</th>;
		}.bind(this));

		let countItem = 0;
		let alignItem = 'left';
		const initiater = this.props.showDollarSign ? '$' : '';
		let estimateItems = this.props.itemLists.map(function (item, i) {

			if (item.itemTypeId == 1) {
				countItem = countItem + 1;
			} else if (item.itemTypeId == 2) {
				countItem = countItem + 1;
			} else if (item.itemTypeId == 3 && this.props.showShipping) {
				countItem = countItem + 1;
			} else if (item.itemTypeId == 4) {
				countItem = countItem;
			}

			if (item.itemTypeId === 1) {
				// style={{ pageBreakAfter: 'always', }}	
				return <tr key={i}  style={{pageBreakAfter:'avoid'}}>
					<td style={{ background: countItem % 2 ? '#e8e8e9' : '', textAlign: 'center', padding: '5px', verticalAlign: 'middle', color: '#616262' }}>
						<div style={{ pageBreakInside: 'avoid', margin: '4px 0 4px 0' }}>
							{countItem}
						</div>
					</td>
					<td style={{ display: this.props.combineMfgModelPartDesc ? '' : 'none', background: countItem % 2 ? '#e8e8e9' : '', textAlign: 'left', padding: '5px', verticalAlign: 'middle', color: '#616262' }}>
						<div style={{ pageBreakInside: 'avoid', margin: '4px 0 4px 0' }}>
							<h5 style={{ margin: '0', fontWeight: 'bold', fontSize: '11px', color: '#616262' }}>{item.itemMfg + ' ' + item.modelNo} {item.partNo ? '(' + item.partNo + ')' : ''}</h5>
							<p style={{ fontSize: '11px', margin: '0' }}>{item.itemName}</p>
						</div>
					</td>
					{filteredColumns.map(function (res, j) {
						let val = null;
						switch (res.columnName) {
						case 'itemMfg':
							val = item.itemMfg;
							alignItem = 'center';
							break;
						case 'mTaxable':
							val = <input type="checkbox" defaultChecked={item.mTaxable} value={item.mTaxable} disabled="disabled" />;
							break;
						case 'itemName':
							val = item.itemName;
							alignItem = 'center';
							break;
						case 'mTax':
							val = initiater + '' + validate.numberWithCommas((item.mTax).toFixed(2));
							alignItem = 'center';
							break;
						case 'mCost':
							val = initiater + '' + validate.numberWithCommas((item.mCost).toFixed(2));
							alignItem = 'center';
							break;
						case 'quantity':
							val = item.quantity;
							alignItem = 'center';
							break;
						case 'rowTotal':
							val = initiater + '' + validate.numberWithCommas((item.rowTotal).toFixed(2));
							alignItem = 'center';
							break;
						case 'modelNo':
							val = item.modelNo;
							alignItem = 'center';
							break;
						case 'partNo':
							val = item.partNo;
							alignItem = 'center';
							break;
						case 'mExtended':
							val = initiater + '' + validate.numberWithCommas((item.mExtended).toFixed(2));
							alignItem = 'center';
							break;
						case 'mTaxExtended':
							val = initiater + '' + validate.numberWithCommas((item.mTaxExtended).toFixed(2));
							alignItem = 'center';
							break;
						case 'laborTypeName':
							val = item.displayLaborName ? item.displayLaborName : '-';
							alignItem = 'center';
							break;
						case 'lHours':
							val = item.lHours;
							alignItem = 'center';
							break;
						case 'lHoursExtended':
							val = item.lHoursExtended;
							alignItem = 'center';
							break;
						case 'lRate':
							val = initiater + '' + validate.numberWithCommas((item.lRate).toFixed(2));
							alignItem = 'center';
							break;
						case 'unit':
							val = initiater + '' + validate.numberWithCommas((item.unit).toFixed(2));
							alignItem = 'center';
							break;
						case 'lExtended':
							val = initiater + '' + validate.numberWithCommas((item.lExtended).toFixed(2));
							alignItem = 'center';
							break;

						default:
							null;
						}
						return <td key={j} style={{ background: countItem % 2 ? '#e8e8e9' : '', textAlign: alignItem ? alignItem : 'center', padding: '5px', verticalAlign: 'middle', color: '#616262' }}>
							<div style={{ pageBreakInside: 'avoid', margin: '4px 0 4px 0' }}>
								{val}
							</div>
						</td>;
					})} </tr>;
			} else if (item.itemTypeId === 2) {
				return <tr key={i}>
					<td style={{ background: countItem % 2 ? '#e8e8e9' : '', textAlign: 'center', padding: '5px', verticalAlign: 'middle', color: '#616262' }}>
						{countItem}
					</td>
					<td style={{ display: this.props.combineMfgModelPartDesc ? '' : 'none', background: countItem % 2 ? '#e8e8e9' : '', textAlign: 'left', padding: '5px', verticalAlign: 'middle', color: '#616262' }}>
						<h5 style={{ margin: '0', fontWeight: 'bold', fontSize: '11px', color: '#616262' }}>Labor </h5>
						<p style={{ fontSize: '11px', margin: '0' }}>{item.itemName ? item.itemName : null}</p>
					</td>
					{filteredColumns.map(function (res, j) {
						let val = null;
						switch (res.columnName) {
						case 'itemName':
							val = item.itemName;
							alignItem = 'center';
							break;
						case 'mCost':
							val = initiater + '' + validate.numberWithCommas((item.mCost).toFixed(2));
							alignItem = 'center';
							break;
						case 'quantity':
							val = item.quantity;
							alignItem = 'center';
							break;
						case 'rowTotal':
							val = initiater + '' + validate.numberWithCommas((item.rowTotal).toFixed(2));
							alignItem = 'center';
							break;
						case 'laborTypeName':
							val = item.displayLaborName ? item.displayLaborName : '-';
							alignItem = 'center';
							break;
						case 'lHours':
							val = item.lHours;
							alignItem = 'center';
							break;
						case 'lHoursExtended':
							val = item.lHoursExtended;
							alignItem = 'center';
							break;
						case 'lRate':
							val = initiater + '' + validate.numberWithCommas((item.lRate).toFixed(2));
							alignItem = 'center';
							break;
						case 'unit':
							val = initiater + '' + validate.numberWithCommas((item.unit).toFixed(2));
							alignItem = 'center';
							break;
						case 'lExtended':
							val = initiater + '' + validate.numberWithCommas((item.lExtended).toFixed(2));
							alignItem = 'center';
							break;
						default:
							null;
						}
						return <td key={j} style={{ background: countItem % 2 ? '#e8e8e9' : '', textAlign: alignItem ? alignItem : 'center', padding: '5px', verticalAlign: 'middle', color: '#616262' }}>{val}</td>;
					})} </tr>;
			} else if (item.itemTypeId === 3 && this.props.showShipping) {
				return <tr key={i}>
					<td style={{ background: countItem % 2 ? '#e8e8e9' : '', textAlign: 'center', padding: '5px', verticalAlign: 'middle', color: '#616262' }}>
						{countItem}
					</td>
					<td style={{ display: this.props.combineMfgModelPartDesc ? '' : 'none', background: countItem % 2 ? '#e8e8e9' : '', textAlign: 'left', padding: '5px', verticalAlign: 'middle', color: '#616262' }}>
						<h5 style={{ margin: '0', fontWeight: 'bold', fontSize: '11px', color: '#616262' }}>Shipping </h5>
						<p style={{ fontSize: '11px', margin: '0' }}>{item.itemName ? item.itemName : null}</p>
					</td>
					{filteredColumns.map(function (res, j) {
						let val = null;
						switch (res.columnName) {
						case 'itemName':
							val = item.itemName;
							alignItem = 'center';
							break;
						case 'rowTotal':
							val = initiater + '' + validate.numberWithCommas((item.rowTotal).toFixed(2));
							alignItem = 'center';
							break;
						default:
							null;
						}
						return <td key={j} style={{ background: countItem % 2 ? '#e8e8e9' : '', textAlign: alignItem ? alignItem : 'center', padding: '5px', verticalAlign: 'middle', color: '#616262' }}>{val}</td>;
					})} </tr>;

			} else if (item.itemTypeId === 4) {
				return <tr><td key={i} colSpan={this.props.combineMfgModelPartDesc ? filteredColumns.length + 2 : filteredColumns.length + 1} style={{ background: '#F3C200', padding: '5px', verticalAlign: 'middle', color: '#fff' }}>{item.headerName}</td></tr>;
			}
		}.bind(this));

		let totalRows = filteredTotals.map(function (total, j) {

			let totalName = null;
			let totalValue = null;
			switch (total.columnName) {
			case 'materialExtendedTotal':
				totalName = total.fieldName;
				totalValue = materialTotal;
				break;
			case 'laborCost':
				totalName = total.fieldName;
				totalValue = laborTotal;
				break;
			case 'shippingTotal':
				totalName = total.fieldName;
				totalValue = totalShipping;
				break;
			case 'taxTotal':
				totalName = total.fieldName;
				totalValue = mTaxTotal;
				break;
			default:
				null;
			}
			return (
				<tr key={j}>
					<td style={{ background: '#fff', fontSize: '18px', textAlign: 'right' }}><span>{totalName}:</span></td>
					<td style={{ background: '#fff', fontSize: '18px', textAlign: 'right', paddingRight: '20px' }}><span>${validate.numberWithCommas((totalValue).toFixed(2))}</span></td>
				</tr>
			);
		}.bind(this));

		let phone = '';
		let phoneCount = this.props.individualPhone ? validate.removeSpecialCharSpace(this.props.individualPhone) : '';
		if (phoneCount.length <= 11 && phoneCount.includes('x')) {
			phone = this.props.individualPhone.substring(0, this.props.individualPhone.indexOf('x'));
		} else {
			phone = this.props.individualPhone;
		}
		return (
			<div ref="pdfDiv" className="col-lg-9 col-md-9 col-sm-9 col-xs-12" style={style}>
				<div style={{ maxWidth: '1200px', width: '100%', margin: '0px auto', float: 'none' }}>
					<div style={{ width: '100%', maxWidth: '1200px', minWidth: '768px', float: 'none', margin: '0px auto', overflow: 'hidden' }}>
						<div style={{ float: 'left', boxSizing: 'border-box', maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0' }}>
							<div style={{ marginTop: '20px', maxWidth: '50%', float: 'left', position: 'relative', boxSizing: 'border-box', width: 'calc(100% - 480px)' }}>
								<img style={{ display: 'inline-block', verticalAlign: 'middle', height: 'auto', border: '0px none', maxWidth: '100%', width: '342px' }} src={LOCAL_IMAGES_PATH + 'logo-telpro.png'} />
							</div>
							<div style={{ float: 'left', width: '480px' }}>
								<div style={{ borderBottom: '1px solid rgb(227, 226, 226)', boxSizing: 'border-box', minHeight: '130px', paddingLeft: '0px', marginTop: '20px', float: 'left', paddingRight: '0.9375rem', position: 'relative', width: '176px' }}>
									<div style={{ float: 'left', width: '100%', boxSizing: 'border-box', borderRight: '1px solid #e3e2e2', minHeight: '100px', margin: '0', padding: '0' }}>
										<img style={{ marginBottom: '13px', maxWidth: '30px', width: '14%', display: 'inline-block', verticalAlign: 'middle' }} src={LOCAL_IMAGES_PATH + 'mail.png'} />
										<p style={{ color: '#ababab', fontSize: '10px', lineHeight: '16px', marginBottom: '0px', marginTop: '0px' }}>1139 Westminster Ave, Suite N<br />
                                            Alhambra, California 91803<br />
											<br />
                                            410 E Ave K-12, Suite 105<br />
                                            Lancaster, CA 91354</p>
									</div>
								</div>
								<div style={{ boxSizing: 'border-box', borderBottom: '1px solid rgb(227, 226, 226)', minHeight: '130px', paddingLeft: '0', marginTop: '20px', float: 'left', position: 'relative', width: '161px', paddingRight: '0.9375rem' }}>
									<div style={{ boxSizing: 'border-box', borderRight: '1px solid #e3e2e2', minHeight: '100px', margin: '0', padding: '0' }}>
										<img style={{ boxSizing: 'border-box', marginBottom: '5px', maxWidth: '30px', width: '12%', display: 'inline-block', verticalAlign: 'middle' }} src={LOCAL_IMAGES_PATH + 'phone.png'} />
										<p style={{ margin: '2px 0 0', boxSizing: 'border-box', color: '#ababab', fontSize: '10px', lineHeight: '16px', padding: '0' }}>(800) 335-2720<br />
                                            Fax 323 531 5998<br />
											<br />
                                            Monday to Friday<br />
                                            8:30am to 4:30pm</p>
									</div>
								</div>
								<div style={{ boxSizing: 'border-box', borderBottom: '1px solid rgb(227, 226, 226)', minHeight: '130px', paddingLeft: '0', marginTop: '20px', paddingRight: '0.9375rem', position: 'relative', float: 'left', width: '131px' }}>
									<div style={{ borderRight: 'none', boxSizing: 'border-box', minHeight: '100px', margin: '0', padding: '0' }}>
										<img style={{ boxSizing: 'border-box', maxWidth: '30px', width: '12%', display: 'inline-block', verticalAlign: 'middle' }} src={LOCAL_IMAGES_PATH + 'world.png'} />
										<p style={{ marginTop: '5px', boxSizing: 'border-box', color: '#ababab', fontSize: '10px', lineHeight: '16px' }}>www.tel-pro.net<br />
                                            contact@tel-pro.net<br />
                                            support@tel-pro.net<br />
											<br />
                                            C-7 License #773094</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div style={{ boxSizing: 'border-box', maxWidth: '1200px', width: '100%', minWidth: '768px', overflow: 'hidden' }}>
						<div style={{ boxSizing: 'border-box', maxWidth: '1200px', margin: '40px auto -5px', width: '100%', minWidth: '768px', overflow: 'hidden' }}>
							<div style={{ boxSizing: 'border-box', marginTop: '18px', width: '50%', float: 'left', position: 'relative' }}>
								<h3 style={{ color: '#727478', fontSize: '18px', lineHeight: '1.4', fontWeight: 'normal', marginBottom: '0.5rem', marginTop: '0.2rem' }}><img src={LOCAL_IMAGES_PATH + 'invoice.png'} style={{ boxSizing: 'border-box', minWidth: '22px', width: '5%', display: 'inline-block', verticalAlign: 'middle', maxWidth: '100%' }} />&nbsp;ESTIMATE FOR</h3>
								<h2 style={{ color: '#727478', fontSize: '26px', fontWeight: 'bold', margin: '0' }}>{this.props.estimateDetails ? this.props.estimateDetails.customerId.companyName : ''}</h2>
								<p style={{ marginBottom: '10px', marginTop: '0', lineHeight: '22px', color: '#727478', fontFamily: 'inherit', fontWeight: 'normal', fontSize: '16px' }}>
                                    Attn: {this.props.estimateDetails.individualId ? this.props.estimateDetails.individualId.firstname + ' ' + this.props.estimateDetails.individualId.lastname : ''}<br />
									{this.props.individualAddress ? [this.props.individualAddress.mapAddress1 + ', ' + this.props.individualAddress.mapAddress2, < br />,
										this.props.individualAddress.city + ', ' + this.props.individualAddress.state + ', ' + this.props.individualAddress.zip] : null}
								</p>
								{this.props.individualInternet ? <p style={{ marginBottom: '10px', marginTop: '0', color: '#727478', lineHeight: '16px', fontFamily: 'inherit', fontWeight: 'normal', fontSize: '17px' }}><img className="icon-mail" src={LOCAL_IMAGES_PATH + 'mail.png'} style={{ lineHeight: '16px', marginRight: '10px', minWidth: '22px', width: '4%' }} />{this.props.individualInternet}</p> : null}
								<p style={{ marginBottom: '0', marginTop: '0', color: '#727478', lineHeight: '16px', fontFamily: 'inherit', fontWeight: 'normal', fontSize: '17px' }}><img className="icon-mobile" src={LOCAL_IMAGES_PATH + 'mobile.png'} style={{ lineHeight: '16px', marginRight: '16px', minWidth: '12px', width: '2%', marginLeft: '5px' }} />{phone}</p>
							</div>
							<div style={{ boxSizing: 'border-box', float: 'right', position: 'relative', margin: '0', width: '50%' }}>
								<h1 style={{ color: '#afafb0', fontFamily: 'sans-serif', fontSize: '72px', fontStyle: 'normal', fontWeight: 'normal', marginBottom: '0.5rem', marginTop: '0.2rem' }}>Estimate</h1>
								<table style={{ borderSpacing: '0', border: 'medium none', width: '100%', background: '#fff', marginBottom: '1.25rem' }}>
									<thead>
										<tr>
											<td style={{ background: '#fff', padding: '0 0 10px 8px', verticalAlign: 'bottom', color: '#222', fontSize: '0.875rem', fontWeight: 'bold', textAlign: 'left', display: 'table-cell', lineHeight: '1.125rem' }}>
												<div style={{ boxSizing: 'border-box', background: 'url(' + LOCAL_IMAGES_PATH + 'circle.png) no-repeat scroll 0 0 / 100% auto', height: '60px', padding: '16px 3px', textAlign: 'center', width: '60px' }}>
													<img style={{ width: '16px' }} src={LOCAL_IMAGES_PATH + 'dollar.png'} />
												</div>
											</td>
											<td style={{ background: '#fff', padding: '0 0 10px 8px', verticalAlign: 'bottom', color: '#222', fontSize: '0.875rem', fontWeight: 'bold', textAlign: 'left', display: 'table-cell', lineHeight: '1.125rem' }}>
												<div style={{ boxSizing: 'border-box', background: 'url(' + LOCAL_IMAGES_PATH + 'circle.png) no-repeat scroll 0 0 / 100% auto', height: '60px', padding: '16px 3px', textAlign: 'center', width: '60px' }}>
													<img style={{ width: '26px' }} src={LOCAL_IMAGES_PATH + 'calendar.png'} />
												</div>
											</td>
											<td style={{ background: '#fff', padding: '0 0 10px 8px', verticalAlign: 'bottom', color: '#222', fontSize: '0.875rem', fontWeight: 'bold', textAlign: 'left', display: 'table-cell', lineHeight: '1.125rem' }}>
												<div style={{ boxSizing: 'border-box', background: 'url(' + LOCAL_IMAGES_PATH + 'circle.png) no-repeat scroll 0 0 / 100% auto', height: '60px', padding: '16px 3px', textAlign: 'center', width: '60px' }}>
													<img style={{ width: '32px' }} src={LOCAL_IMAGES_PATH + 'barcode.png'} />
												</div>
											</td>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td style={{ background: '#63bfe1 url(' + LOCAL_IMAGES_PATH + 'arrow.png) no-repeat scroll 20px top', color: '#fff', fontSize: '16px', padding: '20px' }}>
                                                Amount:<br />
												<strong>$ {grandTotal ? validate.numberWithCommas((grandTotal).toFixed(2)) : grandTotal}</strong>
											</td>
											<td style={{ background: '#63bfe1 url(' + LOCAL_IMAGES_PATH + 'arrow.png) no-repeat scroll 20px top', color: '#fff', fontSize: '16px', padding: '20px' }}>
                                                Date:<br />
												<strong>{moment().format('LL')}</strong>
											</td>
											<td style={{ background: '#63bfe1 url(' + LOCAL_IMAGES_PATH + 'arrow.png) no-repeat scroll 20px top', color: '#fff', fontSize: '16px', padding: '20px' }}>
                                                Estimate #:<br />
												<strong>{this.props.estimateDetails ? this.props.estimateDetails.estimateNumber : ''}<span style={{paddingRight: '5px'}}></span>{this.props.selectedRevision ? this.props.selectedRevision : ''}</strong>
											</td>
										</tr>
									</tbody>
								</table>
                                
							</div>
						</div>{/*header-bottom*/}
						{this.props.estimateDetails.estimateName && this.props.estimateDetails && this.props.includeEstimateName ? <div><span style={{ color: 'rgb(99, 191, 225)', fontFamily: 'sans-serif', fontSize: '16px', fontStyle: 'normal', fontWeight: 'bolder', padding: '5px 5px', marginLeft: '50%'}}>{this.props.estimateDetails.estimateName}</span></div> : null}
						<div style={{ width: '100%', maxWidth: '1200px', float: 'none', margin: '0px auto', minWidth: '768px', overflow: 'hidden' }}>
							<div style={{ boxSizing: 'border-box', width: '100%', float: 'left', position: 'relative', margin: '0px' }}>
								<table style={{ pageBreakInside: 'auto', background: '#fff', border: 'medium none', marginBottom: '0', marginTop: '20px', width: '100%', boxSizing: 'border-box' }}>
									<thead style={{ background: '#f5f5f5' }}>
										<tr>
											<th style={{ padding: '5px', textAlign: 'center', background: '#fff', fontSize: '12px', color: '#63bfe1' }}>#</th>
											<th style={{ display: this.props.combineMfgModelPartDesc ? '' : 'none', padding: '5px', textAlign: 'center', background: '#fff', fontSize: '12px', color: '#63bfe1' }}>Item Description</th>
											{viewerColumns}
										</tr>
									</thead>
									<tbody>
										{estimateItems}
									</tbody>
								</table>
							</div>
						</div>
						<div style={{ width: '100%', maxWidth: '1200px', float: 'none', margin: '0px auto', minWidth: '768px', overflow: 'hidden' }}>
							<div style={{ boxSizing: 'border-box', fontSize: '12px', width: '41.6667%', float: 'left', position: 'relative' }}>
								<table style={{ marginBottom: '1.25rem' }}>
									{this.props.note ? <thead style={{ background: '#f5f5f5' }}>
										<tr>
											<th style={{ boxSizing: 'border-box', lineHeight: '1.125rem', background: '#acacac', padding: '0.5rem 0.625rem 0.625rem', borderRadius: '0 0 5px 5px', color: '#fff', fontWeight: 'normal' }}>
												<strong>{'Note: '}</strong>
												{this.props.note ? this.props.note : '-'}
											</th>
										</tr>
									</thead> : null}
									<tbody>
										{this.props.proposedServices ? <tr>
											<td style={{ background: '#fff', color: '#8f8f8f', fontSize: '18px', paddingBottom: '0', paddingTop: '30px', lineHeight: '1.125rem' }}>
												<p style={{ fontSize: '12px', lineHeight: '14px', margin: '0' }}><strong style={{ fontWeight: 'bold', lineHeight: 'inherit' }}>Proposed Services</strong></p>
												<p style={{ whiteSpace: 'pre-line', fontSize: '12px', margin: '0', boxSizing: 'border-box' }} dangerouslySetInnerHTML={{ __html:this.props.proposedServices ? this.state.proposedS : '-'}}>
												</p>
											</td>
										</tr> : null}
										{this.props.projectLocation ? <tr style={{ background: '#f9f9f9', boxSizing: 'border-box' }}>
											<td style={{ background: '#fff', color: '#8f8f8f', fontSize: '18px', paddingBottom: '0', paddingTop: '30px', boxSizing: 'border-box', lineHeight: '1.125rem' }}>
												<p style={{ fontSize: '12px', lineHeight: '14px', margin: '0' }}>
													<strong style={{ fontWeight: 'bold', lineHeight: 'inherit', boxSizing: 'border-box' }}>Project Name</strong><br />
													{this.props.projectName ? this.props.projectName : '-'}
												</p>
											</td>
										</tr> : null}
										{this.props.projectName ? <tr>
											<td style={{ boxSizing: 'border-box', background: '#fff', color: '#8f8f8f', fontSize: '18px', paddingBottom: '0', paddingTop: '30px' }}>
												<p style={{ fontSize: '12px', lineHeight: '14px', margin: '0', fontWeight: 'normal' }}>
													<strong style={{ fontWeight: 'bold', lineHeight: 'inherit' }}>Project Location</strong><br />
                                                    500 W Temple Blvd, Los Angeles, CA 90077
												</p>
											</td>
										</tr> : null}
									</tbody>
								</table>
							</div>
							<div style={{ boxSizing: 'border-box', float: 'right', marginLeft: '25% !important', width: '33.3333%', position: 'relative' }}>
								<table style={{ width: '100%', border: 'none' }}>
									<tbody>
										{totalRows}
									</tbody>
									<tfoot style={{ background: '#f5f5f5' }}>
										<tr>
											<td style={{ padding: '16px 10px', background: '#63bfe1', color: '#fff', fontSize: '24px', textAlign: 'right' }}>Total:</td>
											<td style={{ padding: '16px 10px', background: '#63bfe1', color: '#fff', fontSize: '24px', textAlign: 'right', paddingRight: '20px' }}>$ {grandTotal ? validate.numberWithCommas((grandTotal).toFixed(2)) : grandTotal}</td>
										</tr>
									</tfoot>
								</table>
								<p style={{ fontSize: '12px', textAlign: 'center' }}>Grand Total includes labor, materials, and applicable taxes</p>
								{this.props.estimateDetails ? <div style={{ textAlign: 'center' }}>
									<p style={{ margin: '0' }}>Sales Person:</p>
									{this.props.estimateDetails.salesRep.salesRepSign && this.props.estimateDetails && this.props.includeSign ? <img style={{ width: '40%', marginBottom: '20px' }} src={this.props.estimateDetails.salesRep.salesRepSign} /> : null}
									<p style={{ margin: '0' }}><strong style={{ fontWeight: 'bold', lineHeight: 'inherit' }}>{this.props.estimateDetails.salesRep ? this.props.estimateDetails.salesRep.firstname + ' ' + this.props.estimateDetails.salesRep.lastname : ''}</strong></p>
								</div> : null}
							</div>
						</div>
						<div style={{ fontSize: '12px', maxWidth: '1200px', width: '100%', float: 'none', margin: '0px auto', minWidth: '768px', overflow: 'hidden' }}>
							<div style={{ boxSizing: 'border-box', width: '100%', float: 'left', position: 'relative', margin: '0' }}>
								<p style={{ fontFamily: 'inherit', fontSize: '16px', fontWeight: 'normal', lineHeight: '1.6', marginBottom: '1.25rem', marginTop: '6px' }}>There’s a one-year warranty on installation.  All installation and programming is performed in accordance with established industry and manufacturer’s standard practices and procedures. </p>
							</div>
						</div>
					</div>
					<div id="removableFooter" style={{ minWidth: '768px', float: 'none', overflow: 'hidden', margin: '0 auto', maxWidth: '1200px', width: '100%', boxSizing: 'border-box', background: 'url(' + LOCAL_IMAGES_PATH + 'footer.png) no-repeat scroll center top', color: '#ababab', fontSize: '14px', padding: '22px 0px 27px 11px' }}>
						<div style={{ boxSizing: 'border-box', width: '41.6667%', float: 'left', position: 'relative' }}>
							<img src={LOCAL_IMAGES_PATH + 'footer-logo-telpro.png'} style={{ width: '60px', display: 'inline-block', verticalAlign: 'middle' }} />
						</div>
						<div style={{ marginLeft: '8.33333% !important', boxSizing: 'border-box', width: '16.6667%', float: 'left', paddingLeft: '0.9375rem', paddingRight: '0', position: 'relative' }}>
							<p style={{ borderRight: '1px solid #d4d2d2', fontSize: '11px', height: '50px', lineHeight: '14px' }}>1139 Westminster Ave, Suite N<br />
                                Alhambra, California 91803<br />
								<br />
                                410 E Ave K-12, Suite 105<br />
                                Lancaster, CA 91354</p>
						</div>
						<div style={{ width: '16.6667%', float: 'left', boxSizing: 'border-box', paddingLeft: '0.9375rem', paddingRight: '0.9375rem', position: 'relative' }}>
							<p style={{ borderRight: '1px solid #d4d2d2', fontSize: '11px', height: '50px', lineHeight: '14px', marginBottom: '1.25rem' }}>(800) 335-2720<br />
                                Fax 323 531 5998<br />
								<br />
                                Monday to Friday<br />
                                8:30am to 4:30pm</p>
						</div>
						<div style={{ float: 'left', width: '16.6667%', boxSizing: 'border-box', paddingLeft: '0.9375rem', paddingRight: '0.9375rem', position: 'relative' }}>
							<p style={{ border: 'none', fontSize: '11px', height: '50px', lineHeight: '14px' }}>www.tel-pro.net<br />
								<br />
                                contact@tel-pro.net<br />
                                accounting@tel-pro.net<br />
                                support@tel-pro.net</p>
						</div>
					</div>
				</div>
				{/*screen*/}
			</div>
		);
	}
}
export default EstimatePdfViewer;

