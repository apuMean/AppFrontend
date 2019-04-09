import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as poActions from '../../actions/poActions';
import * as functions from '../common/functions';
import * as validate from '../common/validator';
import DeleteModal from '../common/deleteModal.component';
import autoBind from 'react-autobind';

class PODetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            poDetails: '',
            vendorAddress: '',
            shippingAddress: '',
            attachmentDetails: [],
            itemPricedData: [],
            poId: '',
            itemTab: 'active',
            materialTab: '',
            laborTab: '',
            breadcrumb: true
        }
    }

    componentWillMount() {
        var poId = {
            poId: this.props.params.poId
        }
        this
            .props
            .actions
            .getPoDetails(poId);
    }

    componentDidMount() {
        functions.showLoader('poList');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.poDetail) {
            var postate = nextProps.poDetail.PoDetails;
            var itemState = nextProps.poDetail.itemLists;
            var vendorAddress = postate.vendorAddress1 + ' ' + postate.vendorAddress2 + ' ' + postate.vendorCity + ' ' + postate.vendorState + ' ' + postate.vendorZip
            var shippingAddress = postate.shippingAddress1 + ' ' + postate.shippingAddress2 + ' ' + postate.shippingCity + ' ' + postate.shippingState + ' ' + postate.shippingZip
            this.setState({
                poDetails: postate, itemPricedData: nextProps.poDetail.itemLists,
                vendorAddress: vendorAddress, shippingAddress: shippingAddress,
                attachmentDetails: nextProps.poDetail.attachmentlists
            });
            if (this.state.breadcrumb && postate.poNumber) {
                var data = {
                    parent: <Link to='/po'>Purchase Orders</Link>,
                    childone: ('#' + postate.poNumber) + ' (' + postate.customerId.companyName + ')',
                    childtwo: ''
                };
                this.props.breadCrumb(data);
                this.state.breadcrumb = false;
            }
            $('div#poList').unblock();
        }
    }

    handleDelete() {
        this.setState({ poId: this.props.params.poId });
        $('#po_delete').modal('show');
    }

    handleLineTab(tabIndex) {
        if (tabIndex === 1) {
            this.setState({ itemTab: 'active', materialTab: '', laborTab: '' })
        }
        else if (tabIndex === 2) {
            this.setState({ itemTab: '', materialTab: 'active', laborTab: '' })
        }
        else if (tabIndex === 3) {
            this.setState({ itemTab: '', materialTab: '', laborTab: 'active' })
        }
    }

    deletePoHandler() {

        if (this.state.poId) {
            $('#po_delete').modal('hide');
            functions.showLoader('poList');
            var data = {
                poId: this.state.poId
            }
            this.props.actions.deletePo(data);
        }
    }

    render() {
        let mOurCostExtTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
        let lHoursExtended = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHoursExtended : prev, 0);
        let lExtended = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
        let totalShipping = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId === 3) ? prev + next.rowTotal : prev, 0);

        let shipVia = '';
        let status = '';
        let countItem = 0;
        let countMaterial = 0;
        let countLabor = 0;
        let itemTabData = this
            .state
            .itemPricedData
            .map(function (i, index) {
                if (i.itemTypeId == 1) {
                    countItem = countItem + 1;
                } else if (i.itemTypeId == 2) {
                    countItem = countItem + 1;
                } else if (i.itemTypeId == 3) {
                    countItem = countItem + 1;
                } else if (i.itemTypeId == 4) {
                    countItem = countItem;
                }
                if (i.itemTypeId === 1) {
                    return (
                        <tr key={index}>
                            <td>{countItem ? countItem : ''}</td>
                            <td>{i.itemMfg}</td>
                            <td>{i.modelNo ? i.modelNo : '-'}</td>
                            <td>{i.partNo ? i.partNo : '-'}</td>
                            <td>{i.itemName}</td>
                            <td>{i.quantity}</td>
                            <td style={{ textAlign: 'right', cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 2)}>{i.mOurCostExtended ? '$' + validate.numberWithCommas((i.mOurCostExtended).toFixed(2)) : '$' + 0}</td>
                            <td style={{ textAlign: 'right', cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>{i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
                            <td>{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                        </tr>
                    )
                }
                else if (i.itemTypeId === 2) {
                    return (
                        <tr key={index}>
                            <td>{countItem ? countItem : ''}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td >{i.itemName}</td>
                            <td>{i.quantity}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td>{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                        </tr>
                    )
                }
                else if (i.itemTypeId === 3) {
                    return (
                        <tr key={index}>
                            <td>{countItem ? countItem : ''}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td >{i.itemName}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td>{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                        </tr>
                    )
                }
                else if (i.itemTypeId === 4) {
                    return (
                        <tr key={index}>
                            <td className="unselectable-header" colSpan="9">{i.headerName}</td>
                        </tr>
                    )
                }
            }.bind(this));

        let materialTabData = this
            .state
            .itemPricedData
            .map(function (i, index) {
                if (i.itemTypeId == 1) {
                    countMaterial = countMaterial + 1;
                } else if (i.itemTypeId == 2) {
                    countMaterial = countMaterial + 1;
                } else if (i.itemTypeId == 3) {
                    countMaterial = countMaterial + 1;
                } else if (i.itemTypeId == 4) {
                    countMaterial = countMaterial;
                }
                if (i.itemTypeId === 1) {
                    return (<tr key={index}>
                        <td>{countMaterial ? countMaterial : ''}</td>
                        <td>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
                        <td>{i.quantity}</td>
                        <td>{i.mOurCost ? '$' + validate.numberWithCommas((i.mOurCost).toFixed(2)) : '$' + 0}</td>
                        <td>{i.mOurCostExtended ? '$' + validate.numberWithCommas((i.mOurCostExtended).toFixed(2)) : '$' + 0}</td>
                        <td style={{ textAlign: 'right', cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>{i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
                        <td>{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                    </tr>)
                }
                else if (i.itemTypeId === 2) {
                    return (<tr key={index}>
                        <td>{countMaterial ? countMaterial : ''}</td>
                        <td>{i.itemName ? i.itemName : ''}</td>
                        <td>{i.quantity}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td>{i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
                        <td>{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                    </tr>)
                }
                else if (i.itemTypeId === 3) {
                    return (<tr key={index}>
                        <td>{countMaterial ? countMaterial : ''}</td>
                        <td>{i.itemName ? i.itemName : ''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td>{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                    </tr>)
                }
                else if (i.itemTypeId === 4) {
                    return (
                        <tr key={index}>
                            <td className="unselectable-header" colSpan="7">{i.headerName}</td>
                        </tr>
                    )
                }
            }.bind(this));

        let laborTabData = this
            .state
            .itemPricedData
            .map(function (i, index) {
                if (i.itemTypeId == 1) {
                    countLabor = countLabor + 1;
                } else if (i.itemTypeId == 2) {
                    countLabor = countLabor + 1;
                } else if (i.itemTypeId == 3) {
                    countLabor = countLabor + 1;
                } else if (i.itemTypeId == 4) {
                    countLabor = countLabor;
                }
                if (i.itemTypeId === 1) {
                    return (<tr key={index}>
                        <td>{countLabor ? countLabor : ''}</td>
                        <td>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
                        <td>{i.quantity}</td>
                        <td style={{ textAlign: 'right', cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 2)}>{i.mOurCostExtended ? '$' + validate.numberWithCommas((i.mOurCostExtended).toFixed(2)) : '$' + 0}</td>
                        <td>{i.lHours}</td>
                        <td>{i.lHoursExtended}</td>
                        <td>{i.lRate ? '$' + validate.numberWithCommas((i.lRate).toFixed(2)) : '$' + 0}</td>
                        <td style={{ textAlign: 'right' }}>
                            {i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
                        <td>{i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
                        <td>{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                    </tr>)
                }
                else if (i.itemTypeId === 2) {
                    return (<tr key={index}>
                        <td>{countLabor ? countLabor : ''}</td>
                        <td>{i.itemName ? i.itemName : ''}</td>
                        <td>{i.quantity}</td>
                        <td className="unselectable">{''}</td>
                        <td>{i.lHours}</td>
                        <td>{i.lHoursExtended}</td>
                        <td>{i.lRate ? '$' + validate.numberWithCommas((i.lRate).toFixed(2)) : '$' + 0}</td>
                        <td style={{ textAlign: 'right' }}>
                            {i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
                        <td>{i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
                        <td>{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                    </tr>)
                }
                else if (i.itemTypeId === 3) {
                    return (<tr key={index}>
                        <td>{countLabor ? countLabor : ''}</td>
                        <td>{i.itemName ? i.itemName : ''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td>{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                    </tr>)
                }
                else if (i.itemTypeId === 4) {
                    return (
                        <tr key={index}>
                            <td className="unselectable-header" colSpan="9">{i.headerName}</td>
                        </tr>
                    )
                }
            }.bind(this));

        let poDetailData = this.state.poDetails;

        if (poDetailData.statusId == '1') {
            status = "Open";
        } else if (poDetailData.statusId == '2') {
            status = "Close";
        } else if (poDetailData.statusId == '3') {
            status = "In Process";
        }

        if (poDetailData.shipVia == "1") {
            shipVia = "Fed Ex";
        } else if (poDetailData.shipVia == "2") {
            shipVia = "Amazon";
        } else {
            shipVia = "-";
        }

        if (this.state.attachmentDetails.length != 0) {
            let image;
            var attachment = this
                .state
                .attachmentDetails
                .map(function (attch, index) {
                    var ext = attch.attachmentUrl
                        .split('.')
                        .pop();
                    if (ext == "pdf") {
                        image = require('../../img/pdf.jpg');
                    } else if (ext == "doc" || ext == "docx") {
                        image = require('../../img/doc.png');
                    } else if (ext == "png" || ext == "jpg" || ext == "jpeg") {
                        image = attch.attachmentUrl;
                    } else {
                        image = require('../../img/profile/avatar-default.png');
                    }
                    return <tr key={index}>
                        <td><img src={image} style={{ width: "50px", height: "30px" }} className="img-responsive" alt="Logo" /></td>
                        <td>{attch.description}</td>
                    </tr>;
                }.bind(this));
        }

        return (
            <div>
                <div className="portlet-title tabbable-line">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#po-add" data-toggle="tab">
                                Purchase Order
                                        </a>
                        </li>
                        {/* <li>
                                <a href="#po-receipts" data-toggle="tab">
                                    Receipts
                                        </a>
                            </li> */}
                        <li>
                            <a href="#po-moreinfo" data-toggle="tab">
                                More Info
                                        </a>
                        </li>
                        <div className="text-right">
                            <Link to="/po" className="btn btn-sm btn-circle red">
                                Cancel </Link>&nbsp;&nbsp;
                                        <button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
                                Delete </button>&nbsp;&nbsp;
                                    <Link to={"/po/" + this.props.params.poId + '/edit'} className="btn btn-sm btn-circle green">
                                Edit </Link>
                        </div>
                    </ul>
                </div>
                <div className="portlet light bordered" id="poList">
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="po-add">
                                <div className="portlet-title">
                                    <div className="caption">
                                        <span className="caption-subject bold uppercase">General Details</span>
                                    </div>
                                </div>
                                <form role="form">
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {poDetailData.vendor ? poDetailData.vendor : '-'}
                                                    </div>
                                                    <label htmlFor="vendor">Vendor</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {poDetailData.customerId ? poDetailData.customerId.companyName : '-'}
                                                    </div>
                                                    <label htmlFor="customer">Customer</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {poDetailData.contactId ? poDetailData.contactId.firstname + ' ' + poDetailData.contactId.lastname : '-'}
                                                    </div>
                                                    <label htmlFor="contact">Contact</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {poDetailData.projectId ? poDetailData.projectId.title : '-'}
                                                    </div>
                                                    <label htmlFor="project">Project</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {this.state.vendorAddress}
                                                    </div>
                                                    <label htmlFor="vendoradd">Vendor Address</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {this.state.shippingAddress}
                                                    </div>
                                                    <label htmlFor="shippingadd">Shipping Address</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {poDetailData ? status : '-'}
                                                    </div>
                                                    <label htmlFor="status">Status</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {poDetailData.uponReceipt ? poDetailData.uponReceipt : '-'}
                                                    </div>
                                                    <label htmlFor="upon">Upon Receipt</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {poDetailData.title ? poDetailData.title : '-'}
                                                    </div>
                                                    <label htmlFor="title">Title</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {poDetailData ? shipVia : '-'}
                                                    </div>
                                                    <label htmlFor="shipvia">Ship Via</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {poDetailData.trackingNumber
                                                            ? poDetailData.trackingNumber
                                                            : '-'}
                                                    </div>
                                                    <label htmlFor="tracking">Tracking #</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {poDetailData.shipDate
                                                            ? poDetailData.shipDate
                                                            : '-'}
                                                    </div>
                                                    <label htmlFor="shipdate">Ship Date</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static" style={{ whiteSpace: 'pre-wrap' }}>
                                                        {poDetailData.notes
                                                            ? poDetailData.notes
                                                            : '-'}
                                                    </div>
                                                    <label htmlFor="shipdate">Notes</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {poDetailData.requestedBy
                                                            ? poDetailData.requestedBy.firstname + ' ' + poDetailData.requestedBy.lastname
                                                            : '-'}
                                                    </div>
                                                    <label htmlFor="requested">Request By</label>
                                                </div>
                                            </div>
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {approvalStatus}
                                                        </div>
                                                        <label htmlFor="appstatus">Approval Status</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {poDetailData.createdAt ? poDetailData.createdAt : '-'}
                                                        </div>
                                                        <label htmlFor="created">Date Created</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {poDetailData.approvedDate ? poDetailData.approvedDate : '-'}
                                                        </div>
                                                        <label htmlFor="approval">Approval Date</label>
                                                    </div>
                                                </div> 
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {poDetailData.approvedBy ? poDetailData.approvedBy : '-'}
                                                        </div>
                                                        <label htmlFor="approved">Approval By</label>
                                                    </div>
                                                </div>*/}
                                        </div>
                                    </div>
                                </form>
                                <div className="portlet light portlet-fit portlet-datatable">
                                    <div className="portlet light bordered">
                                        <div className="portlet-title tabbable-line">
                                            <div className="caption">
                                                <i className="icon-share font-dark"></i>
                                                <span className="caption-subject font-dark bold uppercase">Line Items</span>
                                            </div>
                                            <ul className="nav nav-tabs">
                                                <li className={this.state.itemTab}>
                                                    <a href="#portlet_tab1" data-toggle="tab" onClick={this.handleLineTab.bind(this, 1)}> Items </a>
                                                </li>
                                                <li className={this.state.materialTab}>
                                                    <a href="#portlet_tab2" data-toggle="tab" onClick={this.handleLineTab.bind(this, 2)}> Material </a>
                                                </li>
                                                <li className={this.state.laborTab}>
                                                    <a href="#portlet_tab3" data-toggle="tab" onClick={this.handleLineTab.bind(this, 3)}> Labor </a>
                                                </li>
                                            </ul>
                                        </div>
                                        {this.state.itemPricedData.length ? <div className="portlet-body">
                                            <div className="tab-content">
                                                <div className={'tab-pane' + ' ' + this.state.itemTab} id="portlet_tab1">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="table-container table-responsive" style={{ overflow: "auto" }}>
                                                                <table className="table table-striped table-bordered" id="lineitem">
                                                                    <thead >
                                                                        <tr>
                                                                            <th className="items">#</th>
                                                                            <th className="items">Mfg</th>
                                                                            <th className="items">Model No</th>
                                                                            <th className="items">Part No</th>
                                                                            <th className="items">Desc</th>
                                                                            <th className="items">Qty</th>
                                                                            <th className="material" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 2)}>Material</th>
                                                                            <th className="labor" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>Labor</th>
                                                                            <th className="rowtotal">Row Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {itemTabData}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'tab-pane' + ' ' + this.state.materialTab} id="portlet_tab2">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="table-container table-responsive" style={{ overflow: "auto" }}>
                                                                <table className="table table-striped table-bordered" id="lineitem">
                                                                    <thead >
                                                                        <tr>
                                                                            <th className="items" rowSpan="2">#</th>
                                                                            <th className="items" rowSpan="2">Item</th>
                                                                            <th className="items" rowSpan="2">Qty</th>
                                                                            <th className="material" colSpan="2" >Material</th>
                                                                            <th className="labor" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>Labor</th>
                                                                            <th className="rowtotal" rowSpan="2">Row Total</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="material">Our Cost</th>
                                                                            <th className="material">Our Cost Ext</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {materialTabData}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'tab-pane' + ' ' + this.state.laborTab} id="portlet_tab3">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="table-container table-responsive" style={{ overflow: "auto" }}>
                                                                <table className="table table-striped table-bordered" id="lineitem">
                                                                    <thead >
                                                                        <tr>
                                                                            <th className="items" rowSpan="2">#</th>
                                                                            <th className="items" rowSpan="2">Item</th>
                                                                            <th className="items" rowSpan="2">Qty</th>
                                                                            <th className="material" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 2)}>Material</th>
                                                                            <th className="labor" colSpan="5">Labor</th>
                                                                            <th className="rowtotal" rowSpan="2">Row Total</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="labor">Hrs</th>
                                                                            <th className="labor">Hrs Ext</th>
                                                                            <th className="labor">Rate</th>
                                                                            <th className="labor">Unit</th>
                                                                            <th className="labor">Extended</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {laborTabData}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : null}
                                        {this.state.itemPricedData.length && this.state.attachmentDetails.length ? <div className="col-md-6">
                                            <div className="portlet light portlet-fit portlet-datatable bordered">
                                                <div className="portlet-title">
                                                    <caption className="font-dark bold uppercase">Attachments</caption>
                                                </div>
                                                <div className="portlet-body">
                                                    <div className="table-container table-responsive">
                                                        <table className="table table-striped table-bordered table-hover">
                                                            <thead >
                                                                <tr>
                                                                    <th>Attachment</th>
                                                                    <th>Description</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {attachment}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : null}
                                        {this.state.itemPricedData.length ?
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <table className="table table-striped table-bordered">
                                                        <caption className="font-dark bold uppercase">Total</caption>
                                                        <tbody>
                                                            <tr>
                                                                <th colSpan="1">Material</th>
                                                                <td style={{ textAlign: 'right' }}>
                                                                    ${mOurCostExtTotal ? validate.numberWithCommas((mOurCostExtTotal).toFixed(2)) : 0}</td>
                                                            </tr>
                                                            <tr>
                                                                <th colSpan="1">Labor</th>
                                                                <td style={{ textAlign: 'right' }}>${lExtended ? validate.numberWithCommas((lExtended).toFixed(2)) : 0}</td>
                                                            </tr>
                                                            <tr>
                                                                <th colSpan="1">Shipping</th>
                                                                <td style={{ textAlign: 'right' }}>
                                                                    ${totalShipping ? validate.numberWithCommas((totalShipping).toFixed(2)) : 0}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className="caption-subject font-dark bold uppercase" colSpan="1">Grand Total</th>
                                                                <td style={{ textAlign: 'right' }}>
                                                                    ${validate.numberWithCommas((mOurCostExtTotal + lExtended + totalShipping).toFixed(2))}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div> : null}
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="po-receipts">
                                <div className="portlet-body">
                                    <div className="tab-content">
                                        <form action="#" className="horizontal-form">
                                            <div className="form-body">
                                                <div className="row">
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {poDetailData.title ? poDetailData.title : '-'}
                                                            </div>
                                                            <label htmlFor="title">Title</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {poDetailData.poNumber ? poDetailData.poNumber : '-'}
                                                            </div>
                                                            <label htmlFor="po">PO #</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="portlet light portlet-fit portlet-datatable bordered">
                                                        <div className="portlet-title">
                                                            <label htmlFor="form_control_1">
                                                                <b>Receipt Items</b>
                                                            </label>
                                                        </div>
                                                        <div className="portlet-body">
                                                            <div className="table-container table-responsive">
                                                                <table className="table table-striped table-bordered table-hover">
                                                                    <thead >
                                                                        <tr>
                                                                            <th>Item</th>
                                                                            <th>Description</th>
                                                                            <th>Quantity</th>
                                                                            <th>Unit Price</th>
                                                                            <th>Amount</th>
                                                                            <th>Total</th>
                                                                            <th>Taxable</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {itemData}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="po-moreinfo">
                                <div className="portlet-title tabbable-line">
                                    <div className="caption">
                                        <span className="caption-subject font-dark bold uppercase">Other Details</span>
                                    </div>
                                </div>
                                <div className="portlet-body">
                                    <div className="tab-content">
                                        <form action="#" className="horizontal-form">
                                            <div className="form-body">
                                                <div className="row">
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {poDetailData.title ? poDetailData.title : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Title</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {poDetailData.createdBy ? poDetailData.createdBy : '-'}
                                                            </div>
                                                            <label htmlFor="createdby">Created By</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {poDetailData.createdAt ? moment(poDetailData.createdAt).format('LLL') : '-'}
                                                            </div>
                                                            <label htmlFor="createdon">On</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {poDetailData.poNumber ? poDetailData.poNumber : '-'}
                                                            </div>
                                                            <label htmlFor="po">PO #</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {poDetailData.modifiedBy ? poDetailData.modifiedBy : '-'}
                                                            </div>
                                                            <label htmlFor="modifiedby">Modified By</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {poDetailData.modifiedBy ? moment(poDetailData.updatedAt).format('LLL') : '-'}
                                                            </div>
                                                            <label htmlFor="modifiedon">On</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DeleteModal deleteModalId="po_delete" deleteUserHandler={this.deletePoHandler} />
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { poDetail: state.poLists.poDetails };
}

// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(poActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PODetail);