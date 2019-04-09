import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Select from 'react-select';
import jQuery from 'jquery';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as loader from '../../constants/actionTypes.js';
import * as itemActions from '../../actions/itemAction';
import * as opportunityAction from '../../actions/opportunityAction';
import * as estimateActions from '../../actions/estimateActions';
import * as poActions from '../../actions/poActions.js';
import * as proposalActions from '../../actions/proposalActions';
import * as invoiceActions from '../../actions/invoiceActions';
import * as orderActions from '../../actions/orderActions';
import * as appValid from '../../scripts/app';
import * as layout from '../../scripts/app';
import "../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

let total = 0;
let laborCost = 0;
let materialCost = 0;
let equipmentCost = 0;
let otherCost = 0;
class InvoiceEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            disabled: false,
            companyValue: '',
            companyOptions: [],
            itemDetails: [],
            items: [],
            individualValue: '',
            individualOptions: [],
            itemValue: '',
            itemOptions: [],
            unitPriceValue: '',
            salesRepOptions: [],
            salesRepValue: '',
            poValue: '',
            poOptions: [],
            invoiceDetails: '',
            projectValue: '',
            projectOptions: [],
            itemNotExists: true,
            opportunityValue: '',
            opportunityOptions: [],
            estimateOptions: [],
            estimateValue: '',
            orderOptions: [],
            orderValue: '',
            createdDate: moment().format('MM/DD/YYYY'),
            dueDate: '',
            activeTabName: 'tab1',
            addressDetails: {
                mapAddress1: '',
                mapAddress2: '',
                city: '',
                state: '',
                zip: ''
            },
        }
    }

    componentWillMount() {
        var invoiceId = {
            invoiceId: this.props.params.invoiceId
        }
        this
            .props
            .invoiceAction
            .getInvoiceDetails(invoiceId);

        var data1 = {
            parent: 'Invoices',
            childone: '',
            childtwo: ''
        };

        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
            appValid
                .FormValidationMd
                .init();
        }, 400);
    }

    setTab(tabName) {
        if (tabName) {
            this.setState({ activeTabName: tabName });
        }
    }

    handleCompanyChange(value) {
        this.setState({ companyValue: value, projectValue: '', projectOptions: [], individualValue: '', individualOptions: [] })
        var data = {
            contactId: value.id
        }
        this
            .props
            .proActions
            .getCustomerDetails(data);
    }

    handleIndividualChange(value) {
        this.setState({ individualValue: value });
    }

    onInputChangeIndividual(value) {

        if (this.state.companyValue && this.state.companyValue.id) {
            var data = {
                firstname: value,
                companyId: localStorage.companyId,
                contactId: this.state.companyValue.id
            }
            this
                .props
                .actions
                .getIndividualData(data);
        }
    }

    handlePoChange(value) {
        this.setState({ poValue: value })
    }

    handleProjectChange(value) {

        this.setState({ projectValue: value })
    }

    onProjectInputChange(value) {

        if (this.state.companyValue && this.state.companyValue.id) {
            var data = {
                title: value,
                companyId: localStorage.companyId,
                contactId: this.state.companyValue.id
            }
            this
                .props
                .proActions
                .getProjectData(data)
        }
    }

    onInputPoChange(value) {
        var companyId = {
            poNumber: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .poAction
            .getPos(companyId);
    }

    onInputChange(value) {
        var data = {
            companyName: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getCompanyList(data)
    }


    handleCreatedDateEvent(event, picker) {
        var displayDate = picker
            .startDate
            .format('MM/DD/YYYY');
        this.setState({ createdDate: displayDate });
    }

    handleDueDateEvent(event, picker) {
        var displayDate = picker
            .startDate
            .format('MM/DD/YYYY');
        this.setState({ dueDate: displayDate });
        var validator = jQuery("#createInvoice").validate();
        validator.element("#dueDate");
        jQuery('span[id^="dueDate-error"]').remove();
    }

    onItemInputChange(value) {

        var data = {
            itemName: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .proActions
            .getItemData(data)
    }

    handleItemChange(value) {

        this.setState({ itemValue: value, unitPriceValue: value.unitPrice });
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 200);
    }

    handlePopUpClose() {
        this.setState({ itemValue: '', unitPriceValue: '', itemOptions: [] })
        $('#lineitem_add').modal('hide');
    }

    removeItem(index) {
        this
            .state
            .itemDetails
            .splice(index, 1);
        this.setState({ itemDetails: this.state.itemDetails });
    }

    handleItemSubmit() {

        if (this.state.itemValue) {
            if (parseInt(ReactDOM.findDOMNode(this.refs.unitprice).value)) {
                var itemId = {
                    itemId: this.state.itemValue.id
                }
                this
                    .props
                    .itemaction
                    .getItemDetailValues(itemId);
            } else {
                toastr.error("Please enter a unit price for the item")
            }
        } else {
            toastr.error("Please select an item first");
        }
    }

    handleItemPlus(index) {
        if (index >= 0) {
            var itemstate = this.state.itemDetails;
            itemstate[index].quantity++;
            itemstate[index].amount = itemstate[index].quantity * itemstate[index].unitPrice;
            itemstate[index].total = itemstate[index].amount;
            this.setState({ itemDetails: itemstate });
        }
    }

    handleItemMinus(index) {
        if (index >= 0) {
            var itemstate = this.state.itemDetails;
            if (itemstate[index].quantity > 1) {
                itemstate[index].quantity--;
            }
            itemstate[index].amount = itemstate[index].quantity * itemstate[index].unitPrice;
            itemstate[index].total = itemstate[index].amount;
            this.setState({ itemDetails: itemstate });
        }
    }

    handleSalesRepChange(value) {
        this.setState({ salesRepValue: value })
    }

    onInputChangeSalesRep(value) {
        var data = {
            firstname: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getSalesRepData(data);
    }

    invoiceHandler() {

        if (this.state.activeTabName === 'tab1') {
            if (jQuery('#createInvoice').valid()) {

                if (this.state.itemDetails.length != 0) {
                    var items = [];
                    var invoiceData = {
                        companyId: localStorage.companyId,
                        invoiceId: this.props.params.invoiceId,
                        contactId: this.state.companyValue.id,
                        individualId: this.state.individualValue.id,
                        projectId: this.state.projectValue.id,
                        poNumber: this.state.poValue.label,
                        salesRep: this.state.salesRepValue.id,
                        title: ReactDOM
                            .findDOMNode(this.refs.title)
                            .value
                            .trim(),
                        billingAddress1: ReactDOM
                            .findDOMNode(this.refs.billingAddress1)
                            .value
                            .trim(),
                        billingAddress2: ReactDOM
                            .findDOMNode(this.refs.billingAddress2)
                            .value
                            .trim(),
                        billingState: ReactDOM
                            .findDOMNode(this.refs.billingState)
                            .value
                            .trim(),
                        billingCity: ReactDOM
                            .findDOMNode(this.refs.billingCity)
                            .value
                            .trim(),
                        billingZip: parseInt(ReactDOM
                            .findDOMNode(this.refs.billingZip)
                            .value),
                        shippingAddress1: ReactDOM
                            .findDOMNode(this.refs.shippingAddress1)
                            .value
                            .trim(),
                        shippingAddress2: ReactDOM
                            .findDOMNode(this.refs.shippingAddress2)
                            .value
                            .trim(),
                        shippingCity: ReactDOM
                            .findDOMNode(this.refs.shippingCity)
                            .value
                            .trim(),
                        shippingState: ReactDOM
                            .findDOMNode(this.refs.shippingState)
                            .value
                            .trim(),
                        shippingZip: parseInt(ReactDOM
                            .findDOMNode(this.refs.shippingZip)
                            .value),
                        createdDate: this.state.createdDate,
                        dueDate: this.state.dueDate,
                        customerMessage: parseInt(ReactDOM
                            .findDOMNode(this.refs.customerMessage)
                            .value),
                        terms: parseInt(ReactDOM.findDOMNode(this.refs.terms).value),
                        class: parseInt(ReactDOM
                            .findDOMNode(this.refs.class)
                            .value),
                        memo: ReactDOM
                            .findDOMNode(this.refs.memo)
                            .value
                            .trim(),
                        item: this.state.itemDetails,
                        total: total,
                        laborCost: laborCost,
                        equipmentCost: equipmentCost,
                        materialCost: materialCost,
                        otherCost: otherCost,
                        modifiedBy: localStorage.userName
                    }
                    $('div#create_invoice').block({
                        message: loader.GET_LOADER_IMAGE,
                        css: {
                            width: '25%'
                        },
                        overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
                    });
                    this
                        .props
                        .invoiceAction
                        .updateInvoice(invoiceData);

                } else {
                    toastr.error("Please add atleast one item to create invoice.");
                }
                return false;
            }
        } else if (this.state.activeTabName === 'tab2') {

            var invoiceData = {
                companyId: localStorage.companyId,
                invoiceId: this.props.params.invoiceId,
                opportunityId: this.state.opportunityValue ? this.state.opportunityValue.id : '',
                estimateId: this.state.estimateValue ? this.state.estimateValue.id : '',
                orderId: this.state.orderValue ? this.state.orderValue.label : '',
                modifiedBy: localStorage.userName
            }
            $('div#create_invoice').block({
                message: loader.GET_LOADER_IMAGE,
                css: {
                    width: '25%'
                },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });
            this
                .props
                .invoiceAction
                .updateInvoice(invoiceData);

        }
    }


    handleOpportunityChange(value) {
        this.setState({ opportunityValue: value });
    }

    onOpportunityInputChange(value) {

        var data = {
            title: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .proActions
            .getOpportunityList(data)
    }

    handleEstimateChange(value) {
        this.setState({ estimateValue: value })
    }

    onEstimateInputChange(value) {

        if (this.state.opportunityValue && this.state.opportunityValue.id) {
            var data = {
                estimateNumber: value,
                companyId: localStorage.companyId,
                opportunityId: this.state.opportunityValue.id
            }
            this
                .props
                .proposalactions
                .getEstimateList(data)
        }

    }

    handleOrderChange(value) {
        this.setState({ orderValue: value })
    }

    onOrderInputChange(value) {

        var companyId = {
            orderNumber: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .orderactions
            .getOrders(companyId);
    }

    componentWillReceiveProps(nextProps) {
        var company = [];
        var item = [];
        var salesReps = [];
        var individual = [];
        var poNumbers = [];
        var project = [];
        var opportunity = [];
        var estimate = [];
        var order = [];
        var addr = {
            mapAddress1: '',
            mapAddress2: '',
            city: '',
            state: '',
            zip: ''
        };

        if (nextProps.companyList.length == 0 && nextProps.salesRepList.length == 0) {
            if (nextProps.invoiceDetail) {
                var invoicestate = nextProps.invoiceDetail.InvoiceDetails;
                var itemState = JSON.parse(JSON.stringify(nextProps.invoiceDetail.InvoiceItemDetails));

                var companyObj = {
                    id: invoicestate.contactId._id,
                    label: invoicestate.contactId.companyName
                };

                var indObj = {
                    id: invoicestate.individualId._id,
                    label: invoicestate.individualId.firstname + ' ' + invoicestate.individualId.lastname
                }

                var salesRepobj = {
                    id: invoicestate.salesRep._id,
                    label: invoicestate.salesRep.firstname + ' ' + invoicestate.salesRep.lastname
                }

                var projectObj = {
                    id: invoicestate.projectId._id,
                    label: invoicestate.projectId.title
                }

                var poobj = {
                    label: invoicestate.poNumber
                }

                var oppobj = {
                    id: invoicestate.opportunityId ? invoicestate.opportunityId._id : '',
                    label: invoicestate.opportunityId ? invoicestate.opportunityId.title : ''
                }

                var estobj = {
                    id: invoicestate.estimateId ? invoicestate.estimateId._id : '',
                    label: invoicestate.estimateId ? invoicestate.estimateId.estimateNumber : ''
                }

                var ordobj = {
                    label: invoicestate.orderId ? invoicestate.orderId : ''
                }

                var addr = {
                    mapAddress1: invoicestate.billingAddress1,
                    mapAddress2: invoicestate.billingAddress2,
                    city: invoicestate.billingCity,
                    state: invoicestate.billingState,
                    zip: invoicestate.billingZip
                }

                this.setState({
                    invoiceDetails: invoicestate,
                    companyValue: companyObj,
                    salesRepValue: salesRepobj,
                    poValue: poobj,
                    individualValue: indObj,
                    addressDetails: addr,
                    projectValue: projectObj,
                    opportunityValue: invoicestate.opportunityId ? oppobj : '',
                    estimateValue: invoicestate.estimateId ? estobj : '',
                    orderValue: invoicestate.orderId ? ordobj : '',
                    createdDate: invoicestate.createdDate,
                    dueDate: invoicestate.dueDate

                });
                if (this.state.itemNotExists) {
                    this.setState({
                        itemDetails: itemState,
                        itemNotExists: false
                    })
                }
            }
        }

        var companyList = nextProps
            .companyList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.companyName
                }
                company.push(obj)
            }.bind(this));

        var individualList = nextProps
            .individualList
            .map(function (ind, index) {
                var obj = {
                    id: ind._id,
                    label: ind.firstname + ' ' + ind.lastname
                }
                individual.push(obj)
            }.bind(this));

        var salesRep = nextProps
            .salesRepList
            .map(function (salesRep, index) {
                var obj = {
                    id: salesRep._id,
                    label: salesRep.firstname + ' ' + salesRep.lastname
                }
                salesReps.push(obj)
            }.bind(this));

        var poList = nextProps
            .podata
            .map(function (po, index) {
                var obj = {
                    // id: po._id,
                    label: po.poNumber
                }
                poNumbers.push(obj)
            }.bind(this));

        var projectList = nextProps
            .projectList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.title
                }
                project.push(obj)
            }.bind(this));

        var opportunityList = nextProps
            .opportunityList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.title,
                }
                opportunity.push(obj)
            }.bind(this));

        var estimateList = nextProps
            .estimateList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.estimateNumber,
                    opportunityId: list.opportunityId,
                    title: list.title,
                }
                estimate.push(obj)
            }.bind(this));

        var orderList = nextProps
            .orderdata
            .map(function (list, index) {
                var obj = {
                    // id: list._id,
                    label: list.orderNumber,
                }
                order.push(obj)
            }.bind(this));

        if (nextProps.itemList.length != 0) {
            var itemList = nextProps
                .itemList
                .map(function (list, index) {
                    var obj = {
                        id: list._id,
                        label: list.itemName,
                        unitPrice: list.listPrice
                    }
                    item.push(obj)
                }.bind(this));
        }

        if (nextProps.itemDetail) {

            var itemState = JSON.parse(JSON.stringify(nextProps.itemDetail));
            var index = this
                .state
                .itemDetails
                .map((o) => o.itemName)
                .indexOf(itemState.itemName);
            if (index < 0) {
                itemState.amount = parseInt(ReactDOM.findDOMNode(this.refs.unitprice).value);
                itemState.quantity = 1;
                itemState.unitPrice = parseInt(ReactDOM.findDOMNode(this.refs.unitprice).value);
                itemState.itemType = itemState.itemTypeId ? itemState.itemTypeId.itemType : '';
                itemState.total = itemState.amount;
                this
                    .state
                    .itemDetails
                    .push(itemState);
                $('#lineitem_add').modal('hide');
                this.setState({ itemValue: '' })
            } else {
                toastr.error("This item is already added to invoice.");
            }
        }

        if (nextProps.contactDetails) {

            var contactDetailState = JSON.parse(JSON.stringify(nextProps.contactDetails));
            var res = contactDetailState
                .addressInfo
                .find(function (d) {
                    return d.isPrimary == true;
                });
            if (res) {
                addr = {
                    mapAddress1: res.mapAddress1,
                    mapAddress2: res.mapAddress2,
                    city: res.city,
                    state: res.state,
                    zip: res.zip
                };
            }

            this.setState({ addressDetails: addr });

        }

        this.setState({
            companyOptions: company, itemOptions: item,
            projectOptions: project, salesRepOptions: salesReps,
            poOptions: poNumbers, opportunityOptions: opportunity, estimateOptions: estimate,
            orderOptions: order, individualOptions: individual
        })
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
    }
    render() {
        var invoiceDetailData = this.state.invoiceDetails;
        total = 0;
        laborCost = 0;
        materialCost = 0;
        equipmentCost = 0;
        otherCost = 0;
        var totalItemPrice = this
            .state
            .itemDetails
            .map(function (item, index) {
                total += item.total;
                if (item.itemType) {
                    if (item.itemType == "Labor") {
                        laborCost += item.amount;
                    } else if (item.itemType == "Material") {
                        materialCost += item.amount;
                    } else if (item.itemType == "Equipment") {
                        equipmentCost += item.amount;
                    } else if (item.itemType == "Other") {
                        otherCost += item.amount;
                    }
                }
            })

        var itemData = this
            .state
            .itemDetails
            .map(function (item, index) {
                return <tr key={index}>
                    <td>{item.itemName}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}
                        &nbsp;&nbsp;&nbsp;<i
                            className="icon-minus"
                            onClick={this
                                .handleItemMinus
                                .bind(this, index)}></i>&nbsp;&nbsp;&nbsp;<i
                                    className="icon-plus"
                                    onClick={this
                                        .handleItemPlus
                                        .bind(this, index)}></i>
                    </td>
                    <td>{"$" + item.unitPrice}</td>
                    <td>{item.amount
                        ? "$" + item.amount
                        : "-"}</td>
                    <td>{"$" + item.total}</td>
                    <td><input
                        type="button"
                        className="btn btn-primary"
                        value="Remove"
                        onClick={this
                            .removeItem
                            .bind(this, index)} /></td>
                </tr>;
            }.bind(this));
        return (
            <div>
                <div className="portlet-title tabbable-line">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#invoice-add" data-toggle="tab" onClick={this.setTab.bind(this, 'tab1')}>
                                Invoice
                            </a>
                        </li>
                        <li>
                            <a href="#invoice-payments" data-toggle="tab" onClick={this.setTab.bind(this, 'none')}>
                                Payments
                            </a>
                        </li>
                        <li>
                            <a href="#invoice-moreinfo" data-toggle="tab" onClick={this.setTab.bind(this, 'tab2')}>
                                More Info
                            </a>
                        </li>
                        <div className="form-actions noborder text-right">
                            <Link to={"/invoice/" + this.props.params.invoiceId} className="btn red">
                                Cancel
                            </Link>&nbsp;&nbsp;
                            {this.state.activeTabName == "none" ? "" : <button type="button" className="btn blue" onClick={this.invoiceHandler}>Save</button>}
                        </div>
                    </ul>
                </div>
                <div className="portlet light bordered" id="create_invoice">
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="invoice-add">
                                <div className="portlet-title">
                                    <div className="caption">
                                        <span className="caption-subject bold uppercase">General Details</span>
                                    </div>
                                </div>
                                <form role="form" id="createInvoice">
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="customer">Customer<span className="required">*</span>
                                                    </label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.companyValue}
                                                        placeholder="Customer"
                                                        name=""
                                                        options={this.state.companyOptions}
                                                        onFocus={this.clearIndividual}
                                                        onChange={this.handleCompanyChange}
                                                        onInputChange={this.onInputChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input type="text" className="form-control" ref="title" name="title" key={invoiceDetailData ? invoiceDetailData.title : '-'} defaultValue={invoiceDetailData ? invoiceDetailData.title : ''} />
                                                    <label htmlFor="title">Title<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <label htmlFor="Contact">Contact<span className="required">*</span></label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.individualValue}
                                                        placeholder="Contact"
                                                        name=""
                                                        options={this.state.individualOptions}
                                                        onChange={this.handleIndividualChange}
                                                        onInputChange={this.onInputChangeIndividual} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <label htmlFor="project">Project<span className="required">*</span>
                                                    </label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.projectValue}
                                                        placeholder="Project"
                                                        name=""
                                                        id="project"
                                                        options={this.state.projectOptions}
                                                        onChange={this.handleProjectChange}
                                                        onInputChange={this.onProjectInputChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">

                                                    <label htmlFor="sales_rep">Sales Rep<span className="required">*</span></label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.salesRepValue}
                                                        placeholder="Sales Rep"
                                                        name=""
                                                        options={this.state.salesRepOptions}
                                                        onChange={this.handleSalesRepChange}
                                                        onInputChange={this.onInputChangeSalesRep} />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="portlet-title">
                                                    <div className="caption">
                                                        <span className="caption-subject bold uppercase">Billing Address</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        className="form-control"
                                                        rows="1"
                                                        ref="billingAddress1"
                                                        name="billingAddress1"
                                                        defaultValue={this.state.addressDetails.mapAddress1}
                                                        key={this.state.addressDetails.mapAddress1}></textarea>
                                                    <label htmlFor="billingAddress1">Address 1<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        className="form-control"
                                                        rows="1"
                                                        ref="billingAddress2"
                                                        name="billingAddress2"
                                                        defaultValue={this.state.addressDetails.mapAddress2}
                                                        key={this.state.addressDetails.mapAddress2}></textarea>
                                                    <label htmlFor="billingAddress2">Address 2
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        className="form-control"
                                                        rows="1"
                                                        ref="billingCity"
                                                        name="billingCity"
                                                        defaultValue={this.state.addressDetails.city}
                                                        key={this.state.addressDetails.city}></textarea>
                                                    <label htmlFor="billingCity">City<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        className="form-control"
                                                        rows="1"
                                                        ref="billingState"
                                                        name="billingState"
                                                        defaultValue={this.state.addressDetails.state}
                                                        key={this.state.addressDetails.state}></textarea>
                                                    <label htmlFor="billingState">State<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        className="form-control"
                                                        rows="1"
                                                        ref="billingZip"
                                                        name="billingZip"
                                                        defaultValue={this.state.addressDetails.zip}
                                                        key={this.state.addressDetails.zip}></textarea>
                                                    <label htmlFor="billingZip">Zip<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="portlet-title">
                                                    <div className="caption">
                                                        <span className="caption-subject bold uppercase">Shipping Address</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        className="form-control"
                                                        rows="1"
                                                        ref="shippingAddress1"
                                                        name="shippingAddress1"
                                                        defaultValue={invoiceDetailData ? invoiceDetailData.shippingAddress1 : ''}
                                                        key={invoiceDetailData ? invoiceDetailData.shippingAddress1 : ''}></textarea>
                                                    <label htmlFor="shippingAddress1">Address 1<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        className="form-control"
                                                        rows="1"
                                                        ref="shippingAddress2"
                                                        name="shippingAddress2"
                                                        defaultValue={invoiceDetailData ? invoiceDetailData.shippingAddress2 : ''}
                                                        key={invoiceDetailData ? invoiceDetailData.shippingAddress2 : ''}></textarea>
                                                    <label htmlFor="shippingAddress2">Address 2
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        className="form-control"
                                                        rows="1"
                                                        ref="shippingCity"
                                                        name="shippingCity"
                                                        defaultValue={invoiceDetailData ? invoiceDetailData.shippingCity : ''}
                                                        key={invoiceDetailData ? invoiceDetailData.shippingCity : ''}></textarea>
                                                    <label htmlFor="shippingCity">City<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        className="form-control"
                                                        rows="1"
                                                        ref="shippingState"
                                                        name="shippingState"
                                                        defaultValue={invoiceDetailData ? invoiceDetailData.shippingState : ''}
                                                        key={invoiceDetailData ? invoiceDetailData.shippingState : ''}></textarea>
                                                    <label htmlFor="shippingState">State<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        className="form-control"
                                                        rows="1"
                                                        ref="shippingZip"
                                                        name="shippingZip"
                                                        defaultValue={invoiceDetailData ? invoiceDetailData.shippingZip : ''}
                                                        key={invoiceDetailData ? invoiceDetailData.shippingZip : ''}></textarea>
                                                    <label htmlFor="shippingZip">Zip<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="dateCreated">Date
                                                    </label>
                                                    <div className="input-group date form_datetime">
                                                        <input
                                                            type="text"
                                                            className="selected-date-range-btn"
                                                            size="16"
                                                            disabled={true}
                                                            className="form-control"
                                                            defaultValue={this.state.createdDate}
                                                            key={this.state.createdDate}
                                                            name="createDate" />
                                                        <span className="input-group-btn">
                                                            <button className="btn default date-set" type="button" disabled={true}>
                                                                <i className="fa fa-calendar" disabled={true}></i>
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="dueDate">Due Date<span className="required">*</span>
                                                    </label>
                                                    <DateRangePicker
                                                        showDropdowns={true}
                                                        singleDatePicker
                                                        minDate={moment()}
                                                        onApply={this.handleDueDateEvent}>
                                                        <div className="input-group date form_datetime">
                                                            <input
                                                                type="text"
                                                                className="selected-date-range-btn"
                                                                size="16"
                                                                readOnly={true}
                                                                className="form-control"
                                                                defaultValue={this.state.dueDate}
                                                                key={this.state.dueDate}
                                                                id="dueDate"
                                                                name="dueDate" />
                                                            <span className="input-group-btn">
                                                                <button className="btn default date-set calendar-shadow-none" type="button">
                                                                    <i className="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </DateRangePicker>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" name="terms" key={invoiceDetailData ? invoiceDetailData.terms : ''} defaultValue={invoiceDetailData ? invoiceDetailData.terms : ''} ref="terms">
                                                        <option value="0">Select</option>
                                                        <option value="1">Net 30</option>
                                                        <option value="2">New 60</option>
                                                        <option value="3">Net 90</option>
                                                    </select>
                                                    <label htmlFor="form_control_1">Terms<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" name="class" key={invoiceDetailData ? invoiceDetailData.class : ''} defaultValue={invoiceDetailData ? invoiceDetailData.class : ''} ref="class">
                                                        <option value="0">Select</option>
                                                        <option value="1">Maintenance</option>
                                                    </select>
                                                    <label htmlFor="form_control_1">Class<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="customer">PO #<span className="required">*</span>
                                                    </label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.poValue}
                                                        placeholder="PO #"
                                                        name=""
                                                        options={this.state.poOptions}
                                                        onChange={this.handlePoChange}
                                                        onInputChange={this.onInputPoChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                    <div className="portlet-title">
                                        <a
                                            href="#lineitem_add"
                                            data-toggle="modal"
                                            className="btn btn-sm btn-circle green">
                                            <i className="icon-plus"></i>
                                            New Line Item
                                        </a>
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
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {itemData}
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="col-md-12">
                                            <div className="form-group form-md-line-input form-md-floating-label">
                                                <select className="form-control edited" name="customerMessage" key={invoiceDetailData ? invoiceDetailData.customerMessage : ''} defaultValue={invoiceDetailData ? invoiceDetailData.customerMessage : ''} ref="customerMessage">
                                                    <option value="0">Select</option>
                                                    <option value="1">Thank you for your payment.</option>
                                                    <option value="2">Please submit payment.</option>
                                                </select>
                                                <label htmlFor="form_control_1">Customer Message</label>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group form-md-line-input form-md-floating-label">
                                                <textarea type="text" className="form-control" rows="1" ref="memo" key={invoiceDetailData ? invoiceDetailData.memo : '-'} defaultValue={invoiceDetailData ? invoiceDetailData.memo : ''} ></textarea>
                                                <label htmlFor="form_control_1">Memo</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {"$" + laborCost}
                                                    </div>
                                                    <label htmlFor="form_control_1">Labor</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {"$" + otherCost}
                                                    </div>
                                                    <label htmlFor="form_control_1">Other</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {"$" + materialCost}
                                                    </div>
                                                    <label htmlFor="form_control_1">Material</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {"$" + equipmentCost}
                                                    </div>
                                                    <label htmlFor="form_control_1">Equipment</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {"$" + total}
                                                    </div>
                                                    <label htmlFor="total">Total</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="invoice-payments">
                                <div className="portlet-body">
                                    <div className="tab-content">
                                        <form action="#" className="horizontal-form">
                                            <div className="form-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {invoiceDetailData ? invoiceDetailData.title : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Title</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {invoiceDetailData ? invoiceDetailData.invoiceNumber : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Inv #</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                                    <div className="portlet-title">
                                                        <label htmlFor="form_control_1">
                                                            <b>Payments</b>
                                                        </label>
                                                    </div>
                                                    <div className="portlet-body">
                                                        <div className="table-container table-responsive">
                                                            <table className="table table-striped table-bordered table-hover">
                                                                <thead >
                                                                    <tr>
                                                                        <th>Date</th>
                                                                        <th>Payment Type</th>
                                                                        <th>Amt Received</th>
                                                                        <th>Memo</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>04/25/2017</td>
                                                                        <td>Cash</td>
                                                                        <td>$ 100</td>
                                                                        <td>-</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="invoice-moreinfo">
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
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {invoiceDetailData ? invoiceDetailData.title : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Title</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {invoiceDetailData ? invoiceDetailData.createdBy : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Created By</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {invoiceDetailData ? moment(invoiceDetailData.createdAt).format('LLL') : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">On</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {invoiceDetailData && invoiceDetailData.invoiceNumber ? invoiceDetailData.invoiceNumber : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Inv #</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {invoiceDetailData && invoiceDetailData.modifiedBy ? invoiceDetailData.modifiedBy : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Modified By</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {invoiceDetailData && invoiceDetailData.modifiedBy ? moment(invoiceDetailData.updatedAt).format('LLL') : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">On</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <label htmlFor="opportunity">Opportunity
                                                            </label>
                                                            <Select
                                                                disabled={this.state.disabled}
                                                                value={this.state.opportunityValue}
                                                                key={this.state.opportunityValue}
                                                                placeholder="Opportunity"
                                                                name=""
                                                                id="opportunity"
                                                                options={this.state.opportunityOptions}
                                                                onChange={this.handleOpportunityChange}
                                                                onInputChange={this.onOpportunityInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <label htmlFor="Estimate">Estimate</label>
                                                            <Select
                                                                disabled={this.state.disabled}
                                                                value={this.state.estimateValue}
                                                                placeholder="Estimate"
                                                                name=""
                                                                id="estimate"
                                                                options={this.state.estimateOptions}
                                                                onChange={this.handleEstimateChange}
                                                                onInputChange={this.onEstimateInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <label htmlFor="Order">Order</label>
                                                            <Select
                                                                disabled={this.state.disabled}
                                                                value={this.state.orderValue}
                                                                placeholder="Order"
                                                                name=""
                                                                id="Order"
                                                                options={this.state.orderOptions}
                                                                onChange={this.handleOrderChange}
                                                                onInputChange={this.onOrderInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div id="lineitem_add" className="modal fade" tabIndex="-1" aria-hidden="true">
                                <div className="modal-dialog ">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="caption">
                                                <span className="caption-subject bold uppercase">New Line Item</span>
                                            </div>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        {/*<label htmlFor="individual">Item<span className="required">*</span></label>*/}
                                                        <Select
                                                            disabled={this.state.disabled}
                                                            value={this.state.itemValue}
                                                            placeholder="Select Item"
                                                            name="item"
                                                            id="item"
                                                            options={this.state.itemOptions}
                                                            onChange={this.handleItemChange}
                                                            onInputChange={this.onItemInputChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="unitprice"
                                                            name="unitprice"
                                                            ref="unitprice"
                                                            defaultValue={this.state.unitPriceValue}
                                                            key={this.state.unitPriceValue} />
                                                        <label htmlFor="proposal">Unit Price</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn dark btn-outline"
                                                onClick={this.handlePopUpClose}>Close</button>
                                            <button
                                                type="button"
                                                className="btn green"
                                                id="send-invite-button"
                                                onClick={this.handleItemSubmit}>Done</button>
                                        </div>
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
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return {
        companyList: state.opportunity.companyList,
        projectList: state.estimate.projectList,
        itemList: state.estimate.itemList,
        itemDetail: state.itemCreation.itemDetailData,
        salesRepList: state.opportunity.salesRepList,
        podata: state.poLists.poList,
        invoiceDetail: state.invoices.invoiceDetails,
        opportunityList: state.estimate.opportunityList,
        estimateList: state.proposal.estimateList,
        orderdata: state.serviceOrder.orderList,
        contactDetails: state.estimate.contactDetails,
        individualList: state.opportunity.individualList,
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(opportunityAction, dispatch),
        proActions: bindActionCreators(estimateActions, dispatch),
        poAction: bindActionCreators(poActions, dispatch),
        itemaction: bindActionCreators(itemActions, dispatch),
        invoiceAction: bindActionCreators(invoiceActions, dispatch),
        proposalactions: bindActionCreators(proposalActions, dispatch),
        orderactions: bindActionCreators(orderActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(InvoiceEdit);