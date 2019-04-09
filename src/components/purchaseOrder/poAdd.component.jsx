import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Select from 'react-select';
import jQuery from 'jquery';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import _ from 'lodash';
import TextareaAutosize from 'react-autosize-textarea';
import { RIEInput, RIETextArea, RIENumber, RIESelect } from 'riek';
import * as types from '../../constants/actionTypes';
import * as loader from '../../constants/actionTypes.js';
import * as itemActions from '../../actions/itemAction';
import * as opportunityAction from '../../actions/opportunityAction';
import * as estimateActions from '../../actions/estimateActions';
import * as poActions from '../../actions/poActions.js';
import * as createContactAction from '../../actions/createContactAction';
import * as appValid from '../../scripts/app';
import * as layout from '../../scripts/app';
import DeleteModal from '../common/deleteModal.component';
import AddItemModal from '../common/addItemModal.component';
import ConfirmationModal from '../common/confirmationModal.component';
import AddMaterial from '../common/materialAddModal';
import SelectSupplierModal from '../common/supplierSelectModal';
import AddShipping from '../common/shippingAddModal';
import AddHeader from '../common/headerAddModal';
import AddLabor from '../common/laborAddModal';
import SingleInput from '../shared/SingleInput';
import * as functions from '../common/functions';
import * as validate from '../common/validator';
import "../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class POAdd extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            shipDate: '',
            approvalDate: '',
            disabled: false,
            companyValue: '',
            individualValue: '',
            projectValue: '',
            requestByValue: '',
            companyOptions: [],
            individualOptions: [],
            projectOptions: [],
            requestByOptions: [],
            itemDetails: [],
            supplierData: [],
            manufacturerList: [],
            itemValue: '',
            itemOptions: [],
            supplierData: [],
            itemPricedData: [],
            newItemAdded: '',
            newAddedSupplier: '',
            newItemAddFlag: false,
            itemTab: 'active',
            materialTab: '',
            laborTab: '',
            laborRatesData: [],
            itemDeleteIndex: '',
            modalName: '',
            query: '',
            poNumber:''
        }
    }

    componentWillMount() {
        let data = {
            parent: 'Purchase Orders',
            childone: '',
            childtwo: ''
        };
        let data1 = {
            companyId: localStorage.companyId
        }
        this.props.breadCrumb(data);
        let companyId = {
            companyId: localStorage.companyId
        }
        this.props.poAction.getPurchaseOrderNo(companyId)
        this.handleSearchDebounced = _.debounce(function () {
            if (this.state.query) {
                this.props.proActions.getItemData(this.state.query, types.GET_PO_ITEM);
            }
        }, 350);
    

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

        if (localStorage.contactPoId) {

            let contact = {
                contactId: localStorage.contactPoId
            }
            this
                .props
                .contactactions
                .getContact(contact);
        }

        let self = this;
        let pageId = document.getElementById("create_po");
        if (pageId) {
            pageId.addEventListener('keydown', function (event) {
                const key = event.key;
                if (key === "Escape") {
                    if (self.state.modalName) {
                        $(self.state.modalName).modal('hide');
                    }
                } else if (key === "Enter") {
                    // event.preventDefault()
                    if (self.state.modalName == "#subheader_add") {
                        self.handleHeaderAdd();
                    } else if (self.state.modalName == "#shipping_add") {
                        self.handleShippingAdd();
                    } else if (self.state.modalName == "#labor_add") {
                        self.handleLaborAdd();
                    }
                }
            });
        }
        $('body').on("hidden.bs.modal", function () {
            self.state.modalName = "";
        });
    }

    componentWillReceiveProps(nextProps) {
        
        let company = [];
        let individual = [];
        let project = [];
        let requestby = [];
        let item = [];

        if (localStorage.contactPoId && company.length == 0 && individual.length == 0) {
            let companyVal = {
                id: nextProps.createcontact.companyContactId,
                label: nextProps.createcontact.companyName
            }
            let individualVal = {
                id: nextProps.createcontact._id,
                label: nextProps.createcontact.firstname + ' ' + nextProps.createcontact.lastname
            }

            this.setState({ companyValue: companyVal, individualValue: individualVal })
        }

        let companyList = nextProps
            .companyList
            .map(function (list, index) {
                let obj = {
                    id: list._id,
                    label: list.companyName
                }
                company.push(obj)
            }.bind(this));

        let individualList = nextProps
            .individualList
            .map(function (ind, index) {
                let obj = {
                    id: ind._id,
                    label: ind.firstname + ' ' + ind.lastname
                }
                individual.push(obj)
            }.bind(this));

        let projectList = nextProps
            .projectList
            .map(function (list, index) {
                let obj = {
                    id: list._id,
                    label: list.title
                }
                project.push(obj)
            }.bind(this));

        let reqestbyList = nextProps
            .requestByList
            .map(function (list, index) {
                let obj = {
                    id: list._id,
                    label: list.firstname + ' ' + list.lastname
                }
                requestby.push(obj)
            }.bind(this));

        if (nextProps.itemList.length != 0) {
            let itemList = nextProps
                .itemList
                .map(function (list, index) {
                    let obj = {
                        id: list._id,
                        label: list.itemName,
                        unitPrice: list.listPrice
                    }
                    item.push(obj)
                }.bind(this));
        }

        if (this.state.newItemAddFlag && nextProps.newCreatedItem) {
            let newItemAdded = {
                itemName: nextProps.newCreatedItem.itemName,
                modal: nextProps.newCreatedItem.modal,
                partNumber: nextProps.newCreatedItem.partNumber,
                manufacturer: nextProps.newCreatedItem.manufacturer,
                labourHour: 0,
                _id: nextProps.newCreatedItem._id
            }

            let newAddedSupplier = {
                itemId: nextProps.newCreatedItem._id,
                dealerPrice: this.state.newAddedSupplier ? this.state.newAddedSupplier[0].dealerPrice : 0
            }

            this.state.newItemAddFlag = false;
            this.state.newItemAdded = newItemAdded;
            this.handleLineItemAdd('', newAddedSupplier)
        }

        this.setState({
            companyOptions: company,
            individualOptions: individual,
            projectOptions: project,
            requestByOptions: requestby,
            itemOptions: this.state.query ? nextProps.itemList : [],
            manufacturerList: nextProps.ManufacturerList,
        })
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
        if (nextProps.poNumber) {
          
            this.setState({ poNumber: nextProps.poNumber })
        }
    }

    componentWillUnmount() {
        localStorage.setItem("contactPoId", '');
    }

    componentWillUpdate(nextProps, nextState) {
        let self = this;
        let sortId = this.refs.sortable;
        let droppedIndex = 0;
        if (self.state.itemTab == "active") {
            sortId = this.refs.sortable;
        } else if (self.state.materialTab == "active") {
            sortId = this.refs.sortable1;
        } else if (self.state.laborTab == "active") {
            sortId = this.refs.sortable2;
        }
        $(sortId).sortable({
            update: function (event, ui) {
                let reorderArray = [];
                let idsInOrder = $(sortId).sortable('toArray', { attribute: 'data-id' });
                idsInOrder.map(function (i) {
                    reorderArray.push(nextState.itemPricedData[i])
                });
                reorderArray.forEach(function (val, index) {
                    breakme: if (index > droppedIndex) {
                        if (!val.headerName) {
                            val.header = reorderArray[droppedIndex].headerName
                        }
                        else if (val.headerName) {
                            droppedIndex = 0;
                            break breakme;
                        }
                    }
                })
                self.setState({ itemPricedData: reorderArray })
                $(sortId).sortable("cancel");
            },
            change: function (event, ui) {
                let currentIndex = ui.placeholder.index();
                if (currentIndex > -1) {
                    droppedIndex = currentIndex;
                }
            }
        }).disableSelection();
    }

    handleCompanyChange(value) {
        this.setState({ companyValue: value, individualValue: '', individualOptions: [] })
    }

    handleIndividualChange(value) {
        this.setState({ individualValue: value });
    }

    handleProjectChange(value) {
        this.setState({ projectValue: value })
    }

    handleRequestByChange(value) {
        this.setState({ requestByValue: value })
    }

    onProjectInputChange(value) {
        let contactId = this.state.companyValue ? this.state.companyValue.id : '';
        if (contactId) {
            let data = {
                title: value,
                companyId: localStorage.companyId,
                contactId: contactId
            }
            this
                .props
                .proActions
                .getProjectData(data)
        }
    }

    onInputChangeIndividual(value) {
        if (this.state.companyValue && this.state.companyValue.id) {
            let data = {
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

    onInputChange(value) {
        let data = {
            companyName: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getCompanyList(data)
    }

    onRequestByInputChange(value) {
        let data = {
            firstname: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .poAction
            .getRequestBy(data);
    }

    handleShipDateEvent(event, picker) {
        let displayDate = picker
            .startDate
            .format('MM/DD/YYYY');
        this.setState({ shipDate: displayDate });
    }

    handleApprovalDateEvent(event, picker) {
        let displayDate = picker
            .startDate
            .format('MM/DD/YYYY');
        this.setState({ approvalDate: displayDate });
    }

    onItemInputChange(e) {
        let currentValue = e.target.value.trim();
        if (currentValue) {
            let data = {
                itemName: currentValue,
                companyId: localStorage.companyId
            }
            this.setState({ query: data });
            this.handleSearchDebounced();
        }
        else {
            this.setState({ itemOptions: [], query: '' })
        }
    }

    handlePopUpClose(type) {
        // debugger
        if (type === "item") {
            let e1 = this.refs.lineitem_add.refs.lineitem_add;
            this.setState({
                itemValue: '',
                itemOptions: []
            });
            $(e1).modal('hide');
        }
        else if (type === "supplier") {
            let e1 = this.refs.supplier_add.refs.supplier_add;
            $(e1).modal('hide');
        }
        else if (type === "newItem") {
            ReactDOM.findDOMNode(this.refs.itemPo.refs.item_manufacturer).value = '';
            this.setState({
                manufacturerValue: '',
                manufacturerList: []
            });
            $('#add_item').modal('hide');
        }
    }

    handleItemSubmit(index) {

        let currentdata = this.state.itemOptions[index];
        if (currentdata.suppliersInfo.length === 1) {
            let data = currentdata.suppliersInfo[0]
            this.handleLineItemAdd(index, data);
        }
        else if (currentdata.suppliersInfo) {
            let e1 = this.refs.supplier_add.refs.supplier_add;
            this.setState({ supplierData: currentdata.suppliersInfo });
            $(e1).modal({ backdrop: 'static', keyboard: false });
        }
    }

    handleLineItemAdd(index, currentSupplierData) {

        let currentSupplier = '';
        let currentSelectedItem = '';
        if (currentSupplierData === '') {
            currentSupplier = this.state.supplierData[index];
        }
        else {
            currentSupplier = currentSupplierData;
        }

        if (index !== '') {
            currentSelectedItem = this.state.itemOptions.find(o => o._id === currentSupplier.itemId);
        } else {
            currentSelectedItem = this.state.newItemAdded;
        }
        //Calculations for line items
        let itemMfg = currentSelectedItem.manufacturer;
        let partNo = currentSelectedItem.partNumber;
        let modal = currentSelectedItem.modal;
        let itemName = currentSelectedItem.itemName;
        let quantity = 1;

        let mOurCost = currentSupplier.dealerPrice ? parseInt(currentSupplier.dealerPrice) : 0;
        let mOurCostExtended = mOurCost * quantity;

        let lHours = currentSelectedItem.labourHour ? parseInt(currentSelectedItem.labourHour) : 0;
        let lHoursExtended = lHours * quantity;
        let lRate = 0;
        let lExtended = lHoursExtended * lRate;

        let pricedData = {
            itemId: currentSelectedItem._id,
            itemMfg: itemMfg,
            partNo: partNo,
            modelNo: modal,
            itemName: itemName,
            quantity: quantity,
            mOurCost: mOurCost,
            mOurCostExtended: mOurCostExtended,
            lHours: lHours,
            lExtended: lExtended,
            lHoursExtended: lHoursExtended,
            lRate: lRate,
            rowTotal: mOurCostExtended + lExtended,
            header: '',
            itemTypeId: 1,
            unit: lHours * lRate
        }

        let currentItemState = this.state.itemPricedData;
        currentItemState.push(pricedData);
        this.setState({
            itemPricedData: currentItemState,
            itemOptions: []
        });
        let e1 = this.refs.lineitem_add.refs.lineitem_add;
        let e2 = this.refs.supplier_add.refs.supplier_add;
        $(e1).modal('hide');
        $(e2).modal('hide');

    }

    handleLaborAdd(e) {

        toastr.remove();
        let itemDesc = ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_description).value;
        let quantity = ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_quantity).value;
        if (!itemDesc.trim()) {
            toastr.error("Please enter description.");
        } else if (!quantity || !(parseInt(quantity) > 0)) {
            toastr.error("Please enter valid quantity.");
        } else {
            let pricedData = {
                itemMfg: '',
                partNo: '',
                modelNo: '',
                itemName: ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_description).value,
                quantity: ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_quantity).value ? parseInt(ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_quantity).value) : 1,
                mOurCost: 0,
                mOurCostExtended: 0,
                laborTypeName: this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].laborType : '',
                lType: this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0]._id : '',
                lHours: 0,
                lExtended: 0,
                lHoursExtended: 0,
                lRate: this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].rate : '',
                rowTotal: 0,
                header: '',
                unit: 0,
                itemTypeId: 2
            }
            let currentItemState = this.state.itemPricedData;
            currentItemState.push(pricedData);
            this.setState({
                itemPricedData: currentItemState,
                itemTab: '',
                materialTab: '',
                laborTab: 'active'
            });
            let e1 = this.refs.labr_desc.refs.labor_add;
            $(e1).modal('hide');
        }
    }

    handleHeaderAdd(e) {

        toastr.remove();
        let subheader = ReactDOM.findDOMNode(this.refs.head_txt.refs.subheader).value;
        if (subheader.trim() !== '') {
            let currentItem = {
                header: '',
                headerName: subheader,
                itemTypeId: 4
            }
            let currentState = this.state.itemPricedData;
            currentState.push(currentItem);
            this.setState({ itemPricedData: currentState });
            $('#subheader_add').modal('hide');
        }
        else {
            toastr.error('Please enter a valid sub-header.')
        }
    }

    handleShippingAdd(e) {

        toastr.remove();
        let itemDesc = ReactDOM.findDOMNode(this.refs.ship_desc.refs.description).value;
        let amount = ReactDOM.findDOMNode(this.refs.ship_desc.refs.amount).value;
        if (!amount || !(parseInt(amount) > 0)) {
            toastr.error("Please enter valid amount.");
        } else {
            let itemData = {
                itemTypeId: 3,
                header: '',
                rowTotal: ReactDOM.findDOMNode(this.refs.ship_desc.refs.amount).value ? parseInt(ReactDOM.findDOMNode(this.refs.ship_desc.refs.amount).value) : 0,
                itemName: ReactDOM.findDOMNode(this.refs.ship_desc.refs.description).value
            }
            let currentState = this.state.itemPricedData;
            currentState.push(itemData);
            this.setState({ itemPricedData: currentState });
            $('#shipping_add').modal('hide');
        }
    }

    createItemHandler() {
        // $('#confirm_id').modal('show');
        $('#add_item').modal('show');
    }

    confirmationHandler() {
        $('#confirm_id').modal('hide');
        $('#add_item').modal('show');
    }

    getManufacturerList(e) {
        if (e.target.value && e.target.value.trim()) {
            this.setState({ manufacturerValue: e.target.value });
            let val = {
                companyId: localStorage.companyId,
                manufacturer: e.target.value.trim()
            }
            this.props.proActions.getManufacturerList(val);
        } else {
            this.setState({ manufacturerList: [], manufacturerValue: '' });
        }
    }

    selectManufacturer(val) {
        this.setState({ manufacturerValue: val, manufacturerList: [] })
    }

    addItemHandler() {

        if (jQuery('#add_other_item').valid()) {
            let itemName = ReactDOM.findDOMNode(this.refs.itemPo.refs.item_name).value.trim();
            let modalNo = ReactDOM.findDOMNode(this.refs.itemPo.refs.item_modalNo).value.trim();
            let partNo = ReactDOM.findDOMNode(this.refs.itemPo.refs.item_partNo).value.trim();
            let mfg = ReactDOM.findDOMNode(this.refs.itemPo.refs.item_manufacturer).value.trim();
            let supplierName = ReactDOM.findDOMNode(this.refs.itemPo.refs.supplierName).value.trim();
            let listPrice = ReactDOM.findDOMNode(this.refs.itemPo.refs.listPrice).value.trim();
            let dealerPrice = ReactDOM.findDOMNode(this.refs.itemPo.refs.dealerPrice).value.trim();

            let supplier = [{
                supplierName: supplierName,
                listPrice: listPrice.replace(/[^0-9.]/g, ''),
                dealerPrice: dealerPrice.replace(/[^0-9.]/g, ''),
                priceDate: moment(),
            }];

            let itemDetails = {
                companyId: localStorage.companyId,
                itemName: itemName,
                modal: modalNo,
                partNumber: partNo,
                manufacturer: mfg,
                itemStatus: "Active",
                suppliers: supplier,
                createdBy: localStorage.userName
            }
            this.setState({ newAddedSupplier: supplier, newItemAddFlag: true });
            this.props.itemaction.createItemNew(itemDetails);
            $('#add_item').modal('hide');
            $('#lineitem_add').modal('hide');
        }
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

    isStringValidNumber(string) {
        let number = parseInt(string);
        if (isNaN(number) || number < 0)
            return false;
        return number;
    };

    updateLineItemsTable(index, dataType, e) {
        // debugger
        if (dataType == 'QTY') {
            let quantity = parseInt(e.data);
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.quantity = quantity;
            currentRowItem.mOurCostExtended = currentRowItem.mOurCost * quantity;
            currentRowItem.lHoursExtended = currentRowItem.lHours * quantity;
            currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
            currentRowItem.rowTotal = currentRowItem.mOurCostExtended + currentRowItem.lExtended;

            currentRowData.splice(index, 1, currentRowItem);
            this.setState({ itemPricedData: currentRowData })
        }
        else if (dataType == 'DESC') {
            let description = e.data;
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.itemName = description;

            currentRowData.splice(index, 1, currentRowItem);
            this.setState({ itemPricedData: currentRowData })
        }
        else if (dataType == 'HOURS') {
            let hours = parseInt(e.data);
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.lHours = hours;
            currentRowItem.lHoursExtended = currentRowItem.lHours * currentRowItem.quantity;
            currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
            currentRowItem.rowTotal = currentRowItem.mOurCostExtended + currentRowItem.lExtended;
            currentRowItem.unit = currentRowItem.lRate * currentRowItem.lHours;
            currentRowData.splice(index, 1, currentRowItem);
            this.setState({ itemPricedData: currentRowData })
        }
        else if (dataType == 'RATE') {
            let rate = parseInt(e.data);
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.lRate = rate;
            currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
            currentRowItem.rowTotal = currentRowItem.mOurCostExtended + currentRowItem.lExtended;
            currentRowItem.unit = currentRowItem.lRate * currentRowItem.lHours;
            currentRowData.splice(index, 1, currentRowItem);
            this.setState({ itemPricedData: currentRowData })
        }
    }

    updateDesc(index, dataType, e) {
        if (dataType == 'DESC') {
            let description = e.data;
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.itemName = description;

            currentRowData.splice(index, 1, currentRowItem);
            this.setState({ itemPricedData: currentRowData })
        }
        else if (dataType == 'ROWTOTAL') {
            let total = parseInt(e.data);
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.rowTotal = total;

            currentRowData.splice(index, 1, currentRowItem);
            this.setState({ itemPricedData: currentRowData })
        }
    }

    handleDelete(index) {

        this.setState({ itemDeleteIndex: index });
        $('#lineItem_delete').modal('show');
    }

    deletePricedItem() {

        if (this.state.itemDeleteIndex !== '') {
            $('#lineItem_delete').modal('hide');
            let currentState = this.state.itemPricedData;
            breakme: for (let i = 0; i < currentState.length; i++) {
                if (i > this.state.itemDeleteIndex) {
                    if (!currentState[i].headerName) {
                        currentState[i].header = ''
                    }
                    else if (currentState[i].headerName) {
                        break breakme;
                    }
                }
            }
            currentState.splice(this.state.itemDeleteIndex, 1);
            this.setState({
                itemPricedData: currentState,
                itemDeleteIndex: ''
            })
        }
    }

    poHandler() {
        toastr.remove();
        if (jQuery('#createPOs').valid()) {
            if (this.state.itemPricedData.length != 0) {
                let materialTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
                let laborTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
                let shippingTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId === 3) ? prev + next.rowTotal : prev, 0);
                let mOurCostTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCost : prev, 0);
                let mOurCostExtTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
                let lHoursExtended = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHoursExtended : prev, 0);
                let lExtendedTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
                let lHoursTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHours : prev, 0);
                let lRateTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lRate : prev, 0);
                let estimateTotal = materialTotal + laborTotal + shippingTotal;

                let poData = {
                    companyId: localStorage.companyId,
                    customerId: this.state.companyValue ? this.state.companyValue.id : '',
                    contactId: this.state.individualValue ? this.state.individualValue.id : '',
                    projectId: this.state.projectValue ? this.state.projectValue.id : '',
                    vendor: ReactDOM.findDOMNode(this.refs.vendor.refs.vendor).value.trim(),
                    vendorAddress1: ReactDOM.findDOMNode(this.refs.vendorAddress1).value.trim(),
                    vendorAddress2: ReactDOM.findDOMNode(this.refs.vendorAddress2).value.trim(),
                    vendorState: ReactDOM.findDOMNode(this.refs.vendorState.refs.vendorState).value.trim(),
                    vendorCity: ReactDOM.findDOMNode(this.refs.vendorCity.refs.vendorCity).value.trim(),
                    vendorZip: ReactDOM.findDOMNode(this.refs.vendorZip.refs.vendorZip).value.trim(),
                    shippingAddress1: ReactDOM.findDOMNode(this.refs.shippingAddress1).value.trim(),
                    shippingAddress2: ReactDOM.findDOMNode(this.refs.shippingAddress2).value.trim(),
                    shippingCity: ReactDOM.findDOMNode(this.refs.shippingCity.refs.shippingCity).value.trim(),
                    shippingState: ReactDOM.findDOMNode(this.refs.shippingState.refs.shippingState).value.trim(),
                    shippingZip: ReactDOM.findDOMNode(this.refs.shippingZip.refs.shippingZip).value.trim(),
                    title: ReactDOM.findDOMNode(this.refs.title.refs.title).value.trim(),
                    trackingNumber: ReactDOM.findDOMNode(this.refs.tracking.refs.tracking).value.trim(),
                    requestedBy: this.state.requestByValue ? this.state.requestByValue.id : '',
                    // approvedBy: localStorage.userName,
                    shipVia: ReactDOM.findDOMNode(this.refs.shipVia).value.trim(),
                    statusId: parseInt(ReactDOM.findDOMNode(this.refs.status).value.trim()),
                    // approvalStatusId: parseInt(ReactDOM.findDOMNode(this.refs.approvalStatus).value.trim()),
                    // approvedDate: this.state.approvalDate,
                    uponReceipt: ReactDOM.findDOMNode(this.refs.uponReceipt.refs.uponReceipt).value.trim(),
                    shipDate: this.state.shipDate,
                    notes: ReactDOM.findDOMNode(this.refs.notes).value.trim(),
                    item: this.state.itemPricedData,
                    materialTotal: materialTotal,
                    laborTotal: laborTotal,
                    shippingTotal: shippingTotal,
                    mOurCostTotal: mOurCostTotal,
                    mOurCostExtTotal: mOurCostExtTotal,
                    lHoursExtended: lHoursExtended,
                    lExtendedTotal: lExtendedTotal,
                    lHoursTotal: lHoursTotal,
                    lRateTotal: lRateTotal,
                    estimateTotal: estimateTotal,
                    createdBy: localStorage.userName,
                    poNumber:this.state.poNumber
                }

                functions.showLoader('create_po');
                this.props.poAction.createPO(poData);

            } else {
                toastr.error("Please add atleast one item to create purchase order.");
            }
            return false;
        }
    }

    handleModalOpen(name) {
        let self = this;
        self.state.modalName = "";
        $(name).modal({ backdrop: 'static' });
        self.state.modalName = name;
    }

    render() {
        //Totals for Items,Materials,Labor 
        let materialTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
        let laborTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
        let grandTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.rowTotal : prev, 0);
        let mOurCostTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCost : prev, 0);
        let mOurCostExtTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
        let lHoursExtended = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHoursExtended : prev, 0);
        let lExtended = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
        let lHoursTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHours : prev, 0);
        let lRateTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lRate : prev, 0);

        //Totals Section
        let totalCost = mOurCostExtTotal;
        let totalShipping = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId === 3) ? prev + next.rowTotal : prev, 0);

        let searchedItems = this.state.itemOptions
            .map(function (i, index) {
                return <tr key={index}>
                    <td>{i.manufacturer ? i.manufacturer : '-'}</td>
                    <td>{i.modal ? i.modal : '-'}</td>
                    <td>{i.partNumber ? i.partNumber : '-'}</td>
                    <td>{i.itemName ? i.itemName : '-'}</td>
                    <td><button type="button"
                        className="btn btn-xs green"
                        onClick={this.handleItemSubmit.bind(this, index)}>Select item</button>
                    </td>
                </tr>;
            }.bind(this));

        let supplierData = this.state.supplierData
            .map(function (supplier, index) {
                return <tr key={index}>
                    <td>{supplier.supplierName ? supplier.supplierName : '-'}</td>
                    <td>{supplier.dealerPrice ? supplier.dealerPrice : '-'}</td>
                    <td>{supplier.listPrice ? supplier.listPrice : '-'}</td>
                    <td>{supplier.demoPrice ? supplier.demoPrice : '-'}</td>
                    <td><button type="button" className="btn btn-xs green" onClick={this.handleLineItemAdd.bind(this, index, '')}>Select supplier</button>
                    </td>
                </tr>;
            }.bind(this));
        let mfgList = this.state.manufacturerList.map(function (mfg, index) {
            return <li key={index} onClick={this.selectManufacturer.bind(this, mfg)}><a>{mfg}</a></li>
        }.bind(this));
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
                        <tr key={index} data-id={index}>
                            <td style={{ textAlign: 'center' }}>{countItem}</td>
                            <td>{i.itemMfg}</td>
                            <td>{i.modelNo ? i.modelNo : '-'}</td>
                            <td>{i.partNo ? i.partNo : '-'}</td>
                            <td>
                                <RIETextArea activeClassName="form-control input-small"
                                    classEditing="form-control"
                                    value={i.itemName ? i.itemName : ''} propName="data"
                                    change={this.updateLineItemsTable.bind(this, index, 'DESC')}
                                />
                            </td>
                            <td style={{ textAlign: 'center' }}><RIENumber
                                validate={this.isStringValidNumber}
                                activeClassName="form-control input-small"
                                classEditing="form-control input-xsmall"
                                value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
                                change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
                            <td onClick={this.handleLineTab.bind(this, 2)}
                                style={{ textAlign: 'right', cursor: 'pointer' }}>
                                {i.mOurCostExtended ? '$' + validate.numberWithCommas((i.mOurCostExtended).toFixed(2)) : '$' + 0}
                            </td>
                            <td onClick={this.handleLineTab.bind(this, 3)}
                                style={{ textAlign: 'right', cursor: 'pointer' }}>
                                {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
                            <td style={{ textAlign: 'right' }}>
                                {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                            <td>
                                <span className="btn btn-icon-only red"
                                    onClick={this.handleDelete.bind(this, index)}>
                                    <i className="fa fa-trash-o"></i>
                                </span>
                            </td>
                        </tr>
                    )
                }
                else if (i.itemTypeId === 2) {
                    return (
                        <tr key={index} data-id={index}>
                            <td style={{ textAlign: 'center' }}>{countItem}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td>
                                <RIETextArea activeClassName="form-control input-small"
                                    classEditing="form-control"
                                    value={i.itemName ? i.itemName : ''} propName="data"
                                    change={this.updateDesc.bind(this, index, 'DESC')}
                                />
                            </td>
                            <td style={{ textAlign: 'center' }}><RIENumber
                                validate={this.isStringValidNumber}
                                activeClassName="form-control input-small"
                                classEditing="form-control input-xsmall"
                                value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
                                change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td style={{ textAlign: 'right' }}>$
                            <RIEInput activeClassName="form-control input-xsmall"
                                    classEditing="form-control"
                                    value={i.rowTotal ? validate.numberWithCommas((i.rowTotal).toFixed(2)) : '0'} propName="data"
                                    change={this.updateDesc.bind(this, index, 'ROWTOTAL')}
                                />
                            </td>
                            <td>
                                <span className="btn btn-icon-only red"
                                    onClick={this.handleDelete.bind(this, index)}>
                                    <i className="fa fa-trash-o"></i>
                                </span>
                            </td>
                        </tr>
                    )
                }
                else if (i.itemTypeId === 3) {
                    return (
                        <tr key={index} data-id={index}>
                            <td style={{ textAlign: 'center' }}>{countItem}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td>
                                Shipping:<RIETextArea activeClassName="form-control input-small"
                                    classEditing="form-control"
                                    value={i.itemName ? i.itemName : ''} propName="data"
                                    change={this.updateDesc.bind(this, index, 'DESC')}
                                />
                            </td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td className="unselectable">{''}</td>
                            <td style={{ textAlign: 'right' }}>$
                            <RIEInput activeClassName="form-control input-xsmall"
                                    classEditing="form-control"
                                    value={i.rowTotal ? validate.numberWithCommas((i.rowTotal).toFixed(2)) : '0'} propName="data"
                                    change={this.updateDesc.bind(this, index, 'ROWTOTAL')}
                                />
                            </td>
                            <td>
                                <span className="btn btn-icon-only red"
                                    onClick={this.handleDelete.bind(this, index)}>
                                    <i className="fa fa-trash-o"></i>
                                </span>
                            </td>
                        </tr>
                    )
                }
                else if (i.itemTypeId === 4) {
                    return (
                        <tr key={index} data-id={index}>
                            <td className="unselectable-header" colSpan="9">{i.headerName}</td>
                            <td>
                                <span className="btn btn-icon-only red"
                                    onClick={this.handleDelete.bind(this, index)}>
                                    <i className="fa fa-trash-o"></i>
                                </span>
                            </td>
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
                    return (<tr key={index} data-id={index}>
                        <td>{countMaterial ? countMaterial : ''}</td>
                        <td>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
                        <td style={{ textAlign: 'center' }}><RIENumber
                            validate={this.isStringValidNumber}
                            activeClassName="form-control input-small"
                            classEditing="form-control input-xsmall"
                            value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
                            change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>

                        <td style={{ textAlign: 'right' }}>
                            {i.mOurCost ? '$' + validate.numberWithCommas((i.mOurCost).toFixed(2)) : '$' + 0}</td>
                        <td style={{ textAlign: 'right' }}>
                            {i.mOurCostExtended ? '$' + validate.numberWithCommas((i.mOurCostExtended).toFixed(2)) : '$' + 0}</td>
                        <td onClick={this.handleLineTab.bind(this, 3)}
                            style={{ textAlign: 'right', cursor: 'pointer' }}>
                            {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
                        <td style={{ textAlign: 'right' }}>
                            {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                        <td>
                            <span className="btn btn-icon-only red"
                                onClick={this.handleDelete.bind(this, index)}>
                                <i className="fa fa-trash-o"></i>
                            </span>
                        </td>
                    </tr>)
                }
                else if (i.itemTypeId === 2) {
                    return (<tr key={index} data-id={index}>
                        <td>{countMaterial ? countMaterial : ''}</td>
                        <td>{i.itemName ? i.itemName : ''}</td>
                        <td style={{ textAlign: 'center' }}><RIENumber
                            validate={this.isStringValidNumber}
                            activeClassName="form-control input-small"
                            classEditing="form-control input-xsmall"
                            value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
                            change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td style={{ textAlign: 'right' }}>
                            {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                        <td>
                            <span className="btn btn-icon-only red"
                                onClick={this.handleDelete.bind(this, index)}>
                                <i className="fa fa-trash-o"></i>
                            </span>
                        </td>
                    </tr>)
                }
                else if (i.itemTypeId === 3) {
                    return (<tr key={index} data-id={index}>
                        <td>{countMaterial ? countMaterial : ''}</td>
                        <td>{i.itemName ? i.itemName : ''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td style={{ textAlign: 'right' }}>
                            {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                        <td>
                            <span className="btn btn-icon-only red"
                                onClick={this.handleDelete.bind(this, index)}>
                                <i className="fa fa-trash-o"></i>
                            </span>
                        </td>
                    </tr>)
                }
                else if (i.itemTypeId === 4) {
                    return (
                        <tr key={index} data-id={index}>
                            <td className="unselectable-header" colSpan="7">{i.headerName}</td>
                            <td>
                                <span className="btn btn-icon-only red"
                                    onClick={this.handleDelete.bind(this, index)}>
                                    <i className="fa fa-trash-o"></i>
                                </span>
                            </td>
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
                    return (<tr key={index} data-id={index}>
                        <td>{countLabor ? countLabor : ''}</td>
                        <td>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
                        <td style={{ textAlign: 'center' }}><RIENumber
                            validate={this.isStringValidNumber}
                            activeClassName="form-control input-small"
                            classEditing="form-control input-xsmall"
                            value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
                            change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
                        <td onClick={this.handleLineTab.bind(this, 2)}
                            style={{ textAlign: 'right', cursor: 'pointer' }}>
                            {i.mOurCostExtended ? '$' + validate.numberWithCommas((i.mOurCostExtended).toFixed(2)) : '$' + 0}</td>
                        <td style={{ textAlign: 'center' }}><RIENumber
                            validate={this.isStringValidNumber}
                            activeClassName="form-control input-small"
                            classEditing="form-control input-small"
                            value={i.lHours ? i.lHours : '0'} propName="data"
                            change={this.updateLineItemsTable.bind(this, index, 'HOURS')}
                            style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
                        <td style={{ textAlign: 'center' }}>{i.lHoursExtended}</td>
                        <td style={{ textAlign: 'right' }}><RIENumber
                            validate={this.isStringValidNumber}
                            activeClassName="form-control input-small"
                            classEditing="form-control input-small"
                            value={i.lRate ? (i.lRate.toString()) : '0'} propName="data"
                            change={this.updateLineItemsTable.bind(this, index, 'RATE')}
                            style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
                        <td style={{ textAlign: 'right' }}>
                            {i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
                        <td style={{ textAlign: 'right' }}>
                            {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
                        <td style={{ textAlign: 'right' }}>
                            {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                        <td>
                            <span className="btn btn-icon-only red"
                                onClick={this.handleDelete.bind(this, index)}>
                                <i className="fa fa-trash-o"></i>
                            </span>
                        </td>
                    </tr>)
                }
                else if (i.itemTypeId === 2) {
                    return (<tr key={index} data-id={index}>
                        <td>{countLabor ? countLabor : ''}</td>
                        <td>{i.itemName ? i.itemName : ''}</td>
                        <td style={{ textAlign: 'center' }}><RIENumber
                            validate={this.isStringValidNumber}
                            activeClassName="form-control input-small"
                            classEditing="form-control input-xsmall"
                            value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
                            change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
                        <td className="unselectable">{''}</td>
                        <td style={{ textAlign: 'center' }}><RIENumber
                            validate={this.isStringValidNumber}
                            activeClassName="form-control input-small"
                            classEditing="form-control input-small"
                            value={i.lHours ? i.lHours : '0'} propName="data"
                            change={this.updateLineItemsTable.bind(this, index, 'HOURS')}
                            style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
                        <td style={{ textAlign: 'center' }}>{i.lHoursExtended}</td>
                        <td style={{ textAlign: 'right' }}><RIENumber
                            validate={this.isStringValidNumber}
                            activeClassName="form-control input-small"
                            classEditing="form-control input-small"
                            value={i.lRate ? (i.lRate.toString()) : '0'} propName="data"
                            change={this.updateLineItemsTable.bind(this, index, 'RATE')}
                            style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
                        <td style={{ textAlign: 'right' }}>
                            {i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
                        <td style={{ textAlign: 'right' }}>
                            {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
                        <td style={{ textAlign: 'right' }}>
                            {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                        <td>
                            <span className="btn btn-icon-only red"
                                onClick={this.handleDelete.bind(this, index)}>
                                <i className="fa fa-trash-o"></i>
                            </span>
                        </td>
                    </tr>)
                }
                else if (i.itemTypeId === 3) {
                    return (<tr key={index} data-id={index}>
                        <td>{countLabor ? countLabor : ''}</td>
                        <td>{i.itemName ? i.itemName : ''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td className="unselectable">{''}</td>
                        <td style={{ textAlign: 'right' }}>
                            {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
                        <td>
                            <span className="btn btn-icon-only red"
                                onClick={this.handleDelete.bind(this, index)}>
                                <i className="fa fa-trash-o"></i>
                            </span>
                        </td>
                    </tr>)
                }
                else if (i.itemTypeId === 4) {
                    return (
                        <tr key={index} data-id={index}>
                            <td className="unselectable-header" colSpan="9">{i.headerName}</td>
                            <td>
                                <span className="btn btn-icon-only red"
                                    onClick={this.handleDelete.bind(this, index)}>
                                    <i className="fa fa-trash-o"></i>
                                </span>
                            </td>
                        </tr>
                    )
                }
            }.bind(this));
        return (
            <div>
                <div className="portlet-title tabbable-line">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#po-add" data-toggle="tab">
                                Purchase Order
                            </a>
                        </li>
                        <div className="form-actions noborder text-right">
                            <Link to={localStorage.contactPoId ? "/contactpos/" + localStorage.contactPoId : "/po"} className="btn red">
                                Cancel
                            </Link>&nbsp;&nbsp;
                            <button type="button" className="btn blue" onClick={this.poHandler}>Save</button>
                        </div>
                    </ul>
                </div>
                <div className="portlet light bordered" id="create_po">
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="po-add">
                                <div className="portlet-title">
                                    <div className="caption">
                                        <span className="caption-subject bold uppercase">General Details</span>
                                    </div>
                                </div>
                                <form role="form" id="createPOs">
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <SingleInput
                                                    inputType="text"
                                                    parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                    className="form-control"
                                                    title="Vendor"
                                                    name="vendor"
                                                    htmlFor="vendor"
                                                    defaultValue=""
                                                    required={true}
                                                    ref={'vendor'}
                                                />
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
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
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <label htmlFor="contact">Contact<span className="required">*</span>
                                                    </label>
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
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <label htmlFor="project">Project
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
                                            <div className="col-md-12">
                                                <div className="portlet-title">
                                                    <div className="caption">
                                                        <span className="caption-subject bold uppercase">Vendor Address</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        style={{ resize: 'none' }}
                                                        className="form-control"
                                                        rows="1"
                                                        ref="vendorAddress1"
                                                        name="vendorAddress1"
                                                        defaultValue=''
                                                        key=''></textarea>
                                                    <label htmlFor="vendorAddress1">Address 1<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        style={{ resize: 'none' }}
                                                        className="form-control"
                                                        rows="1"
                                                        ref="vendorAddress2"
                                                        name="vendorAddress2"
                                                        defaultValue=''
                                                        key=''></textarea>
                                                    <label htmlFor="vendorAddress2">Address 2
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <SingleInput
                                                    inputType="text"
                                                    parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                    className="form-control"
                                                    title="City"
                                                    name="vendorCity"
                                                    htmlFor="vendorCity"
                                                    defaultValue=""
                                                    required={true}
                                                    ref={'vendorCity'}
                                                />
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <SingleInput
                                                    inputType="text"
                                                    parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                    className="form-control"
                                                    title="State"
                                                    name="vendorState"
                                                    htmlFor="vendorState"
                                                    defaultValue=""
                                                    required={true}
                                                    ref={'vendorState'}
                                                />
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <SingleInput
                                                    inputType="text"
                                                    min={0}
                                                    parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                    className="form-control"
                                                    title="Zip"
                                                    name="vendorZip"
                                                    htmlFor="vendorZip"
                                                    defaultValue=""
                                                    required={true}
                                                    ref={'vendorZip'}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <div className="portlet-title">
                                                    <div className="caption">
                                                        <span className="caption-subject bold uppercase">Shipping Address</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        style={{ resize: 'none' }}
                                                        className="form-control"
                                                        rows="1"
                                                        ref="shippingAddress1"
                                                        name="shippingAddress1"
                                                        defaultValue=""></textarea>
                                                    <label htmlFor="shippingAddress1">Address 1<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <textarea
                                                        style={{ resize: 'none' }}
                                                        className="form-control"
                                                        rows="1"
                                                        ref="shippingAddress2"
                                                        name="shippingAddress2"
                                                        defaultValue=""></textarea>
                                                    <label htmlFor="shippingAddress2">Address 2
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <SingleInput
                                                    inputType="text"
                                                    parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                    className="form-control"
                                                    title="City"
                                                    name="shippingCity"
                                                    htmlFor="shippingCity"
                                                    defaultValue=""
                                                    required={true}
                                                    ref={'shippingCity'}
                                                />
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <SingleInput
                                                    inputType="text"
                                                    parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                    className="form-control"
                                                    title="State"
                                                    name="shippingState"
                                                    htmlFor="shippingState"
                                                    defaultValue=""
                                                    required={true}
                                                    ref={'shippingState'}
                                                />
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <SingleInput
                                                    inputType="text"
                                                    min={0}
                                                    parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                    className="form-control"
                                                    title="Zip"
                                                    name="shippingZip"
                                                    htmlFor="shippingZip"
                                                    defaultValue=""
                                                    required={true}
                                                    ref={'shippingZip'}
                                                />
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" ref="status" id="form_control_1">
                                                        <option value="1">Open</option>
                                                        <option value="2">Close</option>
                                                        <option value="3">In Process</option>
                                                    </select>
                                                    <label htmlFor="form_control_1">Status</label>
                                                </div>
                                            </div>
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select
                                                        className="form-control edited"
                                                        ref="approvalStatus"
                                                        id="form_control_1">
                                                        <option value="1">In Process</option>
                                                        <option value="2">Pending</option>
                                                        <option value="3">Approved</option>
                                                        <option value="4">Rejected</option>
                                                    </select>
                                                    <label htmlFor="form_control_1">Approval Status</label>
                                                </div>
                                            </div> */}
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="dateApproval">Approval Date</label>
                                                    <DateRangePicker
                                                        showDropdowns={true}
                                                        singleDatePicker
                                                        minDate={moment()}
                                                        onApply={this.handleApprovalDateEvent}>
                                                        <div className="input-group date form_datetime">
                                                            <input
                                                                type="text"
                                                                className="selected-date-range-btn"
                                                                size="16"
                                                                readOnly={true}
                                                                className="form-control"
                                                                defaultValue={this.state.approvalDate}
                                                                key={this.state.approvalDate}
                                                                name="actual_close_date" />
                                                            <span className="input-group-btn">
                                                                <button className="btn default date-set" type="button">
                                                                    <i className="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </DateRangePicker>
                                                </div>
                                            </div> */}
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="approvalBy"
                                                        name="approvalBy"
                                                        disabled={true}
                                                        defaultValue={localStorage.userName} />
                                                    <label htmlFor="approvalBy">Approval By</label>
                                                </div>
                                            </div> */}
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <SingleInput
                                                    inputType="text"
                                                    parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                    className="form-control"
                                                    title="Upon Receipt"
                                                    name="uponReceipt"
                                                    htmlFor="uponReceipt"
                                                    defaultValue=""
                                                    required={true}
                                                    ref={'uponReceipt'}
                                                />
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <SingleInput
                                                    inputType="text"
                                                    parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                    className="form-control"
                                                    title="Title"
                                                    name="title"
                                                    htmlFor="title"
                                                    defaultValue=""
                                                    required={true}
                                                    ref={'title'}
                                                />
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" id="" name="shipVia" ref="shipVia">
                                                        <option value="0">Select</option>
                                                        <option value="1">Fed Ex</option>
                                                        <option value="2">Amazon</option>
                                                    </select>
                                                    <label htmlFor="shipVia">Ship Via</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <SingleInput
                                                    inputType="text"
                                                    parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                    className="form-control"
                                                    title="Tracking #"
                                                    name="tracking"
                                                    htmlFor="tracking"
                                                    defaultValue=""
                                                    required={false}
                                                    ref={'tracking'}
                                                />
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="shipDate">Ship Date
                                                    </label>
                                                    <DateRangePicker
                                                        showDropdowns={true}
                                                        singleDatePicker
                                                        minDate={moment()}
                                                        onApply={this.handleShipDateEvent}>
                                                        <div className="input-group date form_datetime">
                                                            <input
                                                                type="text"
                                                                className="selected-date-range-btn"
                                                                size="16"
                                                                readOnly={true}
                                                                className="form-control"
                                                                defaultValue={this.state.shipDate}
                                                                key={this.state.shipDate}
                                                                name="" />
                                                            <span className="input-group-btn">
                                                                <button className="btn default date-set" type="button">
                                                                    <i className="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </DateRangePicker>
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-sm-12 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <TextareaAutosize
                                                        style={{ resize: 'none' }}
                                                        rows={5}
                                                        className="form-control"
                                                        ref="notes"
                                                        name="notes"
                                                        defaultValue=""></TextareaAutosize>
                                                    <label htmlFor="notes">Notes
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="requestBy">Request By<span className="required">*</span>
                                                    </label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.requestByValue}
                                                        placeholder="Contact"
                                                        name=""
                                                        options={this.state.requestByOptions}
                                                        onChange={this.handleRequestByChange}
                                                        onInputChange={this.onRequestByInputChange} />

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="portlet light portlet-fit portlet-datatable bordered">
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
                                        {this.state.itemPricedData.length != 0 ? <div className="portlet-body">
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
                                                                            <th className="items"></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="sortable" ref="sortable">
                                                                        {itemTabData}
                                                                    </tbody>
                                                                    {/* {this.state.itemPricedData.length != 0 ? <tfoot>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'right' }}>
                                                                                {materialTotal ? '$' + validate.numberWithCommas((materialTotal).toFixed(2)) : '$' + 0}</td>
                                                                            <td style={{ textAlign: 'right' }}>
                                                                                {laborTotal ? '$' + validate.numberWithCommas((laborTotal).toFixed(2)) : '$' + 0}</td>
                                                                            <td style={{ textAlign: 'right' }}>
                                                                                {grandTotal ? '$' + validate.numberWithCommas((grandTotal).toFixed(2)) : '$' + 0}</td>
                                                                            <td></td>
                                                                        </tr>
                                                                    </tfoot> : null} */}
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
                                                                            <th className="material" colSpan="2">Material</th>
                                                                            <th className="labor" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>Labor</th>
                                                                            <th className="rowtotal" rowSpan="2">Row Total</th>
                                                                            <th className="items" rowSpan="2"></th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="material">Our Cost</th>
                                                                            <th className="material">Our Cost Ext</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="sortable1" ref="sortable1">
                                                                        {materialTabData}
                                                                    </tbody>
                                                                    {/* {this.state.itemPricedData.length != 0 ? <tfoot>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'right' }}>{mOurCostExtTotal ? '$' + validate.numberWithCommas((mOurCostExtTotal).toFixed(2)) : ''}</td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'right' }}>
                                                                                {mExtendedTotal ? '$' + validate.numberWithCommas((mExtendedTotal).toFixed(2)) : '$' + 0}</td>
                                                                            <td style={{ textAlign: 'right' }}>
                                                                                {mTaxTotal ? '$' + validate.numberWithCommas((mTaxTotal).toFixed(2)) : '$' + 0}</td>
                                                                            <td style={{ textAlign: 'right' }}>
                                                                                {materialTotal ? '$' + validate.numberWithCommas((materialTotal).toFixed(2)) : '$' + 0}</td>
                                                                            <td style={{ textAlign: 'right' }}>
                                                                                {laborTotal ? '$' + validate.numberWithCommas((laborTotal).toFixed(2)) : '$' + 0}</td>
                                                                            <td style={{ textAlign: 'right' }}>
                                                                                {grandTotal ? '$' + validate.numberWithCommas((grandTotal).toFixed(2)) : '$' + 0}</td>
                                                                            <td></td>
                                                                        </tr>
                                                                    </tfoot> : null} */}
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
                                                                            <th className="items" rowSpan="2"></th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="labor">Hrs</th>
                                                                            <th className="labor">Hrs Ext</th>
                                                                            <th className="labor">Rate</th>
                                                                            <th className="labor">Unit</th>
                                                                            <th className="labor">Extended</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="sortable2" ref="sortable2">
                                                                        {laborTabData}
                                                                    </tbody>
                                                                    {/* {this.state.itemPricedData.length != 0 ? <tfoot>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'right' }}>
                                                                                {materialTotal ? '$' + validate.numberWithCommas((materialTotal).toFixed(2)) : '$' + 0}</td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'center' }}>
                                                                                {lHoursExtended ? lHoursExtended : ''}</td>
                                                                            <td style={{ textAlign: 'right' }}><span>
                                                                                {lRateTotal ? '$' + validate.numberWithCommas((lRateTotal).toFixed(2)) : '$' + 0}</span></td>
                                                                            <td style={{ textAlign: 'right' }}><span>
                                                                                {lExtended ? '$' + validate.numberWithCommas((lExtended).toFixed(2)) : '$' + 0}</span></td>
                                                                            <td style={{ textAlign: 'right' }}><span>
                                                                                {grandTotal ? '$' + validate.numberWithCommas((grandTotal).toFixed(2)) : '$' + 0}</span></td>
                                                                            <td></td>
                                                                        </tr>
                                                                    </tfoot> : null} */}
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : null}
                                        <div className="portlet-title">
                                            <div className="caption">
                                                <span className="caption-subject font-dark bold">Add Line Item:</span>
                                            </div>&nbsp;&nbsp;
                                        <a onClick={this.handleModalOpen.bind(this, '#lineitem_add')}
                                                data-backdrop="static" data-keyboard="false"
                                                className="btn btn-sm btn-circle green">
                                                <i className="icon-plus"></i>
                                                Material
                                        </a>&nbsp;&nbsp;
                                        <a onClick={this.handleModalOpen.bind(this, '#labor_add')}
                                                data-backdrop="static" data-keyboard="false"
                                                className="btn btn-sm btn-circle blue">
                                                <i className="icon-plus"></i>
                                                Labor
                                        </a>&nbsp;&nbsp;
                                        <a onClick={this.handleModalOpen.bind(this, '#subheader_add')}
                                                data-backdrop="static" data-keyboard="false"
                                                className="btn btn-sm btn-circle yellow">
                                                <i className="icon-plus"></i>
                                                Sub-Header
                                        </a>&nbsp;&nbsp;
                                        <a onClick={this.handleModalOpen.bind(this, '#shipping_add')}
                                                data-backdrop="static" data-keyboard="false"
                                                className="btn btn-sm btn-circle purple">
                                                <i className="icon-plus"></i>
                                                Shipping
                                        </a>
                                        </div>
                                        {/* Total section starts*/}
                                        {this.state.itemPricedData.length != 0 ? <div className="row">
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
                                                        {/* <tr>
                                                            <th colSpan="1">Tax</th>
                                                            <td style={{ textAlign: 'right' }}>
                                                                ${totalTax ? validate.numberWithCommas((totalTax).toFixed(2)) : 0}</td>
                                                        </tr> */}
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
                                        {/* Total section ends */}
                                    </div>
                                </div>
                            </div>

                            <AddMaterial
                                ref={"lineitem_add"}
                                materialAddId="lineitem_add"
                                onItemInputChange={this.onItemInputChange}
                                itemOptions={this.state.itemOptions}
                                searchedItems={searchedItems}
                                handlePopUpClose={this.handlePopUpClose.bind(this, 'item')}
                                createItemHandler={this.createItemHandler.bind(this, 'item')} />
                            <AddHeader ref="head_txt" headerAddId="subheader_add" handleHeaderAdd={this.handleHeaderAdd} />

                            <AddShipping ref="ship_desc" shippingAddId="shipping_add" handleShippingAdd={this.handleShippingAdd} />

                            <AddLabor ref="labr_desc" laborAddId="labor_add" handleLaborAdd={this.handleLaborAdd} />
                            <SelectSupplierModal
                                ref="supplier_add"
                                selectSupplierId="supplier_add"
                                supplierData={supplierData}
                                handlePopUpClose={this.handlePopUpClose.bind(this, 'supplier')} />
                            <ConfirmationModal
                                confirmationId="confirm_id"
                                confirmationTitle=""
                                confirmationText="Are you sure you want to create a new item in the database ?"
                                confirmationHandler={this.confirmationHandler} />
                            <AddItemModal
                                mfgList={mfgList}
                                onInputChange={this.getManufacturerList}
                                manufacturerValue={this.state.manufacturerValue}
                                itemModalId="add_item"
                                addItemHandler={this.addItemHandler}
                                ref="itemPo"
                                handlePopUpClose={this.handlePopUpClose.bind(this, 'newItem')}
                            />
                            <DeleteModal
                                deleteModalId="lineItem_delete"
                                deleteUserHandler={this.deletePricedItem}
                            />
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
        requestByList: state.poLists.requestList,
        itemList: state.poLists.itemList,
        ManufacturerList: state.poLists.manufacturerList,
        newCreatedItem: state.poLists.newCreatedItem,
        companyList: state.opportunity.companyList,
        individualList: state.opportunity.individualList,
        projectList: state.estimate.projectList,
        itemDetail: state.itemCreation.itemDetailData,
        createcontact: state.createcontact.contactData,
        poNumber:state.poLists.poNumber
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
        contactactions: bindActionCreators(createContactAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(POAdd);