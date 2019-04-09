import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Select from 'react-select';
import jQuery from 'jquery';
import { RIEInput, RIETextArea, RIENumber, RIESelect } from 'riek';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import _ from 'lodash';
import * as validate from '../common/validator';
import TextareaAutosize from 'react-autosize-textarea';
import InputMask from 'react-input-mask';
import * as loader from '../../constants/actionTypes.js';
import * as types from '../../constants/actionTypes';
import * as itemActions from '../../actions/itemAction';
import * as opportunityAction from '../../actions/opportunityAction';
import * as estimateActions from '../../actions/estimateActions';
import * as poActions from '../../actions/poActions.js';
import * as proposalActions from '../../actions/proposalActions';
import * as orderActions from '../../actions/orderActions';
import * as userAction from '../../actions/usersActions';
import * as appValid from '../../scripts/app';
import * as layout from '../../scripts/app';
import * as functions from '../common/functions';
import AddCompanyModal from '../common/newCompanyModal.component';
import DeleteModal from '../common/deleteModal.component';
import "../../styles/bootstrap-fileinput.css";
import SignaturePad from 'react-signature-pad-wrapper';
import AddItemModal from '../common/addItemModal.component';
import ConfirmationModal from '../common/confirmationModal.component';
import AddMaterial from '../common/materialAddModal';
import AddShipping from '../common/shippingAddModal';
import AddHeader from '../common/headerAddModal';
import AddLabor from '../common/laborAddModal';
import autoBind from 'react-autobind';
import * as message from '../../constants/messageConstants';

class EditOrder extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            supplierData: [],
            itemPricedData: [],
            taxRate: 1.8,
            disabled: false,
            items: [],
            companyValue: '',
            companyOptions: [],
            billingCompanyValue: '',
            billingCompanyOptions: [],
            itemDetails: [],
            itemValue: '',
            itemOptions: [],
            salesRepOptions: [],
            salesRepValue: '',
            poValue: '',
            poOptions: [],
            orderDetails: '',
            opportunityValue: '',
            opportunityOptions: [],
            estimateOptions: [],
            estimateValue: '',
            startDate: '',
            endDate: '',
            activeTabName: 'tab1',
            addressDetails: {
                mapAddress1: '',
                mapAddress2: '',
                city: '',
                state: '',
                zip: ''
            },
            shipAddressDetails: {
                mapAddress1: '',
                mapAddress2: '',
                city: '',
                state: '',
                zip: ''
            },
            unitPriceValue: '',
            laborRatesData: [],
            laborTypeId: '',
            laborTotalMore: [],
            laborHoursMore: [],
            expandTotal: false,
            expandHours: false,
            defaultMarkup: 30,
            defaultTaxRate: 9,
            itemTab: 'active',
            materialTab: '',
            laborTab: '',
            itemDeleteIndex: '',
            revisedItems: [],
            itemNotExists: true,
            newItemAdded: '',
            newItemAddFlag: false,
            newAddedSupplier: '',
            manufacturerList: [],
            handleAssignOptions: [],
            assignValue: '',
            usersData: [],
            scheduledDate: '',
            assignedData: [],
            breadcrumb: true,
            projectOptions: [],
            estimateOptions: [],
            modalName: '',
            query: '',
            createCompanyType: '',
            orderTypesData: [],
            contractList:[]
        }
    }

    componentWillMount() {

        let companyId = {
            companyId: localStorage.companyId,
            statusName: 'Active'
        }
        // this.props.proActions.getProjectData(companyId);
        // this.props.orderAction.getEstimateData(companyId);

        let compId = {
            userId: localStorage.userId,
            companyId: localStorage.companyId
        }
        this.props.orderAction.getOrderTypes(companyId);
        this.props.orderAction.getOrderContract(companyId);
        // this.props.proActions.getLaborRates(companyId, types.GET_LABOR_RATE_ORDER);
        this.props.userAction.getUsers(compId);
        let orderId = {
            orderId: this.props.params.orderId
        }
        this.props.orderAction.getOrderDetails(orderId);
        this.handleSearchDebounced = _.debounce(function () {
            if (this.state.query) {
                this.props.proActions.getItemData(this.state.query, types.GET_ORDER_ITEM);
            }
        }, 350);
        this.handleCompanySearchDebounced = _.debounce(function () {
            if (this.state.query) {
                this.props.actions.getCompanyList(this.state.query, types.GET_COMPANY_LIST_ORDER)
            }
        }, 350);
    }

    componentWillReceiveProps(nextProps) {
        
        let company = [];
        let item = [];
        let salesReps = [];
        let poNumbers = [];
        let opportunity = [];
        let estimate = [];
        let billingCompany = [];
        let laborData = [];
        let addr = {
            mapAddress1: '',
            mapAddress2: '',
            city: '',
            state: '',
            zip: ''
        };
        let shipAddr = {
            mapAddress1: '',
            mapAddress2: '',
            city: '',
            state: '',
            zip: ''
        };
        let userData = [];
        let assignedObjDisplay = [];
        let assignedObjSave = []

        // if (nextProps.companyList.length == 0 && nextProps.salesRepList.length == 0) {
        if (nextProps.orderDetail && (nextProps.orderDetail !== this.props.orderDetail)) {
            let orderstate = JSON.parse(JSON.stringify(nextProps.orderDetail.orderDetails));
            let company_name=orderstate.customerId ? ' (' + orderstate.customerId.companyName + ')':'';
            if (this.state.breadcrumb && orderstate.orderNumber) {
                let data = {
                    parent: <Link to='/order'>Service Orders</Link>,
                    childone: ('#' + orderstate.orderNumber) + company_name,
                    childtwo: ''
                };
                this.props.breadCrumb(data);
                this.state.breadcrumb = false;
            }
            // let itemState = JSON.parse(JSON.stringify(nextProps.orderDetail.itemLists));

            let companyObj = {
                value: orderstate.customerId?orderstate.customerId._id:'',
                label: orderstate.customerId?orderstate.customerId.companyName:''
            };
            // let salesRepobj = {
            //     id: orderstate.salesRep._id,
            //     label: orderstate.salesRep.firstname + ' ' + orderstate.salesRep.lastname
            // }

            // let poobj = {
            //     label: orderstate.poNumber
            // }

            let oppobj = {
                id: orderstate.opportunityId ? orderstate.opportunityId._id : '',
                label: orderstate.opportunityId ? orderstate.opportunityId.title : ''
            }

            // let estobj = {
            //     id: orderstate.estimateId ? orderstate.estimateId._id : '',
            //     label: orderstate.estimateId ? orderstate.estimateId.estimateNumber : ''
            // }

            let billCompanyObj = {
                value: orderstate.billingCompanyId ? orderstate.billingCompanyId._id : '',
                label: orderstate.billingCompanyId ? orderstate.billingCompanyId.companyName : ''
            }

            if (orderstate.userIds) {
                let assignList = orderstate.userIds
                    .map(function (usr, index) {
                        let obj = {
                            value: usr.userId,
                            label: usr.userName
                        }
                        assignedObjDisplay.push(obj)
                    }.bind(this));

                let assignList1 = orderstate.userIds
                    .map(function (usr, index) {
                        let obj = {
                            userId: usr.userId,
                            userName: usr.userName
                        }
                        assignedObjSave.push(obj)
                    }.bind(this));
            }

            addr = {
                mapAddress1: orderstate.billingAddress1,
                mapAddress2: orderstate.billingAddress2,
                city: orderstate.billingCity,
                state: orderstate.billingState,
                zip: orderstate.billingZip
            }

            shipAddr = {
                mapAddress1: orderstate.shippingAddress1,
                mapAddress2: orderstate.shippingAddress2,
                city: orderstate.shippingcity,
                state: orderstate.shippingstate,
                zip: orderstate.shippingzip
            }

            this.setState({
                orderDetails: orderstate,
                companyValue: companyObj,
                billingCompanyValue: billCompanyObj,
                // salesRepValue: salesRepobj,
                // poValue: poobj,
                // projectOptions: nextProps.projectData,
                // estimateOptions: nextProps.estimateData,
                addressDetails: addr,
                shipAddressDetails: shipAddr,
                opportunityValue: orderstate.opportunityId ? oppobj : '',
                estimateValue: orderstate.estimateId ? estobj : '',
                startDate: orderstate.startdate ? moment(orderstate.startdate).format('MM/DD/YYYY hh:mm:ss a') : '',
                endDate: orderstate.enddate ? moment(orderstate.enddate).format('MM/DD/YYYY hh:mm:ss a') : '',
                assignValue: assignedObjDisplay,
                assignedData: assignedObjSave,
                scheduledDate: orderstate.scheduledDate ? orderstate.scheduledDate : ''
            });

            let currentRevisedItem = [];

            // if (itemState.length > 0) {
            //     currentRevisedItem = itemState;
            // }

            // if (this.state.itemNotExists) {
            //     this.setState({
            //         itemPricedData: currentRevisedItem,
            //         itemNotExists: false,
            //     });

            //     let self = this;
            //     let sortId = "sortable";
            //     let droppedIndex = 0;
            //     if (self.state.itemTab == "active") {
            //         sortId = "sortable";
            //     } else if (self.state.materialTab == "active") {
            //         sortId = "sortable1";
            //     } else if (self.state.laborTab == "active") {
            //         sortId = "sortable2";
            //     }
            //     $(function () {
            //         $("#" + sortId).sortable({
            //             update: function (event, ui) {
            //                 let reorderArray = [];
            //                 let idsInOrder = $("#" + sortId).sortable('toArray', { attribute: 'data-id' });
            //                 idsInOrder.map(function (i) {
            //                     reorderArray.push(currentRevisedItem[i])
            //                 });
            //                 reorderArray.forEach(function (val, index) {
            //                     breakme: if (index > droppedIndex) {
            //                         if (!val.headerName) {
            //                             val.header = reorderArray[droppedIndex].headerName
            //                         }
            //                         else if (val.headerName) {
            //                             droppedIndex = 0;
            //                             break breakme;
            //                         }
            //                     }
            //                 })
            //                 self.setState({ itemPricedData: reorderArray })
            //                 self.updateInlineData(reorderArray);
            //                 $("#" + sortId).sortable("cancel");
            //             },
            //             change: function (event, ui) {
            //                 let currentIndex = ui.placeholder.index();
            //                 if (currentIndex > -1) {
            //                     droppedIndex = currentIndex;
            //                 }
            //             }
            //         }).disableSelection();
            //     });
            // }
        }

        if (nextProps.companyList.length != 0) {
            let companyList = nextProps
                .companyList
                .map(function (list, index) {
                    let obj = {
                        value: list._id,
                        label: list.companyName
                    }
                    company.push(obj)
                }.bind(this));
            // this.setState({ companyOptions: company })
        }

        if (nextProps.billingCompanyList.length) {
            let billingCompanyList = nextProps
                .billingCompanyList
                .map(function (list, index) {
                    let obj = {
                        value: list._id,
                        label: list.companyName
                    }
                    billingCompany.push(obj)
                }.bind(this));
            // this.setState({ billingCompanyOptions: billingCompany })
        }

        // if (nextProps.salesRepList.length != 0) {
        //     let salesRep = nextProps
        //         .salesRepList
        //         .map(function (salesRep, index) {
        //             let obj = {
        //                 id: salesRep._id,
        //                 label: salesRep.firstname + ' ' + salesRep.lastname
        //             }
        //             salesReps.push(obj)
        //         }.bind(this));
        // }

        // if (nextProps.podata.length != 0) {
        //     let poList = nextProps
        //         .podata
        //         .map(function (po, index) {
        //             let obj = {
        //                 label: po.poNumber
        //             }
        //             poNumbers.push(obj)
        //         }.bind(this));
        // }

        if (nextProps.orderTypesData.length != 0) {
            this.setState({ orderTypesData: nextProps.orderTypesData })
        }
        if (nextProps.contractList.length != 0) {
            this.setState({ contractList: nextProps.contractList })
        }

        if (nextProps.opportunityList.length != 0) {
            let opportunityList = nextProps
                .opportunityList
                .map(function (list, index) {
                    let obj = {
                        id: list._id,
                        label: list.title,
                    }
                    opportunity.push(obj)
                }.bind(this));
            this.setState({ opportunityOptions: opportunity })
        }

        // if (nextProps.laborRates.length != 0) {
        //     let laborList = nextProps
        //         .laborRates
        //         .map(function (list, index) {
        //             let obj = {
        //                 value: list._id,
        //                 text: list.laborType,
        //                 _id: list._id,
        //                 id: list._id,
        //                 laborType: list.laborType,
        //                 displayName: list.displayName,
        //                 rate: list.rate
        //             }
        //             laborData.push(obj)
        //         }.bind(this));
        // }

        // if (nextProps.estimateList.length != 0) {
        //     let estimateList = nextProps
        //         .estimateList
        //         .map(function (list, index) {
        //             let obj = {
        //                 id: list._id,
        //                 label: list.estimateNumber,
        //                 opportunityId: list.opportunityId,
        //                 title: list.title,
        //             }
        //             estimate.push(obj)
        //         }.bind(this));
        // }

        // if (nextProps.itemDetail) {
        //     let itemState = JSON.parse(JSON.stringify(nextProps.itemDetail));
        //     let index = this
        //         .state
        //         .itemDetails
        //         .map((o) => o.itemName)
        //         .indexOf(itemState.itemName);
        //     if (index < 0) {
        //         itemState.amount = parseInt(ReactDOM.findDOMNode(this.refs.unitprice).value);
        //         itemState.quantity = 1;
        //         itemState.unitPrice = parseInt(ReactDOM.findDOMNode(this.refs.unitprice).value);
        //         itemState.itemType = itemState.itemTypeId ? itemState.itemTypeId.itemType : '';
        //         itemState.total = itemState.amount;
        //         this
        //             .state
        //             .itemDetails
        //             .push(itemState);
        //         $('#lineitem_add').modal('hide');
        //         this.setState({ itemValue: '' })
        //     } else {
        //         toastr.error("This item is already added to po.");
        //     }
        // }

        if (nextProps.contactDetails) {

            let contactDetailState = JSON.parse(JSON.stringify(nextProps.contactDetails));
            let res = contactDetailState
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

        if (nextProps.usersData.length) {
            let userList = nextProps
                .usersData
                .map(function (list, index) {
                    let obj = {
                        value: list._id,
                        label: list.name ? list.name : list.email
                    }
                    userData.push(obj)
                }.bind(this));
            this.setState({ assignToOptions: userData })
        }

        // if (this.state.newItemAddFlag && nextProps.newCreatedItem) {
        //     let newItemAdded = {
        //         itemName: nextProps.newCreatedItem.itemName,
        //         modal: nextProps.newCreatedItem.modal,
        //         partNumber: nextProps.newCreatedItem.partNumber,
        //         manufacturer: nextProps.newCreatedItem.manufacturer,
        //         labourHour: 0,
        //         _id: nextProps.newCreatedItem._id
        //     }

        //     let newAddedSupplier = {
        //         itemId: nextProps.newCreatedItem._id,
        //         dealerPrice: this.state.newAddedSupplier ? this.state.newAddedSupplier[0].dealerPrice : 0
        //     }

        //     this.state.newItemAddFlag = false;
        //     this.state.newItemAdded = newItemAdded;
        //     this.handleLineItemAdd('', newAddedSupplier)
        // }

        if (nextProps.companyCreated && this.state.createCompanyType === 'CUSTOMER') {
            let companyData = {
                value: nextProps.companyCreated.id,
                label: nextProps.companyCreated.label
            }
            this.setState({
                companyValue: companyData,
                createCompanyType: ''
            })
        }
        if (nextProps.companyCreated && this.state.createCompanyType === 'BILLING') {
            let companyData = {
                value: nextProps.companyCreated.id,
                label: nextProps.companyCreated.label
            }
            this.setState({
                billingCompanyValue: companyData,
                createCompanyType: ''
            })
        }

        this.setState({
            companyOptions: company,
            // itemOptions: item,
            billingCompanyOptions: billingCompany,
            // salesRepOptions: salesReps, poOptions: poNumbers,
            // opportunityOptions: opportunity,
            // itemOptions: this.state.query ? nextProps.itemList : [],
            // laborRatesData: laborData,
            // manufacturerList: nextProps.ManufacturerList,
            // assignToOptions: userData
        });

        $('div#create_order').unblock();
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
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

        functions.showLoader('create_order');
        let self = this;
        let pageId = document.getElementById("create_order");
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

    componentWillUpdate(nextProps, nextState) {
        // let self = this;
        // let tabIndex = 1;
        // if (self.state.itemTab == "active") {
        //     tabIndex = 1;
        // } else if (self.state.materialTab == "active") {
        //     tabIndex = 2;
        // } else if (self.state.laborTab == "active") {
        //     tabIndex = 3;
        // }
        // self.sortableRows(tabIndex, nextState.itemPricedData);
    }

    handleExpand(type) {
        if (type === 'TOTAL') {
            let total = !this.state.expandTotal;
            this.setState({ expandTotal: total })
        }
        else if (type === 'HOURS') {
            let hours = !this.state.expandHours;
            this.setState({ expandHours: hours })
        }
    }

    handleLaborAdd(e) {
        toastr.remove();
        let itemDesc = ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_description).value;
        let quantity = ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_quantity).value;
        if (!itemDesc.trim()) {
            toastr.error(message.REQUIRED_DESCRIPTION);
        } else if (!quantity || !(parseInt(quantity) > 0)) {
            toastr.error(message.VALID_QUANTITY);
        } else {
            let pricedData = {
                itemMfg: '',
                partNo: '',
                modelNo: '',
                itemName: ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_description).value,
                quantity: ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_quantity).value ? parseInt(ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_quantity).value) : 1,
                mTaxable: false,
                mOurCost: 0,
                mOurCostExtended: 0,
                mMarkup: 0,
                mCost: 0,
                mExtended: 0,
                mTax: 0,
                mTaxExtended: 0,
                laborTypeName: this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].laborType : '',
                displayLaborName: this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].displayName : '',
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
                itemTab: '',
                materialTab: '',
                laborTab: 'active'
            });
            $('#labor_add').modal('hide');
            this.updateInlineData(currentItemState);
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
            this.updateInlineData(currentState);
            $('#subheader_add').modal('hide');
        }
        else {
            toastr.error(message.VALID_SUBHEADER)
        }
    }

    handleShippingAdd(e) {
        toastr.remove();
        let itemDesc = ReactDOM.findDOMNode(this.refs.ship_desc.refs.description).value;
        let amount = ReactDOM.findDOMNode(this.refs.ship_desc.refs.amount).value;
        if (!amount || !(parseInt(amount) > 0)) {
            toastr.error(message.VALID_AMOUNT);
        } else {
            let itemData = {
                itemTypeId: 3,
                header: '',
                rowTotal: ReactDOM.findDOMNode(this.refs.ship_desc.refs.amount).value ? parseInt(ReactDOM.findDOMNode(this.refs.ship_desc.refs.amount).value) : 0,
                itemName: ReactDOM.findDOMNode(this.refs.ship_desc.refs.description).value
            }
            let currentState = this.state.itemPricedData;
            currentState.push(itemData);
            this.updateInlineData(currentState);
            $('#shipping_add').modal('hide');
        }
    }

    setTab(tabName) {
        if (tabName) {
            this.setState({ activeTabName: tabName });
        }
    }

    isTaxableUpdate(index, dataType, e) {
        if (dataType == 'TAXABLE') {
            let taxable = e.target.checked;
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.mTaxable = taxable;
            currentRowItem.mTax = taxable ? ((parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0;
            currentRowItem.mTaxExtended = currentRowItem.mExtended + currentRowItem.mTax;
            currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;

            currentRowData.splice(index, 1, currentRowItem);
            this.updateInlineData(currentRowData);
        }
    }

    handleLineTab(tabIndex) {

        let self = this;

        if (tabIndex === 1) {
            this.setState({ itemTab: 'active', materialTab: '', laborTab: '' })
        }
        else if (tabIndex === 2) {
            this.setState({ itemTab: '', materialTab: 'active', laborTab: '' })
        }
        else if (tabIndex === 3) {
            this.setState({ itemTab: '', materialTab: '', laborTab: 'active' })
        }

        this.sortableRows(tabIndex, self.state.itemPricedData);

    }

    sortableRows(tabIndex, data) {

        let self = this;
        let sortId = "sortable";
        let droppedIndex = 0;
        if (tabIndex === 1) {
            sortId = "sortable";
        } else if (tabIndex === 2) {
            sortId = "sortable1";
        } else if (tabIndex === 3) {
            sortId = "sortable2";
        }
        $("#" + sortId).sortable({
            update: function (event, ui) {
                let reorderArray = [];
                let idsInOrder = $("#" + sortId).sortable('toArray', { attribute: 'data-id' });
                idsInOrder.map(function (i) {
                    reorderArray.push(data[i])
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
                self.updateInlineData(reorderArray);
                $("#" + sortId).sortable("cancel");
            },
            change: function (event, ui) {
                let currentIndex = ui.placeholder.index();
                if (currentIndex > 1) {
                    droppedIndex = currentIndex;
                }
            }
        }).disableSelection();;
    }

    selectOtherType(type, e) {
        
        ReactDOM.findDOMNode(this.refs.add_value).value = "";
        if (e.target.value == "other") {
            e.target.selectedIndex = "0";
            this.setState({ addType: type });
            $('#select-addType').modal('show');
        }
    }

    handleCompanyChange(value) {
        this.setState({ companyValue: value })
        // let data = {
        //     contactId: value.id
        // }
        // this
        //     .props
        //     .proActions
        //     .getCustomerDetails(data);
    }

    handlePoChange(value) {
        this.setState({ poValue: value })
    }

    onInputPoChange(value) {
        let companyId = {
            poNumber: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .poAction
            .getPos(companyId);
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

    onBillingInputChange(value) {
        let data = {
            companyName: value,
            companyId: localStorage.companyId
        }
        this.props.orderAction.getBillingCompanyList(data)
    }

    handleBillingCompanyChange(value) {
        this.setState({ billingCompanyValue: value })
    }

    handleStartDate(event, picker) {

        let displayDate = picker
            .startDate
            .format('MM-DD-YYYY h:mm:ss a');
        this.setState({ startDate: displayDate });
        if (this.state.endDate) {
            let from = moment(displayDate, 'MM-DD-YYYY h:mm:ss a'); // format in which you have the date
            let to = moment(this.state.endDate, 'MM-DD-YYYY h:mm:ss a');     // format in which you have the date
            /* using diff */
            let duration = to.diff(from, 'days');
            if (duration >= 1) {
                this.setState({ startDate: displayDate });
                var validator = jQuery("#createOrder").validate();
                validator.element("#endDate");
                jQuery('span[id^="endDate-error"]').remove();
            }
            else {
                toastr.error('Start date should be smaller then end date.')
                this.setState({ startDate: '' });
            }
        }
        else {
            this.setState({ startDate: displayDate });
            var validator = jQuery("#createOrder").validate();
            validator.element("#startDate");
            jQuery('span[id^="startDate-error"]').remove();
        }
    }

    handleEndDate(event, picker) {
        let displayDate = picker
            .startDate
            .format('MM-DD-YYYY h:mm:ss a');
        this.setState({ endDate: displayDate });
        if (this.state.startDate) {
            let from = moment(this.state.startDate, 'MM-DD-YYYY h:mm:ss a'); // format in which you have the date
            let to = moment(displayDate, 'MM-DD-YYYY h:mm:ss a');     // format in which you have the date
            /* using diff */
            let duration = to.diff(from, 'days');
            if (duration >= 1) {
                this.setState({ endDate: displayDate });
                var validator = jQuery("#createOrder").validate();
                validator.element("#endDate");
                jQuery('span[id^="endDate-error"]').remove();
            }
            else {
                toastr.error('End date should be greater than start date.')
                this.setState({ endDate: '' });
            }
        }
        else {
            toastr.error('Please select start date first.');
            this.setState({ endDate: '' });
        }
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
        if (type === "item") {
            this.setState({
                itemValue: '',
                itemOptions: []
            });
            $('#lineitem_add').modal('hide');
        }
        else if (type === "supplier") {
            $('#supplier_add').modal('hide');
        }
        else if (type === "newItem") {
            ReactDOM.findDOMNode(this.refs.itemEstimate.refs.item_manufacturer).value = '';
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
            this.handleLineItemAdd(index, data)
        }
        else if (currentdata.suppliersInfo) {
            this.setState({ supplierData: currentdata.suppliersInfo });
            $('#supplier_add').modal({ backdrop: 'static', keyboard: false });
        }
    }

    handleSalesRepChange(value) {
        this.setState({ salesRepValue: value })
    }

    onInputChangeSalesRep(value) {
        let data = {
            firstname: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getSalesRepData(data);
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
        // let itemTypeId = 1;
        let itemMfg = currentSelectedItem.manufacturer;
        let partNo = currentSelectedItem.partNumber;
        let modal = currentSelectedItem.modal;
        let itemName = currentSelectedItem.itemName;
        let quantity = 1;

        let mTaxable = true;
        let mOurCost = currentSupplier.dealerPrice ? parseInt(currentSupplier.dealerPrice) : 0;
        let mOurCostExtended = mOurCost * quantity;
        let mMarkup = ReactDOM.findDOMNode(this.refs.defaultMarkup).value ? parseInt(ReactDOM.findDOMNode(this.refs.defaultMarkup).value).toFixed(1) : ((30).toFixed(1));
        let mCost = mOurCost + ((mMarkup / 100) * mOurCost);
        let mExtended = quantity * mCost;
        let mTax = ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * mExtended) : 0;
        let mTaxExtended = mExtended + mTax;

        let laborTypeName = this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].laborType : '';
        let displayLaborName = this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].displayName : '';
        let lType = this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0]._id : '';
        let lHours = currentSelectedItem.labourHour ? parseInt(currentSelectedItem.labourHour) : 0;
        let lHoursExtended = lHours * quantity;
        let lRate = this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].rate : '';
        let lExtended = lHoursExtended * lRate;

        let pricedData = {
            itemId: currentSelectedItem._id,
            itemMfg: itemMfg,
            partNo: partNo,
            modelNo: modal,
            itemName: itemName,
            quantity: quantity,
            mTaxable: mTaxable,
            mOurCost: mOurCost,
            mOurCostExtended: mOurCostExtended,
            mMarkup: mMarkup,
            mCost: mCost,
            mExtended: mExtended,
            mTax: mTax,
            mTaxExtended: mTaxExtended,
            laborTypeName: laborTypeName,
            displayLaborName: displayLaborName,
            lType: lType,
            lHours: lHours,
            lExtended: lExtended,
            lHoursExtended: lHoursExtended,
            lRate: lRate,
            rowTotal: mTaxExtended + lExtended,
            header: '',
            itemTypeId: 1,
            unit: lHours * lRate
        }

        let currentItemState = this.state.itemPricedData;
        currentItemState.push(pricedData);

        this.setState({
            // itemPricedData: currentItemState,
            itemOptions: []
        });
        this.updateInlineData(currentItemState);
        $('#lineitem_add').modal('hide');
        $('#supplier_add').modal('hide');

    }

    updateLineItemsTable(index, dataType, e) {
        if (dataType == 'QTY') {
            let quantity = parseInt(e.data);
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.quantity = quantity;
            currentRowItem.mOurCostExtended = currentRowItem.mOurCost * quantity;
            currentRowItem.mExtended = currentRowItem.mCost * quantity;
            currentRowItem.mTax = ((parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended);
            currentRowItem.mTaxExtended = currentRowItem.mExtended + currentRowItem.mTax;
            currentRowItem.lHoursExtended = currentRowItem.lHours * quantity;
            currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
            currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;
            currentRowData.splice(index, 1, currentRowItem);

            this.updateInlineData(currentRowData);

        }
        else if (dataType == 'DESC') {
            let description = e.data;
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.itemName = description;

            currentRowData.splice(index, 1, currentRowItem);
            this.updateInlineData(currentRowData);
        }
        else if (dataType == 'HOURS') {
            let hours = parseInt(e.data);
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.lHours = hours;
            currentRowItem.lHoursExtended = currentRowItem.lHours * currentRowItem.quantity;
            currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
            currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;
            currentRowItem.unit = currentRowItem.lRate * currentRowItem.lHours;
            currentRowData.splice(index, 1, currentRowItem);
            this.updateInlineData(currentRowData);
        }
        else if (dataType == 'LABOR' || dataType == 'RATE') {
            let rate = parseInt(e.data);
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.lRate = rate;
            currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
            currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;
            currentRowItem.unit = currentRowItem.lRate * currentRowItem.lHours;
            currentRowData.splice(index, 1, currentRowItem);
            this.updateInlineData(currentRowData);
        }
    }

    updateDesc(index, dataType, e) {
        if (dataType == 'DESC') {
            let description = e.data;
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.itemName = description;

            currentRowData.splice(index, 1, currentRowItem);
            this.updateInlineData(currentRowData);
        }
        else if (dataType == 'ROWTOTAL') {
            let total = parseInt(e.data);
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.rowTotal = total;

            currentRowData.splice(index, 1, currentRowItem);
            this.updateInlineData(currentRowData);
        }
    }

    handleDelete(index) {
        this.setState({ itemDeleteIndex: index });
        $('#lineItem_delete').modal('show');
    }

    onChangeMarkupCost(index, dataType, e) {
        if (dataType == 'MARKUP') {
            let markup = parseInt(e.data);
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.mMarkup = markup;
            currentRowItem.mCost = currentRowItem.mOurCost + ((currentRowItem.mMarkup / 100) * currentRowItem.mOurCost);
            currentRowItem.mExtended = currentRowItem.quantity * currentRowItem.mCost;
            currentRowItem.mTax = ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0;
            currentRowItem.mTaxExtended = currentRowItem.mExtended + currentRowItem.mTax;
            currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;

            currentRowData.splice(index, 1, currentRowItem);
            this.updateInlineData(currentRowData);
        }
        else if (dataType == 'COST') {
            let cost = parseInt(e.data);
            let currentRowData = this.state.itemPricedData;
            let currentRowItem = this.state.itemPricedData[index];
            currentRowItem.mCost = cost
            currentRowItem.mMarkup = (((currentRowItem.mCost - currentRowItem.mOurCost) / currentRowItem.mOurCost) * 100)
            currentRowItem.mExtended = currentRowItem.quantity * currentRowItem.mCost;
            currentRowItem.mTax = ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0;
            currentRowItem.mTaxExtended = currentRowItem.mExtended + currentRowItem.mTax;
            currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;

            currentRowData.splice(index, 1, currentRowItem);
            this.updateInlineData(currentRowData);
        }
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
                itemDeleteIndex: ''
            });
            this.updateInlineData(currentState);
        }
    }

    confirmationHandler() {
        $('#confirm_id').modal('hide');
        $('#add_item').modal('show');
    }

    addItemHandler() {
        if (jQuery('#add_other_item').valid()) {
            let itemName = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.item_name).value.trim();
            let modalNo = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.item_modalNo).value.trim();
            let partNo = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.item_partNo).value.trim();
            let mfg = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.item_manufacturer).value.trim();
            let supplierName = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.supplierName).value.trim();
            let listPrice = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.listPrice).value.trim();
            let dealerPrice = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.dealerPrice).value.trim();

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
            this.setState({ newAddedSupplier: supplier, newItemAddFlag: true })
            this.props.itemaction.createItemNew(itemDetails);
            $('#add_item').modal('hide');
            $('#lineitem_add').modal('hide');
        }
    }

    handleAddOtherPopup(e) {
        
        e.preventDefault();
        let name = ReactDOM.findDOMNode(this.refs.add_value).value;
        if (name.trim()) {
            let type = this.state.addType;
            switch (type) {
                case "Order Type":
                    this.props.orderAction.addOtherOrderType(name);
                    break;
                case "Contract":
                    this.props.orderAction.addOrderContract(name);
                    break;
                default:
                    break;
            }
        }
        else {
            toastr.error(message.VALID_VALUE)
        }
    }

    handleLaborChange(index, select) {
        
        let currentLabor = select.laborType;
        let currentItemData = this.state.itemPricedData;
        currentItemData[index].lType = currentLabor._id;
        currentItemData[index].displayLaborName = currentLabor.displayName;
        currentItemData[index].laborTypeName = currentLabor.laborType;
        currentItemData[index].lRate = currentLabor.rate;
        this.setState({ itemPricedData: currentItemData });
        let res = {
            data: currentLabor.rate
        }
        this.updateLineItemsTable(index, 'LABOR', res)
    }

    handleOpportunityChange(value) {
        this.setState({ opportunityValue: value });
    }

    onOpportunityInputChange(value) {

        let data = {
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
        let data = {
            estimateNumber: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .proposalactions
            .getEstimateList(data)
    }

    onChangeGlobalMarkup(e) {
        let markup = e.target.value;
        this.setState({ defaultMarkup: markup })
    }

    handleGlobalMarkup(e) {
        let markup = parseInt(this.state.defaultMarkup);
        if ((markup >= 0 && markup <= 100) && this.state.itemPricedData.length !== 0) {
            let arr = this.state.itemPricedData;
            arr.forEach(function (item, index) {
                if (item.itemTypeId == 1 || item.itemTypeId == 2) {
                    arr[index].mMarkup = markup;
                    arr[index].mCost = arr[index].mOurCost + ((arr[index].mMarkup / 100) * arr[index].mOurCost);
                    arr[index].mExtended = arr[index].quantity * arr[index].mCost;
                    arr[index].mTax = this.state.defaultTaxRate ? ((parseInt(this.state.defaultTaxRate) / 100) * arr[index].mExtended) : 0;
                    arr[index].mTaxExtended = arr[index].mExtended + arr[index].mTax;
                    arr[index].rowTotal = arr[index].mTaxExtended + arr[index].lExtended;
                }
            }.bind(this));
            this.setState({
                defaultMarkup: markup
            });
            this.updateInlineData(arr);
        }
        else if (isNaN(markup) || markup == '') {
            this.setState({ defaultMarkup: 30 });
            setTimeout(function () {
                layout
                    .FloatLabel
                    .init();
            }, 200);
        }
    }

    onChangeGlobalTaxRate(e) {
        let taxrate = e.target.value;
        this.setState({ defaultTaxRate: taxrate })
    }

    handleGlobalTaxRate(e) {
        let taxrate = parseInt(this.state.defaultTaxRate);
        if ((taxrate >= 0 && taxrate <= 100) && this.state.itemPricedData.length !== 0) {
            let arr = this.state.itemPricedData;
            arr.forEach(function (item, index) {
                if (item.itemTypeId == 1 || item.itemTypeId == 2) {
                    arr[index].mTax = this.state.defaultTaxRate ? ((parseInt(this.state.defaultTaxRate) / 100) * arr[index].mExtended) : 0;;
                    arr[index].mTaxExtended = arr[index].mExtended + arr[index].mTax;
                    arr[index].rowTotal = arr[index].mTaxExtended + arr[index].lExtended;
                }
            }.bind(this));
            this.setState({
                defaultTaxRate: taxrate
            });
            this.updateInlineData(arr);
        }
        else if (isNaN(taxrate) || taxrate == '') {
            this.setState({ defaultTaxRate: 9 });
            setTimeout(function () {
                layout
                    .FloatLabel
                    .init();
            }, 200);
        }
    }

    createItemHandler() {
        // $('#confirm_id').modal('show');
        $('#add_item').modal('show');
    }

    updateInlineData(itemData) {
        this.setState({ itemPricedData: itemData });
        if (itemData.length != 0) {
            let itemsTotal = itemData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.rowTotal : prev, 0);
            let taxExtendedTotal = itemData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
            let materialCostTotal = itemData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
            let ourCostTotal = itemData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCost : prev, 0);
            let mOurCostExtTotal = itemData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
            let materialExtendedTotal = itemData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mExtended : prev, 0);
            let taxTotal = itemData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTax : prev, 0);
            let hoursExtendedTotal = itemData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHoursExtended : prev, 0);
            let laborExtendedTotal = itemData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
            let rateTotal = itemData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lRate : prev, 0);
            let shippingTotal = itemData.reduce((prev, next) => (next.itemTypeId === 3) ? prev + next.rowTotal : prev, 0);;
            let markupTotal = materialExtendedTotal - mOurCostExtTotal;
            let materialCost = taxExtendedTotal;
            let laborCost = itemData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
            let markupPercent = ((materialExtendedTotal - markupTotal) / markupTotal) * 100;
            let grandTotal = materialExtendedTotal + laborExtendedTotal + taxTotal + shippingTotal;

            let orderItem = {
                orderId: this.props.params.orderId,
                item: itemData,
                itemsTotal: itemsTotal,
                taxExtendedTotal: taxExtendedTotal,
                materialCostTotal: materialCostTotal,
                ourCostTotal: ourCostTotal,
                mOurCostExtTotal: mOurCostExtTotal,
                materialExtendedTotal: materialExtendedTotal,
                taxTotal: taxTotal,
                hoursExtendedTotal: hoursExtendedTotal,
                laborExtendedTotal: laborExtendedTotal,
                rateTotal: rateTotal,
                shippingTotal: shippingTotal,
                markupTotal: markupTotal,
                materialCost: materialCost,
                laborCost: laborCost,
                markupPercent: markupPercent,
                grandTotal: grandTotal,
                taxRate: ReactDOM.findDOMNode(this.refs.taxRate).value ? parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) : 0,
                markUp: ReactDOM.findDOMNode(this.refs.defaultMarkup).value ? parseInt(ReactDOM.findDOMNode(this.refs.defaultMarkup).value) : 0,
                modifiedBy: localStorage.userName
            }
            this
                .props
                .orderAction
                .updateItemOrder(orderItem);
        }
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

    handleSignature() {
        let signature = this.refs.signatureboard;
        let res = signature.isEmpty();
        let res2 = signature.toDataURL();
        let signBlob = {
            userId: localStorage.userId,
            orderId: this.props.params.orderId,
            image: res2
        }

        if (!res) {
            this.props.orderAction.updateSignature(signBlob);
            $('#add-signature').modal('hide');
        }
        signature.clear();
    }

    clearSignature() {
        let signature = this.refs.signatureboard;
        signature.clear();
    }

    handleAssignOptions(value) {
        let assignData = [];
        value.map(function (item) {
            let obj = {
                userId: item.value,
                userName: item.label
            }
            assignData.push(obj);
        });
        this.setState({ assignValue: value, assignedData: assignData });
    }

    handleScheduledDate(event, picker) {
        let displayDate = picker.startDate.format('MM/DD/YYYY');
        this.setState({ scheduledDate: displayDate });
    }

    isStringValidNumber(string) {
        let number = parseInt(string);
        if (isNaN(number) || number < 0)
            return false;
        return number;
    }

    isStringValidLabor(string) {
        let number = parseFloat(string);
        if (isNaN(number) || number < 0) {
            return false;
        }
        else {
            return (number.toString());
        }
    };

    handleModalOpen(name) {
        let self = this;
        self.state.modalName = "";
        $(name).modal({ backdrop: 'static' });
        self.state.modalName = name;
    }

    handleCustomerChange(value) {
        
        this.setState({ customerValue: value })
    }

    handleSelectsBlur() {
        
        this.props.orderAction.clearSelects()
    }

    onCompanyInputChange(value) {
        
        if (value.trim()) {
            let data = {
                companyName: value,
                companyId: localStorage.companyId
            }
            this.setState({ query: data });
            this.handleCompanySearchDebounced();
        }
        else {
            this.props.orderAction.clearSelects()
            this.setState({ query: '', companyOptions: [] })
        }
    }

    handleCompanyAdd() {

        toastr.remove();
        let companyName = ReactDOM.findDOMNode(this.refs.companyChild.refs.new_customer).value.trim();
        if (companyName) {
            let textRegex = /^\d*[a-zA-Z]{1,}\d*/i;
            let res = textRegex.test(companyName);
            if (res) {
                let data = {
                    userId: localStorage.userId,
                    companyId: localStorage.companyId,
                    parentContactId: this.state.customerValue ? this.state.customerValue.id : '',
                    companyName: companyName,
                    userType: 1,
                    statusId: localStorage.statusNameId,
                    createdBy: localStorage.userName
                }
                this.props.proActions.addOtherCompany(data)
                $('#add-company').modal('hide');
            } else {
                toastr.error('The company name you entered is not valid.');
            }
        }
        else {
            toastr.error('Please fill in a valid company name.');
        }
    }

    handleNewCompanyModal(dataType) {
        
        toastr.remove()
        if (dataType === 'CUSTOMER') {
            ReactDOM.findDOMNode(this.refs.companyChild.refs.new_customer).value = '';
            this.setState({ customerValue: '', createCompanyType: dataType })
            $('#add-company').modal({ backdrop: 'static', keyboard: false });
        }
        else if (dataType === 'BILLING') {
            ReactDOM.findDOMNode(this.refs.companyChild.refs.new_customer).value = '';
            this.setState({ customerValue: '', createCompanyType: dataType })
            $('#add-company').modal({ backdrop: 'static', keyboard: false });
        }
    }

    orderHandler() {
        
        toastr.remove();
        if (this.state.activeTabName === 'tab1') {
            if (jQuery('#createOrder').valid()) {
                let orderData = {
                    companyId: localStorage.companyId,
                    orderId: this.props.params.orderId,
                    customerId: this.state.companyValue ? this.state.companyValue.value : '',
                    billingCompanyId: this.state.billingCompanyValue ? this.state.billingCompanyValue.value : '',
                    // title: ReactDOM
                    //     .findDOMNode(this.refs.title)
                    //     .value
                    //     .trim(),
                    serviceLocation: ReactDOM.findDOMNode(this.refs.serviceLocation).value.trim(),
                    descriptionWork: ReactDOM.findDOMNode(this.refs.description).value.trim(),
                    workPerformed: ReactDOM.findDOMNode(this.refs.workPerform).value.trim(),
                    // poNumber: this.state.poValue ? this.state.poValue.label : '',
                    statusId: parseInt(ReactDOM.findDOMNode(this.refs.status).value.trim()),
                    // stageId: parseInt(ReactDOM.findDOMNode(this.refs.stage).value.trim()),
                    // salesRep: this.state.salesRepValue ? this.state.salesRepValue.id : '',
                    orderTypeId: ReactDOM.findDOMNode(this.refs.orderType).value,
                    contractId: ReactDOM.findDOMNode(this.refs.contract).value && ReactDOM.findDOMNode(this.refs.contract).value !== "0" ? ReactDOM.findDOMNode(this.refs.contract).value : '',
                    modifiedBy: localStorage.userName,
                    userIds: this.state.assignedData,
                    scheduledDate: this.state.scheduledDate,
                    // estimatedDuration: parseInt(ReactDOM.findDOMNode(this.refs.estimatedDuration).value),
                    // projectId: ReactDOM.findDOMNode(this.refs.projectId).value !== '0' ? ReactDOM.findDOMNode(this.refs.projectId).value : '',
                    // estimateId: ReactDOM.findDOMNode(this.refs.estimateId).value !== '0' ? ReactDOM.findDOMNode(this.refs.estimateId).value : ''
                }

                functions.showLoader('create_order')
                this
                    .props
                    .orderAction
                    .updateOrder(orderData, this.props.params.orderId);
            }
        } else if (this.state.activeTabName === 'tab2') {
            if (jQuery('#createOrderMoreInfo').valid()) {

                let items = [];
                let orderData = {
                    companyId: localStorage.companyId,
                    orderId: this.props.params.orderId,
                    opportunityId: this.state.opportunityValue ? this.state.opportunityValue.id : '',
                    // estimateId: this.state.estimateValue ? this.state.estimateValue.id : '',
                    startdate: this.state.startDate,
                    enddate: this.state.endDate,
                    technicianName: ReactDOM.findDOMNode(this.refs.techName).value,
                    phone: ReactDOM.findDOMNode(this.refs.techPhone).value,
                    notes: ReactDOM.findDOMNode(this.refs.notes).value,
                    modifiedBy: localStorage.userName
                }
                functions.showLoader('create_order')
                this
                    .props
                    .orderAction
                    .updateOrder(orderData);

            }
        }
    }

    render() {
        let orderDetailData = this.state.orderDetails;
        // let clonedItemData = JSON.parse(JSON.stringify(this.state.itemPricedData));
        //Totals for Items,Materials,Labor 
        // let materialTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
        // let laborTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
        // let grandTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.rowTotal : prev, 0);
        // let mOurCostTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCost : prev, 0);
        // let mOurCostExtTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
        // let mExtendedTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mExtended : prev, 0);
        // let mTaxTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTax : prev, 0);
        // let lHoursExtended = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHoursExtended : prev, 0);
        // let lExtended = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
        // let lHoursTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHours : prev, 0);
        // let lRateTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lRate : prev, 0);

        //Totals Section
        // let totalCost = mExtendedTotal;
        // let totalTax = mTaxTotal;
        // let totalShipping = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId === 3) ? prev + next.rowTotal : prev, 0);
        // let markupTotal = mExtendedTotal - mOurCostExtTotal;
        // let markupPercent = ((materialTotal - markupTotal) / markupTotal) * 100;

        // let countItem = 0;
        // let countMaterial = 0;
        // let countLabor = 0;

        // let projectData = this.state.projectOptions
        //     .map(function (project, index) {
        //         return <option key={index} value={project._id}>{project.title}</option>;
        //     }.bind(this));

        // let estimateData = this.state.estimateOptions
        //     .map(function (estimate, index) {
        //         return <option key={index} value={estimate._id}>{estimate.estimateNumber}</option>;
        //     }.bind(this));

        // let itemTabData = this.state.itemPricedData
        //     .map(function (i, index) {
        //         if (i.itemTypeId == 1) {
        //             countItem = countItem + 1;
        //         } else if (i.itemTypeId == 2) {
        //             countItem = countItem + 1;
        //         } else if (i.itemTypeId == 3) {
        //             countItem = countItem + 1;
        //         } else if (i.itemTypeId == 4) {
        //             countItem = countItem;
        //         }
        //         if (i.itemTypeId === 1) {
        //             return (
        //                 <tr key={index} data-id={index}>
        //                     <td style={{ textAlign: 'center' }}>{countItem}</td>
        //                     <td>{i.itemMfg}</td>
        //                     <td>{i.modelNo ? i.modelNo : '-'}</td>
        //                     <td>{i.partNo ? i.partNo : '-'}</td>
        //                     <td>
        //                         <RIETextArea activeClassName="form-control input-small"
        //                             classEditing="form-control"
        //                             value={i.itemName ? i.itemName : ''} propName="data"
        //                             change={this.updateLineItemsTable.bind(this, index, 'DESC')}
        //                         />
        //                     </td>
        //                     <td style={{ textAlign: 'center' }}><RIENumber
        //                         validate={this.isStringValidNumber}
        //                         activeClassName="form-control input-small"
        //                         classEditing="form-control input-xsmall"
        //                         value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
        //                         change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
        //                     <td onClick={this.handleLineTab.bind(this, 2)}
        //                         style={{ textAlign: 'right', cursor: 'pointer' }}>
        //                         {i.mTaxExtended ? '$' + validate.numberWithCommas((i.mTaxExtended).toFixed(2)) : '$' + 0}
        //                     </td>
        //                     <td onClick={this.handleLineTab.bind(this, 3)}
        //                         style={{ textAlign: 'right', cursor: 'pointer' }}>
        //                         {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
        //                     <td style={{ textAlign: 'right' }}>
        //                         {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
        //                     <td>
        //                         <span className="btn btn-icon-only red"
        //                             onClick={this.handleDelete.bind(this, index)}>
        //                             <i className="fa fa-trash-o"></i>
        //                         </span>
        //                     </td>
        //                 </tr>
        //             )
        //         }
        //         else if (i.itemTypeId === 2) {
        //             return (
        //                 <tr key={index} data-id={index}>
        //                     <td style={{ textAlign: 'center' }}>{countItem}</td>
        //                     <td className="unselectable">{''}</td>
        //                     <td className="unselectable">{''}</td>
        //                     <td className="unselectable">{''}</td>
        //                     <td>
        //                         <b>Labor:</b><RIETextArea activeClassName="form-control input-small"
        //                             classEditing="form-control"
        //                             value={i.itemName ? i.itemName : 'NA'} propName="data"
        //                             change={this.updateDesc.bind(this, index, 'DESC')}
        //                         />
        //                     </td>
        //                     <td style={{ textAlign: 'center' }}><RIENumber
        //                         validate={this.isStringValidNumber}
        //                         activeClassName="form-control input-small"
        //                         classEditing="form-control input-xsmall"
        //                         value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
        //                         change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
        //                     <td className="unselectable">{''}</td>
        //                     <td className="unselectable">{''}</td>
        //                     <td style={{ textAlign: 'right' }}>$
        //                         <RIEInput activeClassName="form-control input-xsmall"
        //                             classEditing="form-control"
        //                             value={i.rowTotal ? validate.numberWithCommas((i.rowTotal).toFixed(2)) : '0'} propName="data"
        //                             change={this.updateDesc.bind(this, index, 'ROWTOTAL')}
        //                         />
        //                     </td>
        //                     <td>
        //                         <span className="btn btn-icon-only red"
        //                             onClick={this.handleDelete.bind(this, index)}>
        //                             <i className="fa fa-trash-o"></i>
        //                         </span>
        //                     </td>
        //                 </tr>
        //             )
        //         }
        //         else if (i.itemTypeId === 3) {
        //             return (
        //                 <tr key={index} data-id={index}>
        //                     <td style={{ textAlign: 'center' }}>{countItem}</td>
        //                     <td className="unselectable">{''}</td>
        //                     <td className="unselectable">{''}</td>
        //                     <td className="unselectable">{''}</td>
        //                     <td>
        //                         <b>Shipping</b>:<RIETextArea activeClassName="form-control input-small"
        //                             classEditing="form-control"
        //                             value={i.itemName ? i.itemName : 'NA'} propName="data"
        //                             change={this.updateDesc.bind(this, index, 'DESC')}
        //                         />
        //                     </td>
        //                     <td className="unselectable">{''}</td>
        //                     <td className="unselectable">{''}</td>
        //                     <td className="unselectable">{''}</td>
        //                     <td style={{ textAlign: 'right' }}>$
        //                         <RIEInput activeClassName="form-control input-xsmall"
        //                             classEditing="form-control"
        //                             value={i.rowTotal ? validate.numberWithCommas((i.rowTotal).toFixed(2)) : '0'} propName="data"
        //                             change={this.updateDesc.bind(this, index, 'ROWTOTAL')}
        //                         />
        //                     </td>
        //                     <td>
        //                         <span className="btn btn-icon-only red"
        //                             onClick={this.handleDelete.bind(this, index)}>
        //                             <i className="fa fa-trash-o"></i>
        //                         </span>
        //                     </td>
        //                 </tr>)
        //         }
        //         else if (i.itemTypeId === 4) {
        //             return (
        //                 <tr key={index} data-id={index}>
        //                     <td className="unselectable-header" colSpan="9">{i.headerName}</td>
        //                     <td>
        //                         <span className="btn btn-icon-only red"
        //                             onClick={this.handleDelete.bind(this, index)}>
        //                             <i className="fa fa-trash-o"></i>
        //                         </span>
        //                     </td>
        //                 </tr>
        //             )
        //         }
        //     }.bind(this));

        // let materialTabData = this
        //     .state
        //     .itemPricedData
        //     .map(function (i, index) {
        //         if (i.itemTypeId == 1) {
        //             countMaterial = countMaterial + 1;
        //         } else if (i.itemTypeId == 2) {
        //             countMaterial = countMaterial + 1;
        //         } else if (i.itemTypeId == 3) {
        //             countMaterial = countMaterial + 1;
        //         } else if (i.itemTypeId == 4) {
        //             countMaterial = countMaterial;
        //         }
        //         if (i.itemTypeId === 1) {
        //             return (<tr key={index} data-id={index}>
        //                 <td>{countMaterial ? countMaterial : ''}</td>
        //                 <td>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
        //                 <td style={{ textAlign: 'center' }}><RIENumber
        //                     validate={this.isStringValidNumber}
        //                     activeClassName="form-control input-small"
        //                     classEditing="form-control input-xsmall"
        //                     value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
        //                     change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
        //                 <td style={{ textAlign: 'center' }}>
        //                     <div className="md-checkbox" style={{ marginLeft: '8px' }}>
        //                         <input type="checkbox" id={index}
        //                             className="md-check"
        //                             checked={i.mTaxable} value={i.mTaxable}
        //                             onChange={this.isTaxableUpdate.bind(this, index, 'TAXABLE')}
        //                             style={{ minWidth: 60 }} />
        //                         <label htmlFor={index}>
        //                             <span className="inc"></span>
        //                             <span className="check"></span>
        //                             <span className="box"></span>
        //                         </label>
        //                     </div>
        //                 </td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.mOurCost ? '$' + validate.numberWithCommas((i.mOurCost).toFixed(2)) : '$' + 0}</td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.mOurCostExtended ? '$' + validate.numberWithCommas((i.mOurCostExtended).toFixed(2)) : '$' + 0}</td>
        //                 <td style={{ textAlign: 'right' }}><RIENumber
        //                     validate={this.isStringValidNumber}
        //                     activeClassName="form-control input-small"
        //                     classEditing="form-control input-small"
        //                     value={i.mMarkup ? (i.mMarkup.toString()) : '0'} propName="data"
        //                     change={this.onChangeMarkupCost.bind(this, index, 'MARKUP')}
        //                     style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
        //                 <td style={{ textAlign: 'right' }}><RIENumber
        //                     validate={this.isStringValidNumber}
        //                     activeClassName="form-control input-small"
        //                     classEditing="form-control input-small"
        //                     value={i.mCost ? (i.mCost).toFixed(2) : '$' + 0} propName="data"
        //                     change={this.onChangeMarkupCost.bind(this, index, 'COST')}
        //                     style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.mExtended ? '$' + validate.numberWithCommas((i.mExtended).toFixed(2)) : '$' + 0}</td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.mTax ? '$' + validate.numberWithCommas((i.mTax).toFixed(2)) : '$' + 0}</td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.mTaxExtended ? '$' + validate.numberWithCommas((i.mTaxExtended).toFixed(2)) : '$' + 0}</td>
        //                 <td onClick={this.handleLineTab.bind(this, 3)}
        //                     style={{ textAlign: 'right', cursor: 'pointer' }}>
        //                     {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
        //                 <td>
        //                     <span className="btn btn-icon-only red"
        //                         onClick={this.handleDelete.bind(this, index)}>
        //                         <i className="fa fa-trash-o"></i>
        //                     </span>
        //                 </td>
        //             </tr>)
        //         }
        //         else if (i.itemTypeId === 2) {
        //             return (<tr key={index} data-id={index}>
        //                 <td>{countMaterial ? countMaterial : ''}</td>
        //                 <td>
        //                     <b>Labor:</b><RIETextArea activeClassName="form-control input-small"
        //                         classEditing="form-control"
        //                         value={i.itemName ? i.itemName : 'NA'} propName="data"
        //                         change={this.updateDesc.bind(this, index, 'DESC')}
        //                     />
        //                 </td>
        //                 <td style={{ textAlign: 'center' }}><RIENumber
        //                     validate={this.isStringValidNumber}
        //                     activeClassName="form-control input-small"
        //                     classEditing="form-control input-xsmall"
        //                     value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
        //                     change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}
        //                 </td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
        //                 <td>
        //                     <span className="btn btn-icon-only red"
        //                         onClick={this.handleDelete.bind(this, index)}>
        //                         <i className="fa fa-trash-o"></i>
        //                     </span>
        //                 </td>
        //             </tr>)
        //         }
        //         else if (i.itemTypeId === 3) {
        //             return (<tr key={index} data-id={index}>
        //                 <td>{countMaterial ? countMaterial : ''}</td>
        //                 <td>
        //                     <b>Shipping:</b><RIETextArea activeClassName="form-control input-small"
        //                         classEditing="form-control"
        //                         value={i.itemName ? i.itemName : 'NA'} propName="data"
        //                         change={this.updateDesc.bind(this, index, 'DESC')}
        //                     />
        //                 </td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
        //                 <td>
        //                     <span className="btn btn-icon-only red"
        //                         onClick={this.handleDelete.bind(this, index)}>
        //                         <i className="fa fa-trash-o"></i>
        //                     </span>
        //                 </td>
        //             </tr>)
        //         }
        //         else if (i.itemTypeId === 4) {
        //             return (
        //                 <tr key={index} data-id={index}>
        //                     <td className="unselectable-header" colSpan="13">{i.headerName}</td>
        //                     <td>
        //                         <span className="btn btn-icon-only red"
        //                             onClick={this.handleDelete.bind(this, index)}>
        //                             <i className="fa fa-trash-o"></i>
        //                         </span>
        //                     </td>
        //                 </tr>
        //             )
        //         }
        //     }.bind(this));

        // let laborTabData = this
        //     .state
        //     .itemPricedData
        //     .map(function (i, index) {
        //         if (i.itemTypeId == 1) {
        //             countLabor = countLabor + 1;
        //         } else if (i.itemTypeId == 2) {
        //             countLabor = countLabor + 1;
        //         } else if (i.itemTypeId == 3) {
        //             countLabor = countLabor + 1;
        //         } else if (i.itemTypeId == 4) {
        //             countLabor = countLabor;
        //         }
        //         if (i.itemTypeId === 1) {
        //             return (<tr key={index} data-id={index}>
        //                 <td>{countLabor ? countLabor : ''}</td>
        //                 <td>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
        //                 <td style={{ textAlign: 'center' }}><RIENumber
        //                     validate={this.isStringValidNumber}
        //                     activeClassName="form-control input-small"
        //                     classEditing="form-control input-xsmall"
        //                     value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
        //                     change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
        //                 <td onClick={this.handleLineTab.bind(this, 2)}
        //                     style={{ textAlign: 'right', cursor: 'pointer' }}>
        //                     {i.mTaxExtended ? '$' + validate.numberWithCommas((i.mTaxExtended).toFixed(2)) : '$' + 0}</td>
        //                 <td>
        //                     <RIESelect
        //                         change={this.handleLaborChange.bind(this, index)}
        //                         value={this.state.laborRatesData.find(o => o.laborType === i.laborTypeName)}
        //                         options={this.state.laborRatesData}
        //                         propName="laborType"
        //                     />
        //                 </td>
        //                 <td style={{ textAlign: 'center' }}><RIENumber
        //                     validate={this.isStringValidLabor}
        //                     activeClassName="form-control input-small"
        //                     classEditing="form-control input-small"
        //                     value={i.lHours > 0 ? (i.lHours.toString()) : '0'} propName="data"
        //                     change={this.updateLineItemsTable.bind(this, index, 'HOURS')}
        //                     style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
        //                 <td style={{ textAlign: 'center' }}>{i.lHoursExtended ? (i.lHoursExtended).toFixed(2) : '0'}</td>
        //                 <td style={{ textAlign: 'right' }}><RIENumber
        //                     validate={this.isStringValidNumber}
        //                     activeClassName="form-control input-small"
        //                     classEditing="form-control input-small"
        //                     value={i.lRate ? (i.lRate.toString()) : '0'} propName="data"
        //                     change={this.updateLineItemsTable.bind(this, index, 'RATE')}
        //                     style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
        //                 <td>
        //                     <span className="btn btn-icon-only red"
        //                         onClick={this.handleDelete.bind(this, index)}>
        //                         <i className="fa fa-trash-o"></i>
        //                     </span>
        //                 </td>
        //             </tr>)
        //         }
        //         else if (i.itemTypeId === 2) {
        //             return (<tr key={index} data-id={index}>
        //                 <td>{countLabor ? countLabor : ''}</td>
        //                 <td>
        //                     <b>Labor:</b><RIETextArea activeClassName="form-control input-small"
        //                         classEditing="form-control"
        //                         value={i.itemName ? i.itemName : 'NA'} propName="data"
        //                         change={this.updateDesc.bind(this, index, 'DESC')}
        //                     />
        //                 </td>
        //                 <td style={{ textAlign: 'center' }}><RIENumber
        //                     validate={this.isStringValidNumber}
        //                     activeClassName="form-control input-small"
        //                     classEditing="form-control input-xsmall"
        //                     value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
        //                     change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
        //                 <td className="unselectable">{''}</td>
        //                 <td>
        //                     <RIESelect
        //                         change={this.handleLaborChange.bind(this, index)}
        //                         value={this.state.laborRatesData.find(o => o.laborType === i.laborTypeName)}
        //                         options={this.state.laborRatesData}
        //                         propName="laborType"
        //                     />
        //                 </td>
        //                 <td style={{ textAlign: 'center' }}><RIENumber
        //                     validate={this.isStringValidLabor}
        //                     activeClassName="form-control input-small"
        //                     classEditing="form-control input-small"
        //                     value={i.lHours > 0 ? (i.lHours.toString()) : '0'} propName="data"
        //                     change={this.updateLineItemsTable.bind(this, index, 'HOURS')}
        //                     style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
        //                 <td style={{ textAlign: 'center' }}>{i.lHoursExtended ? (i.lHoursExtended).toFixed(2) : '0'}</td>
        //                 <td style={{ textAlign: 'right' }}><RIENumber
        //                     validate={this.isStringValidNumber}
        //                     activeClassName="form-control input-small"
        //                     classEditing="form-control input-small"
        //                     value={i.lRate ? (i.lRate.toString()) : '0'} propName="data"
        //                     change={this.updateLineItemsTable.bind(this, index, 'RATE')}
        //                     style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
        //                 <td>
        //                     <span className="btn btn-icon-only red"
        //                         onClick={this.handleDelete.bind(this, index)}>
        //                         <i className="fa fa-trash-o"></i>
        //                     </span>
        //                 </td>
        //             </tr>)
        //         }
        //         else if (i.itemTypeId === 3) {
        //             return (<tr key={index} data-id={index}>
        //                 <td>{countLabor ? countLabor : ''}</td>
        //                 <td>
        //                     <b>Shipping:</b><RIETextArea activeClassName="form-control input-small"
        //                         classEditing="form-control"
        //                         value={i.itemName ? i.itemName : 'NA'} propName="data"
        //                         change={this.updateDesc.bind(this, index, 'DESC')}
        //                     />
        //                 </td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td className="unselectable">{''}</td>
        //                 <td style={{ textAlign: 'right' }}>
        //                     {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
        //                 <td>
        //                     <span className="btn btn-icon-only red"
        //                         onClick={this.handleDelete.bind(this, index)}>
        //                         <i className="fa fa-trash-o"></i>
        //                     </span>
        //                 </td>
        //             </tr>)
        //         }
        //         else if (i.itemTypeId === 4) {
        //             return (
        //                 <tr key={index} data-id={index}>
        //                     <td className="unselectable-header" colSpan="11">{i.headerName}</td>
        //                     <td>
        //                         <span className="btn btn-icon-only red"
        //                             onClick={this.handleDelete.bind(this, index)}>
        //                             <i className="fa fa-trash-o"></i>
        //                         </span>
        //                     </td>
        //                 </tr>
        //             )
        //         }
        //     }.bind(this));


        // let sum = [];
        // clonedItemData.forEach(function (o) {
        //     let existing = sum.filter(function (i) {
        //         if (i.itemTypeId !== 3 && i.itemTypeId !== 4) {
        //             return i.laborTypeName === o.laborTypeName
        //         }
        //     })[0];
        //     if (!existing) {
        //         sum.push(o);
        //     }
        //     else {
        //         existing.lHours += o.lHours;
        //         existing.lExtended += o.lExtended;
        //     }
        // });

        // let totalHours = sum.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHours : prev, 0);
        // let totalRate = sum.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);

        // let laborTotalMore = sum.map(function (labor, index) {
        //     if (labor.itemTypeId !== 3 && labor.itemTypeId !== 4) {
        //         return <tr key={index}>
        //             <th colSpan="1" style={{ textAlign: 'right' }}>-{labor.laborTypeName}</th>
        //             <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((labor.lExtended).toFixed(2))}</td>
        //         </tr>
        //     }
        // }.bind(this));

        // let laborHoursMore = sum.map(function (labor, index) {
        //     if (labor.itemTypeId !== 3 && labor.itemTypeId !== 4) {
        //         return <tr key={index}>
        //             <th colSpan="1" style={{ textAlign: 'right' }}>-{labor.laborTypeName}</th>
        //             <td style={{ textAlign: 'right' }}>{labor.lHours}</td>
        //         </tr>
        //     }
        // }.bind(this));

        // let searchedItems = this.state.itemOptions
        //     .map(function (i, index) {
        //         return <tr key={index}>
        //             <td>{i.manufacturer ? i.manufacturer : '-'}</td>
        //             <td>{i.modal ? i.modal : '-'}</td>
        //             <td>{i.partNumber ? i.partNumber : '-'}</td>
        //             <td>{i.itemName ? i.itemName : '-'}</td>
        //             <td><button type="button" className="btn btn-xs green" onClick={this.handleItemSubmit.bind(this, index)}>Select item</button>
        //             </td>
        //         </tr>;
        //     }.bind(this));

        // let supplierData = this.state.supplierData
        //     .map(function (supplier, index) {
        //         return <tr key={index}>
        //             <td>{supplier.supplierName ? supplier.supplierName : '-'}</td>
        //             <td>{supplier.dealerPrice ? supplier.dealerPrice : '-'}</td>
        //             <td>{supplier.listPrice ? supplier.listPrice : '-'}</td>
        //             <td>{supplier.demoPrice ? supplier.demoPrice : '-'}</td>
        //             <td><button type="button" className="btn btn-xs green" onClick={this.handleLineItemAdd.bind(this, index, '')}>Select supplier</button>
        //             </td>
        //         </tr>;
        //     }.bind(this));

        let orderTypes = this.state.orderTypesData.map(function (order, index) {
            return <option value={order._id} key={index} >{order.orderTypeName}</option>;
        }.bind(this));

        let contractList = this
            .state
            .contractList
            .map(function (contract, index) {
                return <option value={contract._id} key={index} >{contract.orderContractName}</option>;
            }.bind(this));

        // let mfgList = this.state.manufacturerList.map(function (mfg) {
        //     return <li onClick={this.selectManufacturer.bind(this, mfg)}><a>{mfg}</a></li>
        // }.bind(this));

        return (
            <div>
                <div className="portlet-title tabbable-line">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#order-add" data-toggle="tab" onClick={this.setTab.bind(this, 'tab1')}>
                                Service Order
                            </a>
                        </li>
                        <li>
                            <a href="#order-moreinfo" data-toggle="tab" onClick={this.setTab.bind(this, 'tab2')}>
                                More Info
                            </a>
                        </li>
                        <div className="form-actions noborder text-right">
                            <Link to={"/order/" + this.props.params.orderId} className="btn red">
                                Cancel
                            </Link>&nbsp;&nbsp;
                            <button type="button" className="btn blue" onClick={this.orderHandler}>Save</button>
                        </div>
                    </ul>
                </div>
                <div className="portlet light bordered" id="create_order">
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="order-add">
                                <form role="form" id="createOrder">
                                    <div className="form-body">
                                        <div className="row">
                                            {/* <div className="col-md-12">
                                                    <div className="portlet-title">
                                                        <div className="caption">
                                                            <span className="caption-subject bold uppercase">General Details</span>
                                                        </div>
                                                    </div>
                                                </div> */}
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static italic">{orderDetailData ? orderDetailData.orderNumber : '-'}</div>
                                                    <label htmlFor="service_number">Service Order #</label>
                                                </div>
                                            </div>
                                            <div className="col-md-8 col-sm-8 col-xs-12">
                                                <div className="form-group form-md-floating-label" style={{ marginBottom: '28px' }}>
                                                    <label htmlFor="customer">Customer<span className="required">*</span>
                                                    </label>
                                                    <span className="pull-right">
                                                        <i
                                                            className="fa fa-plus-circle fa-2x"
                                                            aria-hidden="true"
                                                            onClick={this.handleNewCompanyModal.bind(this, 'CUSTOMER')}></i>
                                                    </span>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.companyValue}
                                                        placeholder="Customer"
                                                        name=""
                                                        options={this.state.companyOptions}
                                                        onFocus={this.clearIndividual}
                                                        onChange={this.handleCompanyChange}
                                                        onInputChange={this.onInputChange}
                                                        onBlur={this.handleSelectsBlur} />
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited"
                                                        key={orderDetailData ? orderDetailData.statusId : ''}
                                                        defaultValue={orderDetailData ? orderDetailData.statusId : ''}
                                                        ref="status"
                                                        id="form_control_1">
                                                        <option value="1">Open</option>
                                                        <option value="2">In-Progress</option>
                                                        <option value="3">Pending</option>
                                                        <option value="4">Work Completed</option>
                                                        <option value="5">Closed</option>
                                                        <option value="6">Cancelled</option>
                                                    </select>
                                                    <label htmlFor="form_control_1">Status</label>
                                                </div>
                                            </div>
                                            <div className="col-md-8 col-sm-8 col-xs-12">
                                                <div className="form-group form-md-floating-label" style={{ marginBottom: '28px' }}>
                                                    <label htmlFor="customer">Billing Company<span className="required">*</span>
                                                    </label>
                                                    <span className="pull-right">
                                                        <i
                                                            className="fa fa-plus-circle fa-2x"
                                                            aria-hidden="true"
                                                            onClick={this.handleNewCompanyModal.bind(this, 'BILLING')}></i>
                                                    </span>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.billingCompanyValue}
                                                        placeholder="Billing Company"
                                                        name=""
                                                        options={this.state.billingCompanyOptions}
                                                        onChange={this.handleBillingCompanyChange}
                                                        onInputChange={this.onBillingInputChange}
                                                        onBlur={this.handleSelectsBlur} />
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited"
                                                        key={orderDetailData.orderTypeId ? orderDetailData.orderTypeId._id : ''}
                                                        defaultValue={orderDetailData.orderTypeId && this.props.orderTypesData ? orderDetailData.orderTypeId._id : ''}
                                                        onChange={this.selectOtherType.bind(this, "Order Type")}
                                                        id="orderType"
                                                        name="orderType"
                                                        ref="orderType">
                                                        <option value="0"></option>
                                                        {orderTypes}
                                                    </select>
                                                    <label htmlFor="orderType">Order Type<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <input type="text" className="form-control" ref="title" name="title" key={orderDetailData ? orderDetailData.title : ''} defaultValue={orderDetailData ? orderDetailData.title : ''} />
                                                        <label htmlFor="title">Title<span className="required">*</span></label>
                                                    </div>
                                                </div> */}
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="customer">Assigned
                                                    </label>
                                                    <Select
                                                        multi
                                                        disabled={this.state.disabled}
                                                        value={this.state.assignValue}
                                                        placeholder="Assigned"
                                                        options={this.state.assignToOptions}
                                                        onChange={this.handleAssignOptions}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="estimated_close_date">Scheduled Date</label>
                                                    <DateRangePicker
                                                        showDropdowns={true}
                                                        singleDatePicker
                                                        minDate={moment()}
                                                        onApply={this.handleScheduledDate}>
                                                        <div className="input-group date form_datetime">
                                                            <input
                                                                type="text"
                                                                className="selected-date-range-btn"
                                                                size="16"
                                                                readOnly={true}
                                                                className="form-control"
                                                                defaultValue={this.state.scheduledDate}
                                                                key={this.state.scheduledDate}
                                                                id="scheduled_date" />
                                                            <span className="input-group-btn">
                                                                <button className="btn default date-set calendar-shadow-none" type="button">
                                                                    <i className="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </DateRangePicker>
                                                </div>
                                            </div>
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
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
                                                </div> */}
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-floating-label">
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
                                                </div> */}
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <select className="form-control edited"
                                                            key={orderDetailData.projectId ? orderDetailData.projectId._id : ''}
                                                            defaultValue={orderDetailData.projectId ? orderDetailData.projectId._id : ''}
                                                            ref="projectId"
                                                            name="projectId"
                                                            className="form-control">
                                                            <option value='0'>Select</option>
                                                            {projectData}
                                                        </select>
                                                        <label htmlFor="project">Project</label>
                                                    </div>
                                                </div> */}
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <select className="form-control edited"
                                                            key={orderDetailData.estimateId ? orderDetailData.estimateId._id : ''}
                                                            defaultValue={orderDetailData.estimateId ? orderDetailData.estimateId._id : ''}
                                                            ref="estimateId"
                                                            name="estimateId"
                                                            className="form-control">
                                                            <option value='0'>Select</option>
                                                            {estimateData}
                                                        </select>
                                                        <label htmlFor="estimate">Estimate #</label>
                                                    </div>
                                                </div> */}
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <select className="form-control edited"
                                                            key={orderDetailData ? orderDetailData.stageId : ''}
                                                            defaultValue={orderDetailData ? orderDetailData.stageId : ''}
                                                            ref="stage"
                                                            id="form_control_1">
                                                            <option value="1">Pre-Approved</option>
                                                            <option value="2">Approved</option>
                                                            <option value="3">In-Progress</option>
                                                            <option value="4">Dead</option>
                                                            <option value="5">In-Complete</option>
                                                            <option value="6">Complete</option>
                                                        </select>
                                                        <label htmlFor="form_control_1">Stage</label>
                                                    </div>
                                                </div> */}
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            className="form-control"
                                                            ref="defaultMarkup"
                                                            name="defaultMarkup"
                                                            value={this.state.defaultMarkup}
                                                            onBlur={this.handleGlobalMarkup}
                                                            onChange={this.onChangeGlobalMarkup}
                                                        />
                                                        <label htmlFor="defaultMarkup">Default Markup(%)</label>
                                                    </div>
                                                </div> */}
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            className="form-control"
                                                            ref="taxRate"
                                                            name="taxRate"
                                                            value={this.state.defaultTaxRate}
                                                            onChange={this.onChangeGlobalTaxRate}
                                                            onBlur={this.handleGlobalTaxRate} />
                                                        <label htmlFor="taxRate">Tax Rate(%)</label>
                                                    </div>
                                                </div> */}
                                            {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            className="form-control"
                                                            ref="estimatedDuration"
                                                            name="estimatedDuration"
                                                            key={orderDetailData ? orderDetailData.estimatedDuration : ''}
                                                            defaultValue={orderDetailData ? orderDetailData.estimatedDuration : ''}
                                                        />
                                                        <label htmlFor="taxRate">Estimated Duration(Hr)</label>
                                                    </div>
                                                </div> */}
                                            <div className="col-md-8 col-sm-8 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <TextareaAutosize style={{ resize: 'none' }} className="form-control" rows={5} ref="description" key={orderDetailData ? orderDetailData.descriptionWork : ''} defaultValue={orderDetailData ? orderDetailData.descriptionWork : ''} name="description"></TextareaAutosize>
                                                    <label htmlFor="description">Description of work<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <TextareaAutosize style={{ resize: 'none' }} className="form-control" rows={5} ref="serviceLocation" name="serviceLocation" key={orderDetailData ? orderDetailData.serviceLocation : ''} defaultValue={orderDetailData.serviceLocation ? orderDetailData.serviceLocation : ''}></TextareaAutosize>
                                                    <label htmlFor="serviceLocation">Service Location</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-4 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited"
                                                        onChange={this.selectOtherType.bind(this, "Contract")}
                                                        key={orderDetailData && orderDetailData.contractId ? orderDetailData.contractId._id : ''}
                                                        defaultValue={orderDetailData && this.props.contractList && orderDetailData.contractId ? orderDetailData.contractId._id : ''}
                                                        id="contract"
                                                        name="contract"
                                                        ref="contract">
                                                        <option value="0">Select</option>
                                                        {contractList}
                                                        <option value="other">Add Contract</option>
                                                    </select>
                                                    <label htmlFor="contract">Contract</label>
                                                </div>
                                            </div>
                                            <div className="col-md-8 col-sm-8 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <TextareaAutosize style={{ resize: 'none' }} className="form-control" rows={5} ref="workPerform" key={orderDetailData ? orderDetailData.workPerformed : ''} defaultValue={orderDetailData && orderDetailData.workPerformed ? orderDetailData.workPerformed : ''} name="workPerform"></TextareaAutosize>
                                                    <label htmlFor="workPerform">Work Performed</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                {/* <div className="portlet light portlet-fit portlet-datatable bordered">
                                    <div className="portlet light bordered">
                                        <div className="portlet-title tabbable-line">
                                            <div className="caption">
                                                <i className="icon-share font-dark"></i>
                                                <span className="caption-subject font-dark bold uppercase">Line Items</span>
                                            </div>
                                            {this.state.revisedItems.length != 0 ? <button
                                                className="btn green-haze btn-circle btn-sm pull-right"
                                                style={{ marginTop: '13px' }}>
                                                Export
                                        </button> : null}
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
                                                                    <tbody id="sortable">
                                                                        {itemTabData}
                                                                    </tbody>
                                                                    {this.state.itemPricedData.length != 0 ? <tfoot>
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
                                                                    </tfoot> : null}
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
                                                                            <th className="material" colSpan="8">Material</th>
                                                                            <th className="labor" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>Labor</th>
                                                                            <th className="rowtotal" rowSpan="2">Row Total</th>
                                                                            <th className="items" rowSpan="2"></th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="material">Tax</th>
                                                                            <th className="material">Our Cost</th>
                                                                            <th className="material">Our Cost Ext</th>
                                                                            <th className="material">Mark Up</th>
                                                                            <th className="material">Cost</th>
                                                                            <th className="material">Extended</th>
                                                                            <th className="material">Tax</th>
                                                                            <th className="material">Tax Extended</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="sortable1">
                                                                        {materialTabData}
                                                                    </tbody>
                                                                    {this.state.itemPricedData.length != 0 ? <tfoot>
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
                                                                    </tfoot> : null}
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
                                                                            <th className="labor" colSpan="6">Labor</th>
                                                                            <th className="rowtotal" rowSpan="2">Row Total</th>
                                                                            <th className="items" rowSpan="2"></th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="labor">Type</th>
                                                                            <th className="labor">Hrs</th>
                                                                            <th className="labor">Hrs Ext</th>
                                                                            <th className="labor">Rate</th>
                                                                            <th className="labor">Unit</th>
                                                                            <th className="labor">Extended</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="sortable2">
                                                                        {laborTabData}
                                                                    </tbody>
                                                                    {this.state.itemPricedData.length != 0 ? <tfoot>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'right' }}>
                                                                                {materialTotal ? '$' + validate.numberWithCommas((materialTotal).toFixed(2)) : '$' + 0}</td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'center' }}>
                                                                                {lHoursExtended ? (lHoursExtended.toFixed()) : ''}</td>
                                                                            <td style={{ textAlign: 'right' }}><span>
                                                                                {lRateTotal ? '$' + validate.numberWithCommas((lRateTotal).toFixed(2)) : '$' + 0}</span></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'right' }}><span>
                                                                                {lExtended ? '$' + validate.numberWithCommas((lExtended).toFixed(2)) : '$' + 0}</span></td>
                                                                            <td style={{ textAlign: 'right' }}><span>
                                                                                {grandTotal ? '$' + validate.numberWithCommas((grandTotal).toFixed(2)) : '$' + 0}</span></td>
                                                                            <td></td>
                                                                        </tr>
                                                                    </tfoot> : null}
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
                                        Total section starts
                                        {this.state.itemPricedData.length != 0 ? <div className="row">
                                            <div className="col-md-4">
                                                <table className="table table-striped table-bordered">
                                                    <caption className="font-dark bold uppercase">Material</caption>
                                                    <tbody>
                                                        <tr>
                                                            <th colSpan="1">Cost</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalCost).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Our Cost Ext Total</th>
                                                            <td style={{ textAlign: 'right' }}>${mOurCostExtTotal ? validate.numberWithCommas((mOurCostExtTotal).toFixed(2)) : 0}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Tax</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalTax).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Shipping</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalShipping).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Total</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((materialTotal).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Markup %</th>
                                                            <td style={{ textAlign: 'right' }}>{isNaN(markupPercent) ? 0 : (markupPercent).toFixed(2)}%</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Markup Total</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((markupTotal).toFixed(2))}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col-md-4">
                                                <table className="table table-striped table-bordered">
                                                    <caption className="font-dark bold uppercase">Labor</caption>
                                                    <tbody>
                                                        <tr>
                                                            <th colSpan="1">Total&nbsp;<span onClick={this.handleExpand.bind(this, 'TOTAL')} style={{ color: 'blue', cursor: 'pointer' }}>{this.state.expandTotal ? " (less...)" : "(more...)"}</span></th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalRate).toFixed(2))}</td>
                                                        </tr>
                                                        {this.state.expandTotal ? laborTotalMore : null}
                                                        <tr>
                                                            <th colSpan="1">Hours&nbsp;<span onClick={this.handleExpand.bind(this, 'HOURS')} style={{ color: 'blue', cursor: 'pointer' }}>{this.state.expandHours ? " (less...)" : "(more...)"}</span></th>
                                                            <td style={{ textAlign: 'right' }}>{totalHours}</td>
                                                        </tr>
                                                        {this.state.expandHours ? laborHoursMore : null}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col-md-4">
                                                <table className="table table-striped table-bordered">
                                                    <caption className="font-dark bold uppercase">Total</caption>
                                                    <tbody>
                                                        <tr>
                                                            <th colSpan="1">Material</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalCost).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Labor</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalRate).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Tax</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalTax).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Shipping</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalShipping).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="caption-subject font-dark bold uppercase" colSpan="1">Grand Total</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mExtendedTotal + totalRate + totalTax + totalShipping).toFixed(2))}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div> : null}
                                        Total section ends
                                    </div>
                                </div> */}
                            </div>
                            <div className="tab-pane" id="order-moreinfo">
                                <div className="portlet-title tabbable-line">
                                    <div className="caption">
                                        <span className="caption-subject font-dark bold uppercase">Other Details</span>
                                    </div>
                                </div>
                                <div className="portlet-body">
                                    <div className="tab-content">
                                        <form className="horizontal-form" id="createOrderMoreInfo">
                                            <div className="form-body">
                                                <div className="row">
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {orderDetailData ? orderDetailData.title : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Title</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {orderDetailData ? orderDetailData.createdBy : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Created By</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {orderDetailData.createdAt ? moment(orderDetailData.createdAt).format('LLL') : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">On</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {orderDetailData ? orderDetailData.orderNumber : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Order #</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {orderDetailData.modifiedBy ? orderDetailData.modifiedBy : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Modified By</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {orderDetailData.modifiedBy ? moment(orderDetailData.updatedAt).format('LLL') : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">On</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <label htmlFor="opportunity">Opportunity<span className="required">*</span>
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
                                                    {/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <label htmlFor="individual">Estimate #<span className="required">*</span></label>
                                                            <Select
                                                                disabled={this.state.disabled}
                                                                value={this.state.estimateValue}
                                                                name=""
                                                                id="estimate"
                                                                options={this.state.estimateOptions}
                                                                onChange={this.handleEstimateChange}
                                                                onInputChange={this.onEstimateInputChange}
                                                            />
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </div>

                                            <div className="portlet-title">
                                                <div className="caption">
                                                    <span className="caption-subject bold uppercase">Technician Info</span>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <input type="text" className="form-control" name="techName" ref="techName" key={orderDetailData.technicianName} defaultValue={orderDetailData && orderDetailData.technicianName ? orderDetailData.technicianName : ''} />
                                                        <label htmlFor="form_control_1">Name<span className="required">*</span></label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <InputMask
                                                            className="form-control"
                                                            id="techPhone"
                                                            ref="techPhone"
                                                            key={orderDetailData.phone}
                                                            defaultValue={orderDetailData && orderDetailData.phone ? orderDetailData.phone : ''}
                                                            name="techPhone" mask="(999) 999-9999" />
                                                        <label htmlFor="form_control_1">Phone<span className="required">*</span></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-floating-label">
                                                        <label htmlFor="startDate">Start Date/Time</label>
                                                        <DateRangePicker 
                                                        showDropdowns={true} 
                                                        startDate={this.state.startDate ? this.state.startDate : moment()} 
                                                        onApply={this.handleStartDate} 
                                                        timePicker={true} 
                                                        singleDatePicker>
                                                            <div className="input-group date form_datetime">
                                                                <input
                                                                    type="text"
                                                                    className="selected-date-range-btn"
                                                                    size="16"
                                                                    name="startDate"
                                                                    id="startDate"
                                                                    readOnly={true}
                                                                    className="form-control"
                                                                    defaultValue={this.state.startDate}
                                                                    key={this.state.startDate} />
                                                                <span className="input-group-btn">
                                                                    <button className="btn default date-set" type="button">
                                                                        <i className="fa fa-calendar"></i>
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </DateRangePicker>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-floating-label">
                                                        <label htmlFor="endDate">End Date/Time</label>
                                                        <DateRangePicker 
                                                        showDropdowns={true} 
                                                        startDate={this.state.endDate ? this.state.endDate : moment()} 
                                                        onApply={this.handleEndDate} 
                                                        timePicker={true} 
                                                        singleDatePicker>
                                                            <div className="input-group date form_datetime">
                                                                <input
                                                                    type="text"
                                                                    className="selected-date-range-btn"
                                                                    size="16"
                                                                    name="endDate"
                                                                    id="endDate"
                                                                    readOnly={true}
                                                                    className="form-control"
                                                                    defaultValue={this.state.endDate}
                                                                    key={this.state.endDate}/>
                                                                <span className="input-group-btn">
                                                                    <button className="btn default date-set" type="button">
                                                                        <i className="fa fa-calendar"></i>
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </DateRangePicker>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <textarea className="form-control" name="notes" ref="notes" key={orderDetailData.notes} defaultValue={orderDetailData && orderDetailData.notes ? orderDetailData.notes : ''} rows={1}></textarea>
                                                        <label htmlFor="form_control_1">Notes<span className="required">*</span></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div
                                id="select-addType"
                                className="modal fade bs-modal-sm"
                                tabIndex="-1"
                                aria-hidden="true">
                                <div className="modal-dialog modal-sm">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="actions">
                                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                                                <h5 className="modal-title">Add {this.state.addType}</h5>
                                            </div>
                                        </div>
                                        <div className="modal-body">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="add_value"
                                                name="add_value"
                                                ref="add_value"
                                                defaultValue="" />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
                                            <button
                                                type="button"
                                                data-dismiss="modal"
                                                className="btn green"
                                                id="send-invite-button"
                                                onClick={this.handleAddOtherPopup}>Done</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <AddMaterial
                                materialAddId="lineitem_add"
                                onItemInputChange={this.onItemInputChange}
                                itemOptions={this.state.itemOptions}
                                searchedItems={searchedItems}
                                handlePopUpClose={this.handlePopUpClose.bind(this, 'item')}
                                createItemHandler={this.createItemHandler.bind(this, 'item')} /> */}

                            {/* <AddHeader ref="head_txt" headerAddId="subheader_add" handleHeaderAdd={this.handleHeaderAdd} /> */}

                            {/* <AddShipping ref="ship_desc" shippingAddId="shipping_add" handleShippingAdd={this.handleShippingAdd} /> */}

                            {/* <AddLabor ref="labr_desc" laborAddId="labor_add" handleLaborAdd={this.handleLaborAdd} /> */}

                            {/* <div id="supplier_add" className="modal fade" tabIndex="-1" aria-hidden="true">
                                <div className="modal-dialog ">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="caption">
                                                <span className="caption-subject bold uppercase">Select Supplier</span>
                                            </div>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="table-container table-responsive" style={{ height: "150px", overflow: "auto" }}>
                                                        <table className="table table-striped table-bordered">
                                                            <thead >
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Dealer Price</th>
                                                                    <th>List Price</th>
                                                                    <th>Demo Price</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {supplierData}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn dark btn-outline"
                                                onClick={this.handlePopUpClose.bind(this, 'supplier')}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div id="add-signature" className="modal fade" tabIndex="-1" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="caption">
                                                <span className="caption-subject bold uppercase">Add Technician Signature</span>
                                            </div>
                                        </div>
                                        <div className="modal-body">
                                            {orderDetailData ? <SignaturePad
                                                className="wrapperPad"
                                                width={570} height={200}
                                                ref="signatureboard" /> : null}
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn dark btn-outline" onClick={this.clearSignature}>Clear</button>
                                            <button
                                                type="button"
                                                className="btn green"
                                                onClick={this.handleSignature}>Save</button>
                                            <button
                                                type="button"
                                                className="btn dark btn-outline" data-dismiss="modal" onClick={this.clearSignature}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <AddItemModal
                                mfgList={mfgList}
                                onInputChange={this.getManufacturerList}
                                manufacturerValue={this.state.manufacturerValue}
                                itemModalId="add_item"
                                addItemHandler={this.addItemHandler}
                                handlePopUpClose={this.handlePopUpClose.bind(this, 'newItem')}
                                ref="itemEstimate" /> */}
                            {/* <DeleteModal deleteModalId="lineItem_delete" deleteUserHandler={this.deletePricedItem} /> */}
                            {/* <ConfirmationModal
                                confirmationId="confirm_id"
                                confirmationTitle=""
                                confirmationText="Are you sure you want to create a new item in the database ?"
                                confirmationHandler={this.confirmationHandler} /> */}
                        </div>
                    </div>
                    <AddCompanyModal
                        addCompanyModalId="add-company"
                        companyAddhandler={this.handleCompanyAdd}
                        ref='companyChild'
                        customerValue={this.state.customerValue}
                        customerOptions={this.state.companyOptions}
                        handleCustomerChange={this.handleCustomerChange}
                        handleSelectsBlur={this.handleSelectsBlur}
                        onCompanyInputChange={this.onCompanyInputChange}
                    />
                </div>
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return {
        companyList: state.serviceOrder.companyList,
        itemList: state.serviceOrder.itemList,
        itemDetail: state.serviceOrder.itemDetailData,
        salesRepList: state.serviceOrder.salesRepList,
        podata: state.serviceOrder.poList,
        orderDetail: state.serviceOrder.orderDetails,
        opportunityList: state.serviceOrder.opportunityList,
        estimateList: state.serviceOrder.estimateList,
        contactDetails: state.serviceOrder.contactDetails,
        orderTypesData: state.serviceOrder.orderTypesData,
        billingCompanyList: state.serviceOrder.billingCompanyList,
        laborRates: state.serviceOrder.laborRates,
        newCreatedItem: state.serviceOrder.newCreatedItem,
        ManufacturerList: state.serviceOrder.manufacturerList,
        usersData: state.serviceOrder.usersList,
        estimateData: state.serviceOrder.estimateList,
        projectData: state.serviceOrder.projectList,
        contractList: state.serviceOrder.contractList,
        companyCreated: state.estimate.companyCreated,
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
        orderAction: bindActionCreators(orderActions, dispatch),
        proposalactions: bindActionCreators(proposalActions, dispatch),
        userAction: bindActionCreators(userAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(EditOrder);