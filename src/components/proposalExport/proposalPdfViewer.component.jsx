import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import * as validate from '../common/validator';
import { LOCAL_IMAGES_PATH } from '../../../tools/config';
import '../../styles/normalize.css';
import '../../styles/foundation.min.css';

class ProposalPdfViewer extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	render() {
		let estimateTotal;		
		if(this.props.proposalDetails.proposedEstimates && this.props.proposalDetails.proposedEstimates.length==1){
			estimateTotal=this.props.proposalDetails.proposedEstimates[0].total;
		}else {
			estimateTotal=this.props.proposalDetails.proposedEstimates?this.props.proposalDetails.proposedEstimates.reduce(function (prev,next) {
				return Number(prev)+Number(next.total);
			}.bind(this),0):null;
		}
		
		let taxTotal=estimateTotal?((parseFloat(this.props.defaultTax) / 100) * estimateTotal) : 0;
		let grandTotal=taxTotal!=0?estimateTotal+taxTotal:estimateTotal;
		let proposedServiceList=this.props.proposalDetails.proposedEstimates?this.props.proposalDetails.proposedEstimates.map(function (list, index) {   
			return(<li  key={index} style={{ boxSizing: 'border-box', margin: '0', padding: '0', }}><p style={{ boxSizing: 'border-box', margin: '0', padding: '0', fontFamily: ' "Open Sans", sans-serif ', fontWeight: 'normal', fontSize: '16px', lineHeight: '1.6', marginBottom: '1.25rem', textRendering: 'optimizeLegibility' }} dangerouslySetInnerHTML={{ __html:list.estimateId.proposedServices ? list.estimateId.proposedServices : '-'}}>
			</p>
			</li>
			);
			
		}.bind(this)):'';


			// { isVisible: true, isHidden: false }
		let filteredColumns = _.filter(this.props.itemColumns, { isVisible: true});
	
		let viewerColumns = filteredColumns.map(function (column, i) {
			return <th key={i} style={{ padding: '5px', textAlign: 'center', background: '#fff', fontSize: '12px', color: '#63bfe1' }}>{column.fieldName}</th>;
		}.bind(this));

		let countItem = 0;
		let alignItem = 'left';
		const initiater = this.props.showDollarSign ? '$' : '';
		let estimatesList = this.props.proposalDetails.proposedEstimates?this.props.proposalDetails.proposedEstimates.map(function (item, i) {
			countItem = countItem + 1;
			

			return <tr key={i}>
				<td style={{ background: countItem % 2 ? '#e8e8e9' : '', textAlign: 'center', padding: '5px', verticalAlign: 'middle', color: '#616262' }}>
					<div style={{ pageBreakInside: 'avoid', margin: '4px 0 4px 0' }}>
						{countItem}
					</div>
				</td>
			
				{filteredColumns.map(function (res, j) {
					let val = null;
					switch (res.columnName) {
					case 'estimateNo':
						val = item.estimateNumber;
						alignItem = 'center';
						break;
					case 'estimateName':
						val = item.estimateName;
						alignItem = 'center';
						break;
					case 'estimateTotal':
						val = initiater + '' + (item.total!=null ? validate.numberWithCommas((item.total).toFixed(2)) : 0);
						alignItem = 'center';
						break;
					case 'estimateStatus':
						val = item.status?item.status:'-';
						alignItem = 'center';
						break;			
					default:
						null;
					}
					return 	<td key={j} style={{ background: countItem % 2 ? '#e8e8e9' : '', textAlign: alignItem ? alignItem : 'center',boxSizing: 'border-box', margin: '0', padding: '20px', fontSize: '14px', color: '#616262', display: 'table-cell', lineHeight: '1.125rem', verticalAlign: 'middle'}}>
						<div style={{ pageBreakInside: 'avoid', margin: '4px 0 4px 0' }}>
							{val}
						</div>
					</td>;
				})}
			</tr>;
		}.bind(this)):'';


		let filteredTotals = _.filter(this.props.totalColumns, { isVisible: true });
		let totalRows = filteredTotals.map(function (total, j) {

			let totalName = null;
			let totalValue = null;
			switch (total.columnName) {
			case 'taxTotal':
				totalName = total.fieldName;
				totalValue = taxTotal;
				break;
			default:
				null;
			}
			return (
				<tr key={j} style={{ boxSizing: 'border-box', background: '#f9f9f9',  }}>
					<td style={{ boxSizing: 'border-box', margin: '0', padding: '0.5625rem 0.625rem', fontSize: '18px', color: '#222', display: 'table-cell', lineHeight: 'normal', background: '#fff',textAlign: 'right'}}>{totalName}:</td>
					<td style={{ boxSizing: 'border-box', margin: '0', padding: '0.5625rem 0.625rem', fontSize: '18px', color: '#222', display: 'table-cell', lineHeight: 'normal',  background: '#fff', textAlign: 'right', paddingRight: '20px' }}>$ {(totalValue?validate.numberWithCommas((totalValue).toFixed(2)):0)}</td>
				</tr >
			);
		}.bind(this));
	
		
		return (
			<div ref="pdfDiv" className="col-md-9"  style={{ height: '100%', boxSizing: 'border-box', fontSize: '100%', background: '#fff', color: '#616262', padding: '0', margin: '0', fontWeight: 'normal', fontStyle: 'normal', lineHeight: '1', position: ' relative', cursor: 'default' }}>
				<div style={{ boxSizing: 'border-box', margin: '0', padding: '0', }}>
					<div className="header row" style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', margin: '0 auto', paddingLeft: '0', paddingRight: '0', padding: '0', }}>

						<div className="large-5 medium-8 small-12 columns" style={{ boxSizing: 'border-box', float: 'left', margin: '0 auto', paddingLeft: '0', paddingRight: '0', padding: '0 15px', marginTop: '20px'}}>
							<img src={LOCAL_IMAGES_PATH + 'logo-telpro.png'} style={{ boxSizing: 'border-box', maxWidth: '100%', height: 'auto',display: 'inline-block',verticalAlign: 'middle', width: '342px'}} />
						</div>

						<div className="large-2 medium-12 small-12 large-offset-1 columns" style={{ boxSizing: 'border-box', paddingLeft: '0', paddingRight: '0.9375rem', width: '200px', float: 'left', margin: '0', padding: '0 20px', marginLeft: ' 13%',  marginTop: '20px', minHeight: '130px', borderBottom: '1px solid #e3e2e2' }}>
							<div className="header-contact" style={{ boxSizing: 'border-box', margin: '0', padding: '0', minHeight: '100px',borderRight: '1px solid #e3e2e2'}}>
								<img className="icon-mail" src={LOCAL_IMAGES_PATH + 'mail.png'} style={{ boxSizing: 'border-box', maxWidth: '30px', height: 'auto',display: 'inline-block',verticalAlign: 'middle',width: '14%',marginBottom: '13px'}} />
								<p style={{ boxSizing: 'border-box', margin: '0', padding: '0', fontFamily: ' "Open Sans", sans-serif ', fontWeight: 'normal', fontSize: '10px', lineHeight: '16px', marginBottom: '1.25rem', textRendering: 'optimizeLegibility', color: '#ababab' }}>1139 Westminster Ave, Suite N<br style={{ boxSizing: 'border-box', }} />
					Alhambra, California 91803<br style={{ boxSizing: 'border-box', }} />
									<br style={{ boxSizing: 'border-box', }} />
					410 E Ave K-12, Suite 105<br style={{ boxSizing: 'border-box', }} />
					Lancaster, CA 91354</p>
							</div>
						</div >

						<div className="large-2 medium-12 small-12 columns" style={{ boxSizing: 'border-box', paddingLeft: '0', paddingRight: '0.9375rem', width: '140px', float: 'left', margin: '0', padding: '0',  marginTop: '20px', minHeight: '130px', borderBottom: '1px solid #e3e2e2' }}>
							<div className="header-contact" style={{ boxSizing: 'border-box', margin: '0', padding: '0', minHeight: '100px',borderRight: '1px solid #e3e2e2'}}>
								<img className="icon-telephone" src={LOCAL_IMAGES_PATH + 'phone.png'} style={{ boxSizing: 'border-box', maxWidth: '30px', height: 'auto',display: 'inline-block',verticalAlign: 'middle',marginBottom: '5px',width: '12px'}} />
								<p style={{ boxSizing: 'border-box', margin: '0', padding: '0', fontFamily: ' "Open Sans", sans-serif ', fontWeight: 'normal', fontSize: '10px', lineHeight: '16px', marginBottom: '1.25rem', textRendering: 'optimizeLegibility', color: '#ababab' }}>(800) 335-2720<br style={{ boxSizing: 'border-box', }}/>
					Fax 323 531 5998<br style={{ boxSizing: 'border-box', }} />
									<br style={{ boxSizing: 'border-box', }} />
					Monday to Friday<br style={{ boxSizing: 'border-box', }} />
					8:30am to 4:30pm</p>
							</div>
						</div >

						<div className="large-2 medium-12 small-12 columns" style={{ boxSizing: 'border-box', paddingLeft: '0', paddingRight: '0.9375rem', width: '140px', float: 'left', margin: '0', padding: '0',  marginTop: '20px', minHeight: '130px', borderBottom: '1px solid #e3e2e2', marginLeft: '10px', marginBottom: '40px' }}>
							<div className="header-contact" style={{ borderRight: 'none', boxSizing: 'border-box', margin: '0', padding: '0', minHeight: '100px'}}>
								<img className="icon-web" src={LOCAL_IMAGES_PATH + 'world.png'} style={{ boxSizing: 'border-box', maxWidth: '30px', height: 'auto',display: 'inline-block',verticalAlign: 'middle',width: '12%'}} />
								<p style={{ boxSizing: 'border-box', margin: '0', padding: '0', fontFamily: ' "Open Sans", sans-serif ', fontWeight: 'normal', fontSize: '10px', lineHeight: '16px', marginBottom: '1.25rem', textRendering: 'optimizeLegibility', color: '#ababab' }}>www.tel-pro.net<br style={{ boxSizing: 'border-box', }} />
					contact@tel-pro.net<br style={{ boxSizing: 'border-box', }}/>
					support@tel-pro.net<br style={{ boxSizing: 'border-box', }} />
									<br style={{ boxSizing: 'border-box', }} />
					License #773094</p>
							</div>
						</div >

					</div >
					{/* header  */}

					<div className="header-bottom row" style={{ boxSizing: 'border-box', width: ' 100%', maxWidth: '1200px', margin: '0 auto', padding: '0',  clear: 'both', }}>

						<div className="large-6 medium-6 columns header-bottom-left" style={{ boxSizing: 'border-box', width: '50%', float: 'left', margin: '0', padding: '0 15px', marginTop: '18px'}}>

							<h3 style={{ boxSizing: 'border-box', margin: '0', padding: '0', fontWeight: 'normal',fontStyle: 'normal',color: '#727478',textRendering: 'optimizeLegibility', lineHeight: '1.4',fontSize: '18px'}}><img className="icon-invoice" src={LOCAL_IMAGES_PATH + 'invoice.png'} style={{ boxSizing: 'border-box', maxWidth: '100%', height: 'auto',display: 'inline-block',verticalAlign: 'middle',width: '5%',minWidth: '22px', fontFamily: ' "Open Sans", sans-serif '}} />PROPOSAL FOR</h3>
							<h2 style={{ boxSizing: 'border-box', margin: '0', padding: '0',  fontWeight: 'bold', fontStyle: 'normal', color: '#727478', textRendering: 'optimizeLegibility', marginTop: '0.2rem', marginBottom: '0.5rem', lineHeight: '1.4', fontSize: '26px' , fontFamily: ' "Open Sans", sans-serif '}}>{this.props.proposalDetails ? this.props.proposalDetails.customerId.companyName : ''}</h2>
							<p style={{ marginBottom: '10px', lineHeight: '22px', boxSizing: 'border-box', margin: '0', padding: '0',  fontWeight: 'normal', fontSize: '14px', textRendering: 'optimizeLegibility', color: ' #727478', fontFamily: ' "Open Sans", sans-serif ' }}>Attn: {this.props.proposalDetails.individualId ? this.props.proposalDetails.individualId.firstname + ' ' + this.props.proposalDetails.individualId.lastname : ''}</p>
							<p style={{ boxSizing: 'border-box', margin: '0', padding: '0',  fontWeight: 'normal', fontSize: '14px', lineHeight: '16px', marginBottom: '0', textRendering: 'optimizeLegibility', color: ' #727478' , fontFamily: ' "Open Sans", sans-serif '}}>Project Name</p>
							<h6 style={{ boxSizing: 'border-box', margin: '0', padding: '0',  fontWeight: 'normal', fontStyle: 'normal', color: '#222', textRendering: 'optimizeLegibility', marginTop: '0.2rem', marginBottom: '0.5rem', lineHeight: '1.4', fontSize: '14px', fontFamily: ' "Open Sans", sans-serif ' }}>{this.props.proposalDetails.projectName?this.props.proposalDetails.projectName:''}</h6> <br style={{ boxSizing: 'border-box',  }} />
							<p style={{ boxSizing: 'border-box', margin: '0', padding: '0', fontWeight: 'normal', fontSize: '14px', lineHeight: '16px', marginBottom: '0', textRendering: 'optimizeLegibility', color: ' #727478' , fontFamily: ' "Open Sans", sans-serif '}}>Project Location</p>
							<h6 style={{ boxSizing: 'border-box', margin: '0', padding: '0',  fontWeight: 'normal', fontStyle: 'normal', color: '#222', textRendering: 'optimizeLegibility', marginTop: '0.2rem', marginBottom: '0.5rem', lineHeight: '1.4', fontSize: '14px' , fontFamily: ' "Open Sans", sans-serif '}}>{this.props.proposalDetails.projectLocation?this.props.proposalDetails.projectLocation:''}</h6>
						</div >

						<div className="large-6 medium-6 columns invoice-header" style={{ boxSizing: 'border-box', width: '50%', float: 'right', margin: '0', padding: '0 15px',  }}>

							<h1 style={{ boxSizing: 'border-box', margin: '0', padding: '0', fontWeight: 'normal',fontStyle: 'normal',color: '#afafb0',textRendering: 'optimizeLegibility',marginTop: '0.2rem',marginBottom: '0.5rem',lineHeight: '1.4',fontSize: '72px', fontFamily: ' "Open Sans", sans-serif '}}>Proposal</h1>

							<table style={{ borderCollapse:'collapse',boxSizing: 'border-box', background: '#fff', marginBottom: '1.25rem', border: 'none',  width: '100%' , fontFamily: ' "Open Sans", sans-serif '}}>
								<thead style={{ boxSizing: 'border-box', background: '#f5f5f5',}}>
									<tr style={{ boxSizing: 'border-box', }}>
										<td style={{ boxSizing: 'border-box', margin: '0', padding: '0 0 10px 8px', fontSize: '0.875rem', fontWeight: 'bold', color: '#222', textAlign: 'left', display: 'table-cell', lineHeight: '1.125rem', background: '#fff',verticalAlign: 'bottom'}}><div className="circle" style={{ boxSizing: 'border-box', margin: '0', padding: '16px 3px', background: 'url(' + LOCAL_IMAGES_PATH + 'circle.png) no-repeat scroll 0 0/100% auto rgba(0, 0, 0, 0)',height: '60px',textAlign: 'center',width: '60px'}}><img className="icon-dollar" src={LOCAL_IMAGES_PATH + 'dollar.png'} style={{ boxSizing: 'border-box', maxWidth: '100%', height: 'auto',display: 'inline-block',verticalAlign: 'middle',width: '16px'}} /></div></td >
										<td style={{ boxSizing: 'border-box', margin: '0', padding: '0 0 10px 8px', fontSize: '0.875rem', fontWeight: 'bold', color: '#222', textAlign: 'left', display: 'table-cell', lineHeight: '1.125rem',  background: '#fff', verticalAlign: 'bottom' }}><div className="circle" style={{ boxSizing: 'border-box', margin: '0', padding: '16px 3px', background: 'url(' + LOCAL_IMAGES_PATH + 'circle.png) no-repeat scroll 0 0/100% auto rgba(0, 0, 0, 0)',height: '60px',textAlign: 'center',width: '60px'}}><img className="icon-calendar" src={LOCAL_IMAGES_PATH + 'calendar.png'} style={{ boxSizing: 'border-box', maxWidth: '100%', height: 'auto',display: 'inline-block',verticalAlign: 'middle',width: '26px'}} /></div></td >
										<td style={{ boxSizing: 'border-box', margin: '0', padding: '0 0 10px 8px', fontSize: '0.875rem', fontWeight: 'bold', color: '#222', textAlign: 'left', display: 'table-cell', lineHeight: '1.125rem',  background: '#fff', verticalAlign: 'bottom' }}><div className="circle" style={{ paddingTop: '20px', boxSizing: 'border-box', margin: '0', padding: '16px 3px', background: 'url(' + LOCAL_IMAGES_PATH + 'circle.png) no-repeat scroll 0 0/100% auto rgba(0, 0, 0, 0)',height: '60px',textAlign: 'center',width: '60px'}}><img className="icon-barcode" src={LOCAL_IMAGES_PATH + 'barcode.png'} style={{ boxSizing: 'border-box', maxWidth: '100%', height: 'auto',display: 'inline-block',verticalAlign: 'middle',width: '32px'}} /></div></td >
									</tr >
								</thead >
								<tbody style={{ boxSizing: 'border-box',  }}>
									<tr style={{ boxSizing: 'border-box', background: '#f9f9f9', }}>
										<td style={{ boxSizing: 'border-box', margin: '0', padding: '20px', fontSize: '16px', color: '#fff', display: 'table-cell', lineHeight: 'normal', background: 'url('+ LOCAL_IMAGES_PATH + 'arrow.png) no-repeat 20px top #63bfe1'}}>
						Amount:<br style={{ boxSizing: 'border-box', }} />
											<strong style={{ boxSizing: 'border-box', fontWeight: 'bold', lineHeight: 'inherit', fontFamily: ' "Open Sans", sans-serif ' }}>$ {(grandTotal ? validate.numberWithCommas((grandTotal).toFixed(2)) : 0)}</strong>
										</td >
										<td style={{
											boxSizing: 'border-box', margin: '0', padding: '20px', fontSize: '16px', color: '#fff', display: 'table-cell', lineHeight: 'normal',  background: 'url('+ LOCAL_IMAGES_PATH + 'arrow.png) no-repeat 20px top #63bfe1'}} >
                    Date:< br style={{ boxSizing: 'border-box',  }} />
											<strong style={{ boxSizing: 'border-box', fontWeight: 'bold', lineHeight: 'inherit', fontFamily: ' "Open Sans", sans-serif ' }}>{moment().format('LL')}</strong>
										</td >
										<td style={{
											boxSizing: 'border-box', margin: '0', padding: '20px', fontSize: '16px', color: '#fff', display: 'table-cell', lineHeight: 'normal',  background: 'url('+ LOCAL_IMAGES_PATH + 'arrow.png) no-repeat 20px top #63bfe1'}} >
                    Proposal #:< br style={{ boxSizing: 'border-box',  }} />
											<strong style={{ boxSizing: 'border-box', fontWeight: 'bold', lineHeight: 'inherit', fontFamily: ' "Open Sans", sans-serif ' }}>{this.props.proposalDetails.proposalNumber?this.props.proposalDetails.proposalNumber:''}</strong>
										</td >
									</tr>
								</tbody >
							</table >

						</div >

					</div >
					{/* header-bottom  */}
					<div className="row intro" style={{ boxSizing: 'border-box', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '0', maxWidth: '1200px', padding: '20px 15px',  fontSize: '12px', display: 'block', clear: 'both', }}>
						<div className="large-12 columns" style={{ boxSizing: 'border-box', paddingLeft: '0.9375rem', paddingRight: '0.9375rem', width: '100%', float: 'left', margin: '0', padding: '0', }}>
							{/* <p style={{ boxSizing: 'border-box', margin: '0', padding: '0', fontFamily: ' "Open Sans", sans-serif ', fontWeight: 'normal', fontSize: '14px', lineHeight: '1.6', marginBottom: '1.25rem', textRendering: 'optimizeLegibility' }}><strong style={{ boxSizing: 'border-box', fontWeight: 'bold', lineHeight: 'inherit', }}>The following proposal is to install and furnish per plan E Drawings, specifications and 1 addendum:</strong></p> */}
							<ul style={{ boxSizing: 'border-box', margin: '0', padding: '0', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.25rem', listStylePosition: 'outside', fontFamily: ' "Open Sans", sans-serif ', marginLeft: '1.1rem' }}>
								{proposedServiceList}
								<table className="products-table" style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box', background: '#fff', marginBottom: '0', border: 'none',  marginTop: '20px' }}>
									<thead style={{ boxSizing: 'border-box', background: '#f5f5f5', }}>
										<th style={{ padding: '5px', textAlign: 'center', background: '#fff', fontSize: '12px', color: '#63bfe1' }}>#</th>
										{viewerColumns}
									</thead >
									<tbody style={{ boxSizing: 'border-box',  }}>
										{estimatesList}
									</tbody >
								</table >								
							</ul >
						</div >
					</div >
					<div className="row" style={{ boxSizing: 'border-box', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginTop: '0', marginBottom: '0', maxWidth: '1200px', padding: '0 10px',  clear: 'both', }}>
						<div className="large-5 medium-5 small-12 columns bottom-left show-for-medium-up " style={{ boxSizing: 'border-box', width: '40%', float: 'left', margin: '0', padding: '0', fontSize: '12px'}}>
							<table style={{ boxSizing: 'border-box', background: '#fff', marginBottom: '1.25rem', border: 'none', }}>
								<thead style={{ boxSizing: 'border-box', background: '#f5f5f5', }}>
									<tr style={{ boxSizing: 'border-box', }}>
										<th style={{ boxSizing: 'border-box', margin: '0', padding: '0.5625rem 0.625rem', fontSize: '13px', fontWeight: 'normal', color: '#fff', textAlign: 'left', display: 'table-cell', lineHeight: 'normal', background: '#acacac',borderRadius: '0 0 5px 5px',}}><strong style={{ boxSizing: 'border-box', fontWeight: 'bold', lineHeight: 'inherit', }}>Note:</strong> This proposal does not include any EMT conduit, cabling, wire mold raceway, or any electrical work.</th >
									</tr >
								</thead >
							</table >
						</div >
						<div className="large-4 medium-6 small-12 large-offset-3 columns totals" style={{ boxSizing: 'border-box', float: 'right', margin: '0', padding: '0', marginLeft:'25% !important', width: '33.33333%' }}>
							<table style={{ boxSizing: 'border-box', background: '#fff', marginBottom: '1.25rem', border: 'none', width: '100%'}}>
								<tbody style={{ boxSizing: 'border-box', }}>
									<tr style={{ boxSizing: 'border-box', }}>
										<td style={{ boxSizing: 'border-box', margin: '0', padding: '0.5625rem 0.625rem', fontSize: '18px', color: '#222', display: 'table-cell', lineHeight: 'normal', background: '#fff',textAlign: 'right'}}>TOTAL:</td>
										<td style={{ boxSizing: 'border-box', margin: '0', padding: '0.5625rem 0.625rem', fontSize: '18px', color: '#222', display: 'table-cell', lineHeight: 'normal',  background: '#fff', textAlign: 'right', paddingRight: '20px' }}>$ {(estimateTotal ? validate.numberWithCommas((estimateTotal).toFixed(2)) : 0)}</td>
									</tr >
									{totalRows}
								</tbody >
								<tfoot style={{ borderCollapse:'collapse', boxSizing: 'border-box', background: '#f5f5f5',  }}>
									<tr style={{ boxSizing: 'border-box', }}>
										<td style={{ boxSizing: 'border-box', margin: '0', padding: '16px 10px', fontSize: '24px', fontWeight: 'bold', color: '#fff', textAlign: 'right', display: 'table-cell', lineHeight: 'normal', background: '#63bfe1'}}>Grand Total:</td>
										<td style={{ boxSizing: 'border-box', margin: '0', padding: '16px 10px', fontSize: '24px', fontWeight: 'bold', color: '#fff', textAlign: 'right', display: 'table-cell', lineHeight: 'normal',  background: '#63bfe1', paddingRight: '20px' }}>{grandTotal ? '$ '+validate.numberWithCommas((grandTotal).toFixed(2)) : 0}</td>
									</tr >
								</tfoot >
							</table >
							<p style={{ fontSize: '12px', textAlign: 'center', boxSizing: 'border-box', margin: '0', padding: '0', fontFamily: ' "Open Sans", sans-serif ', fontWeight: 'normal', lineHeight: '1.6', marginBottom: '1.25rem', textRendering: 'optimizeLegibility' }}>Grand Total includes labor, materials, and applicable taxes</p>
							{this.props.proposalDetails ? <div style={{ textAlign: 'center', lineHeight:'normal' }}>
								<p style={{ margin: '0' }}>Sales Person:</p>
								{this.props.proposalDetails.salesRep.salesRepSign && this.props.proposalDetails && this.props.includeSign ? <img style={{ width: '40%', marginBottom: '20px' }} src={this.props.proposalDetails.salesRep.salesRepSign} /> : null}
								<p style={{ margin: '0' }}><strong style={{ fontWeight: 'bold', lineHeight: 'inherit' }}>{this.props.proposalDetails.salesRep ? this.props.proposalDetails.salesRep.firstname + ' ' + this.props.proposalDetails.salesRep.lastname : ''}</strong></p>
							</div> : null}
						</div >
					</div >

					{/* This section enables for smaller screens and phones */ }
					< div className = "row terms" style = {{ boxSizing: 'border-box', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginTop: '100px', marginBottom: '0', maxWidth: '1200px', padding: '0 10px', fontFamily: 'Open Sans', fontSize: '12px', display: 'block', clear: 'both',}}>
						<div className="large-12 columns" style={{ boxSizing: 'border-box', paddingLeft: '0.9375rem', paddingRight: '0.9375rem', width: '100%', float: 'left', margin: '0', padding: '0',  }}>
							<p style={{ boxSizing: 'border-box', margin: '0', padding: '0', fontFamily: ' "Open Sans", sans-serif ', fontWeight: 'normal', fontSize: '14px', lineHeight: '1.6', marginBottom: '1.25rem', textRendering: 'optimizeLegibility' }}>There's a one-year warranty on installation.  All installation and programming is performed in accordance with established industry and manufacturer’s standard practices and procedures. </p>
						</div>
					</div >

					<div className="footer row" style={{ boxSizing: 'border-box', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginTop: '0', marginBottom: '0', maxWidth: '1200px', padding: '30px 0',  background: 'url(' + LOCAL_IMAGES_PATH + 'footer.png) no-repeat top', fontSize: '14px', color: '#ababab', display: 'block', clear: 'both', }}>
						<div className="large-5 medium-3 columns" style={{ boxSizing: 'border-box', paddingLeft: '0.9375rem', paddingRight: '0.9375rem', float: 'left', margin: '0', }}>
							<img src={LOCAL_IMAGES_PATH + 'footer-logo-telpro.png'} style={{ boxSizing: 'border-box', maxWidth: '100%', height: 'auto',display: 'inline-block',verticalAlign: 'middle',width: '60px'}} />
						</div>
						<div style={{ float: 'right' }} className="large-7">
							<div className="large-2 medium-3 large-offset-1 columns" style={{ boxSizing: 'border-box', margin: '0',  display: 'inline-block', padding: '5px 0 30px 0', minWidth: '170px',}}>
								<p style={{ boxSizing: 'border-box', margin: '0', padding: '0 20px', fontFamily: ' "Open Sans", sans-serif ', fontWeight: 'normal', fontSize: '11px', lineHeight: '14px', marginBottom: '1.25rem', textRendering: 'optimizeLegibility', height: '50px', borderRight: '1px solid #d4d2d2' }}>1139 Westminster Ave, Suite N<br style={{ boxSizing: 'border-box', }} />
					Alhambra, California 91803<br style={{ boxSizing: 'border-box', }} />
									<br style={{ boxSizing: 'border-box', }} />
					410 E Ave K-12, Suite 105<br style={{ boxSizing: 'border-box', }} />
					Lancaster, CA 91354</p>
							</div>

							<div className="large-2 medium-3 columns" style={{ boxSizing: 'border-box', paddingLeft: '0.9375rem', paddingRight: '0.9375rem', margin: '0',  display: 'inline-block', padding: '5px 0 30px 0', minWidth: '170px', }}>        <p style={{ boxSizing: 'border-box', margin: '0', padding: '0', fontFamily: ' "Open Sans", sans-serif ', fontWeight: 'normal', fontSize: '11px', lineHeight: '14px', marginBottom: '1.25rem', textRendering: 'optimizeLegibility', height: '50px', borderRight: '1px solid #d4d2d2', }}>(800) 335-2720<br style={{ boxSizing: 'border-box',}} />
					Fax 323 531 5998<br style={{ boxSizing: 'border-box',}} />
								<br style={{ boxSizing: 'border-box',}} />
					Monday to Friday<br style={{ boxSizing: 'border-box',}} />
					8:30am to 4:30pm</p>
							</div>

							<div className="large-2 medium-3 columns" style={{ boxSizing: 'border-box', margin: '0',  display: 'inline-block', padding: '5px 0 30px 0', minWidth: '170px' }}>        <p style={{ border: 'none', boxSizing: 'border-box', margin: '0', padding: '0', fontFamily: ' "Open Sans", sans-serif ', fontWeight: 'normal', fontSize: '11px', lineHeight: '14px', marginBottom: '1.25rem', textRendering: 'optimizeLegibility', height: '50px', }}>www.tel-pro.net<br style={{ boxSizing: 'border-box',}} />
								<br style={{ boxSizing: 'border-box',}} />
					contact@tel-pro.net<br style={{ boxSizing: 'border-box',}} />
					accounting@tel-pro.net<br style={{ boxSizing: 'border-box',}}/>
					support@tel-pro.net</p>
							</div>
						</div >
					</div >

				</div > 
			</div >
		);
	}
}
export default ProposalPdfViewer;

