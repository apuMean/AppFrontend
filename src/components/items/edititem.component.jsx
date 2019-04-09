import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import * as loader from '../../constants/actionTypes.js';
import * as appValid from '../../scripts/app';
import * as itemAction from '../../actions/itemAction.js';
import moment from 'moment';
import TextareaAutosize from 'react-autosize-textarea';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jQuery from 'jquery';
import autoBind from 'react-autobind';
import Select from 'react-select';
import SingleInput from '../shared/SingleInput';
import SingleSelect from '../shared/SingleSelect';
import * as documentAction from '../../actions/documentActions';
import "../../styles/bootstrap-fileinput.css";
import * as layout from '../../scripts/app';
import * as functions from '../common/functions';
import { isValidImage } from '../shared/isValidImage';
import AddSupplierModal from './../common/addSupplierModal';
import * as message from '../../constants/messageConstants';

class ItemEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            itemDetail: '',
            projectValue: '',
            activeTabName: 'tab1',
            projectOptions: [],
            priceScheduleDetails: [],
            supplierDetails: [],
            itemStateData: '',
            updateSupplierIndex: -1,
            relatedItemOptions: [],
            relatedItemValue: '',
            alternativeItemOptions: [],
            alternativeItemValue: '',
            replacementItemOptions: [],
            replacementItemValue: '',
            priceDateDisplay: '',
            locale: {
                'format': 'MM-DD-YYYY'
            },
            imagePath: '',
            imageChange: false,
            breadcrumb: true,
            headerText: '',
            priceScheduleIndex: ''

        }
        autoBind(this);
    }

    componentWillMount() {
        var data = {
            companyId: localStorage.companyId
        }

        var itemId = {
            itemId: this.props.params.materialId
        }

        this
            .props
            .actions
            .getItemDetailValues(itemId);
    }

    componentDidMount() {
        appValid
            .FormValidationMd
            .init();
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
        functions.showLoader('update_item');
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        let project = [];
        let relatedItem = [];
        let alternativeItem = [];
        let replacementItem = [];
        var projectList = nextProps
            .projectList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.title
                }
                project.push(obj)
            }.bind(this));

        if (nextProps.itemDetail && !this.state.imageChange) {
            let itemData = JSON.parse(JSON.stringify(nextProps.itemDetail.item));
            if (this.state.breadcrumb && itemData.modal) {
                var data = {
                    parent: <Link to='/material'>Materials</Link>,
                    childone: itemData.modal,
                    childtwo: ''
                };
                this.props.breadCrumb(data);
                this.state.breadcrumb = false;
            }
            let supplierData = nextProps.itemDetail.supplierdata ? JSON.parse(JSON.stringify(nextProps.itemDetail.supplierdata)) : [];
            this.setState({
                itemStateData: itemData,
                supplierDetails: supplierData,
                imagePath: itemData.itemImage ? itemData.itemImage : ''
            });
            if (itemData.relatedItems.length != 0) {
                this.setState({ relatedItemValue: itemData.relatedItems })
            }
            if (itemData.alternativeItems.length != 0) {
                this.setState({ alternativeItemValue: itemData.alternativeItems })
            }
            if (itemData.replacementItems.length != 0) {
                this.setState({ replacementItemValue: itemData.replacementItems })
            }
        } else {
            this.setState({ itemStateData: this.state.itemStateData })
        }

        if (nextProps.imagePath && this.state.imageChange) {
            this.setState({ imagePath: nextProps.imagePath })
        } else if (!nextProps.imagePath && this.state.imageChange) {
            this.setState({ imagePath: '' })
        }

        if (nextProps.itemListRelated.length != 0) {
            var itemList = nextProps
                .itemListRelated
                .map(function (list, index) {
                    var obj = {
                        value: list._id,
                        label: list.itemName
                    }
                    relatedItem.push(obj)
                }.bind(this));
            this.setState({
                relatedItemOptions: relatedItem
            })
        }

        if (nextProps.itemListAlternative.length != 0) {
            var itemList = nextProps
                .itemListAlternative
                .map(function (list, index) {
                    var obj = {
                        value: list._id,
                        label: list.itemName
                    }
                    alternativeItem.push(obj)
                }.bind(this));
            this.setState({
                alternativeItemOptions: alternativeItem
            })
        }

        if (nextProps.itemListReplacement.length != 0) {
            var itemList = nextProps
                .itemListReplacement
                .map(function (list, index) {
                    var obj = {
                        value: list._id,
                        label: list.itemName
                    }
                    replacementItem.push(obj)
                }.bind(this));
            this.setState({
                replacementItemOptions: replacementItem
            })
        }

        var tool = '';
        if (nextProps.itemDetail.item && nextProps.itemDetail.item.toolsId) {
            tool = {
                id: nextProps.itemDetail.item.toolsId._id,
                label: nextProps.itemDetail.item.toolsId.title
            }
        } else {
            tool = ''
        }

        this.setState({ projectOptions: project, projectValue: tool });
        const el = ReactDOM.findDOMNode(self.refs.update_item);

        setTimeout(function () {
            layout.FloatLabel.init();
            layout.FormValidationMd.init();
            $(el).unblock();
        }, 400);

    }

    handleRelatedItemChange(value) {
        this.setState({ relatedItemValue: value })
    }

    onRelatedItemInputChange(value) {
        var data = {
            itemName: value,
            companyId: localStorage.companyId
        }
        this.props.actions.getRelatedItem(data)
    }

    handleAlternativeItemChange(value) {
        this.setState({ alternativeItemValue: value })
    }

    onAlternativeItemInputChange(value) {
        var data = {
            itemName: value,
            companyId: localStorage.companyId
        }
        this.props.actions.getAlternativeItem(data)
    }

    handleReplacementItemChange(value) {
        this.setState({ replacementItemValue: value })
    }

    onReplacementItemInputChange(value) {
        var data = {
            itemName: value,
            companyId: localStorage.companyId
        }
        this.props.actions.getReplacementItem(data)
    }

    setTab(tabName) {
        if (tabName) {
            this.setState({ activeTabName: tabName });
        }
    }

    onInputProjectChange(value) {
        var data = {
            title: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .proActions
            .getProjectData(data);
    }

    handleProjectChange(value) {
        this.setState({ projectValue: value });
        var obj = {
            toolsId: value ? value.id : '',
            itemId: this.props.params.materialId
        }
        this
            .props
            .actions
            .updateTool(obj);
    }

    itemHandler() {
        toastr.remove();
        if (jQuery('#createItem').valid()) {
            if (this.state.supplierDetails.length !== 0) {
                var itemDetails = {
                    companyId: localStorage.companyId,
                    itemId: this.props.params.materialId,
                    itemName: ReactDOM
                        .findDOMNode(this.refs.item_name.refs.item_name)
                        .value,
                    modal: ReactDOM
                        .findDOMNode(this.refs.item_modalNo.refs.item_modalNo)
                        .value,
                    partNumber: ReactDOM
                        .findDOMNode(this.refs.item_partNo.refs.item_partNo)
                        .value,
                    itemCategory: ReactDOM
                        .findDOMNode(this.refs.category.refs.category)
                        .value,
                    series: ReactDOM
                        .findDOMNode(this.refs.series.refs.series)
                        .value,
                    manufacturer: ReactDOM
                        .findDOMNode(this.refs.item_manufacturer.refs.item_manufacturer)
                        .value,
                    description: ReactDOM
                        .findDOMNode(this.refs.item_description)
                        .value,
                    notes: ReactDOM
                        .findDOMNode(this.refs.item_notes)
                        .value,
                    labourHours: ReactDOM
                        .findDOMNode(this.refs.labourHrs.refs.labourHrs)
                        .value,
                    itemStatus: ReactDOM
                        .findDOMNode(this.refs.status)
                        .value,
                    suppliers: this.state.supplierDetails,
                    mfgUrl: ReactDOM.findDOMNode(this.refs.mfgUrl.refs.mfgUrl).value,
                    manufactureWarranty: ReactDOM.findDOMNode(this.refs.mfgWarranty.refs.mfgWarranty).value,
                    relatedItems: this.state.relatedItemValue,
                    alternativeItems: this.state.alternativeItemValue,
                    replacementItems: this.state.replacementItemValue,
                    modifiedBy: localStorage.userName
                }
                var picData = ReactDOM
                    .findDOMNode(this.refs.itemFileUpload)
                    .files[0];
                this.props.actions.updateItem(itemDetails, picData, this.props.params.materialId);
                functions.showLoader('update_item');
            }
            else {
                toastr.error(message.MIN_SUPPLIER)
            }
        }
    }

    addPriceSchedule() {
        toastr.remove();
        let supplierData = {
            supplierName: ReactDOM.findDOMNode(this.refs.sup_add.refs.supplierName.refs.supplierName).value,
            listPrice: (ReactDOM.findDOMNode(this.refs.sup_add.refs.listPrice.inputElement).value).replace(/[^0-9.]/g, ''),
            dealerPrice: (ReactDOM.findDOMNode(this.refs.sup_add.refs.dealerPrice.inputElement).value).replace(/[^0-9.]/g, ''),
        }
        let data = {
            startQty: ReactDOM.findDOMNode(this.refs.sup_add.refs.startQty.refs.startQty).value.trim(),
            endQty: ReactDOM.findDOMNode(this.refs.sup_add.refs.endQty.refs.endQty).value.trim(),
            price: (ReactDOM.findDOMNode(this.refs.sup_add.refs.price.inputElement).value.trim()).replace(/[^0-9.]/g, '')
        };
        if (supplierData.supplierName !== '' && supplierData.listPrice !== '' && supplierData.dealerPrice !== '') {
            if (data.startQty == '') {
                toastr.error(message.START_QTY);
            }
            else if (data.startQty < 1) {
                toastr.error(message.START_QTY_GREATER);
            }
            else if (data.endQty == '') {
                toastr.error(message.END_QTY);
            }
            else if (data.endQty < 1) {
                toastr.error(message.END_QTY_GREATER);
            }
            else if (data.price == '') {
                toastr.error(message.REQUIRED_PRICE);
            }
            else if (data.price < 1) {
                toastr.error(message.PRICE_GREATER);
            }
            else if(data.startQty > data.endQty){
                toastr.error("End Quantity must be Greater than Start Quantity")
            }
            else {
                if (this.state.priceScheduleIndex !== "") {
                    var priceSchedule = this.state.priceScheduleDetails[this.state.priceScheduleIndex];
                    priceSchedule.startQty = data.startQty;
                    priceSchedule.endQty = data.endQty;
                    priceSchedule.price = data.price;
                    this.setState({ priceScheduleDetails: this.state.priceScheduleDetails, priceScheduleIndex: '' })
                } else {
                    this.state.priceScheduleDetails.push(data);
                    var updatedData = this.state.priceScheduleDetails;
                    this.setState({ priceScheduleDetails: updatedData });
                }
                ReactDOM.findDOMNode(this.refs.sup_add.refs.startQty.refs.startQty).value = "";
                ReactDOM.findDOMNode(this.refs.sup_add.refs.endQty.refs.endQty).value = "";
                ReactDOM.findDOMNode(this.refs.sup_add.refs.price.inputElement).value = "";
            }
        }
        else {
            toastr.error(message.REQUIRED_SUPPLIER_DETAILS)
        }
    }

    addSupplier(e) {
        // debugger
        toastr.remove();
        e.preventDefault();
        let data = {
            supplierName: ReactDOM.findDOMNode(this.refs.sup_add.refs.supplierName.refs.supplierName).value,
            listPrice: (ReactDOM.findDOMNode(this.refs.sup_add.refs.listPrice.inputElement).value).replace(/[^0-9.]/g, ''),
            dealerPrice: (ReactDOM.findDOMNode(this.refs.sup_add.refs.dealerPrice.inputElement).value).replace(/[^0-9.]/g, ''),
            demoPrice: (ReactDOM.findDOMNode(this.refs.sup_add.refs.demoPrice.inputElement).value).replace(/[^0-9.]/g, ''),
            priceDate: this.state.priceDateDisplay,
            leadTimedays: parseInt(ReactDOM.findDOMNode(this.refs.sup_add.refs.leadTimeDays.refs.leadTimeDays).value),
            supplySource: ReactDOM.findDOMNode(this.refs.sup_add.refs.supplySource).value,
            priceSchedule: this.state.priceScheduleDetails
        }

        if (data.supplierName.trim() == '') {
            toastr.error('Please enter supplier name.');
        } else if (data.listPrice == '') {
            toastr.error('Please enter list price.');
        } else if (data.listPrice < 1) {
            toastr.error('List price should be greater than 0.');
        } else if (data.dealerPrice == '') {
            toastr.error('Please enter dealer price.');
        } else if (data.dealerPrice < 1) {
            toastr.error('Dealer price should be greater than 0.');
        } else if (data.demoPrice && (data.demoPrice < 1)) {
            toastr.error('Demo price should be greater than 0.');
        } else if (data.leadTimedays && (data.leadTimedays < 1)) {
            toastr.error('Lead time days should be greater than 0.');
        }else if(data.startQty > data.endQty){
            toastr.error("End Quantity must be Greater than Start Quantity")
        }
        else {
            if (this.state.updateSupplierIndex > -1) {
                const newSupplierArray = this.state.supplierDetails;
                newSupplierArray[this.state.updateSupplierIndex] = data;
                this.setState({
                    supplierDetails: newSupplierArray,
                    updateSupplierIndex: -1,
                    priceScheduleDetails: [],
                    priceDateDisplay: ''
                });
            }
            else {
                this.state.supplierDetails.push(data);
                var updatedData = this.state.supplierDetails;
                this.setState({
                    supplierDetails: updatedData,
                    priceDateDisplay: ''
                });
                this.setState({ priceScheduleDetails: [] })
                layout.FloatLabel.init();
            }
            let el = ReactDOM.findDOMNode(this.refs.sup_add);
            $(el).modal('hide');
        }
    }

    removePriceSchedule(index) {
        var priceSchedule = this.state.priceScheduleDetails[index];
        this.setState({ currentRecordState: priceSchedule })
        this.state.priceScheduleDetails.splice(index, 1);
        this.setState({
            priceScheduleDetails: this.state.priceScheduleDetails
        });
    }

    editPriceSchedule(index) {
        var priceSchedule = this.state.priceScheduleDetails[index];
        this.setState({ priceScheduleIndex: index })
        ReactDOM.findDOMNode(this.refs.sup_add.refs.startQty.refs.startQty).value = priceSchedule.startQty;
        ReactDOM.findDOMNode(this.refs.sup_add.refs.endQty.refs.endQty).value = priceSchedule.endQty;
        ReactDOM.findDOMNode(this.refs.sup_add.refs.price.refs.price).value = priceSchedule.price;
        setTimeout(function () {
            layout.FloatLabel.init();
        }, 400);
    }

    removeSupplier(index) {
        var supplierData = this.state.supplierDetails[index];
        this.setState({ currentRecordState: supplierData })
        this.state.supplierDetails.splice(index, 1);
        this.setState({
            supplierDetails: this.state.supplierDetails
        });
    }

    editSupplier(index) {
        let currentSupplierData = this.state.supplierDetails[index];
        this.setState({
            updateSupplierIndex: index,
            priceDateDisplay: currentSupplierData.priceDate ? currentSupplierData.priceDate : '',
            headerText: "Update Supplier"
        });
        ReactDOM.findDOMNode(this.refs.sup_add.refs.supplierName.refs.supplierName).value = currentSupplierData.supplierName ? currentSupplierData.supplierName : '';
        ReactDOM.findDOMNode(this.refs.sup_add.refs.listPrice.inputElement).value = currentSupplierData.listPrice ? currentSupplierData.listPrice : '';
        ReactDOM.findDOMNode(this.refs.sup_add.refs.dealerPrice.inputElement).value = currentSupplierData.dealerPrice ? currentSupplierData.dealerPrice : '';
        ReactDOM.findDOMNode(this.refs.sup_add.refs.demoPrice.inputElement).value = currentSupplierData.demoPrice ? currentSupplierData.demoPrice : '';
        ReactDOM.findDOMNode(this.refs.sup_add.refs.leadTimeDays.refs.leadTimeDays).value = currentSupplierData.leadTimedays ? currentSupplierData.leadTimedays : '';
        ReactDOM.findDOMNode(this.refs.sup_add.refs.supplySource).value = currentSupplierData.supplySource ? currentSupplierData.supplySource : 'Retail';

        if (currentSupplierData.priceSchedule.length != 0) {
            this.setState({ priceScheduleDetails: currentSupplierData.priceSchedule });
        } else {
            this.setState({ priceScheduleDetails: [] });
        }
        setTimeout(function () {
            layout.FloatLabel.init();
        }, 400);

        let el = ReactDOM.findDOMNode(this.refs.sup_add);
        $(el).modal('show');
    }

    cancelEdit() {
        ReactDOM.findDOMNode(this.refs.sup_add.refs.supplierName.refs.supplierName).value = '';
        ReactDOM.findDOMNode(this.refs.sup_add.refs.listPrice.inputElement).value = '';
        ReactDOM.findDOMNode(this.refs.sup_add.refs.dealerPrice.inputElement).value = '';
        ReactDOM.findDOMNode(this.refs.sup_add.refs.demoPrice.inputElement).value = '';
        ReactDOM.findDOMNode(this.refs.sup_add.refs.leadTimeDays.refs.leadTimeDays).value = '';
        ReactDOM.findDOMNode(this.refs.sup_add.refs.supplySource).value = 'Retail';

        ReactDOM.findDOMNode(this.refs.sup_add.refs.startQty.refs.startQty).value = "";
        ReactDOM.findDOMNode(this.refs.sup_add.refs.endQty.refs.endQty).value = "";
        ReactDOM.findDOMNode(this.refs.sup_add.refs.price.refs.price).value = "";
        this.setState({
            priceScheduleDetails: [],
            updateSupplierIndex: -1,
            priceDateDisplay: '',
            headerText: "Add Supplier"
        });
    }

    handlePriceDateEvent(event, picker) {
        var displayDate = picker.startDate.format('MM/DD/YYYY');
        this.setState({ priceDateDisplay: displayDate });
        layout.FloatLabel.init();
    }

    imageUpdateHandler(event) {
        this.state.imageChange = true;
        let materialId;
        let fileData;
        if (event.target.value) {
            materialId = this.props.params.materialId;
            fileData = ReactDOM.findDOMNode(this.refs.itemFileUpload).files[0];
            if (!isValidImage(fileData.name)) {
                materialId = '';
            }
        }
        else {
            materialId = '';
        }
        if (materialId) {
            this.props.actions.updateMaterialPicture(fileData, materialId);
        }
    }

    imageRemoveHandler() {
        this.state.imageChange = true;
        if (this.state.imagePath) {
            let data = {
                itemId: this.props.params.materialId
            }
            this.props.actions.removeMaterialPicture(data);
        }
    }

    handleSupplierModal(e) {
        e.preventDefault();
        let el = ReactDOM.findDOMNode(this.refs.sup_add);
        $(el).modal('show');
        this.cancelEdit();
    }

    render() {
        let itemData = this.state.itemStateData;
        let supplierData = this.state.supplierDetails.map(function (supplier, index) {
            return <tr key={index}>
                <td>{supplier.supplierName ? supplier.supplierName : '-'}</td>
                <td>{supplier.listPrice ? '$' + supplier.listPrice : '-'}</td>
                <td>{supplier.dealerPrice ? '$' + supplier.dealerPrice : '-'}</td>
                <td>{supplier.demoPrice ? '$' + supplier.demoPrice : '-'}</td>
                <td>{supplier.leadTimedays ? supplier.leadTimedays : '-'}</td>
                <td>{supplier.priceDate ? moment(supplier.priceDate).format('LLL') : '-'}</td>
                <td>{supplier.supplySource ? supplier.supplySource : '-'}</td>
                <td>
                    <span className="btn btn-icon-only purple" onClick={this.editSupplier.bind(this, index)}><i className="fa fa-pencil" ></i></span>&nbsp;&nbsp;&nbsp;
                    <span className="btn btn-icon-only red" onClick={this.removeSupplier.bind(this, index)}><i className="fa fa-trash-o" ></i></span>
                </td>
            </tr>;
        }.bind(this));

        let priceScheduleData = this
            .state
            .priceScheduleDetails
            .map(function (schedule, index) {
                return <tr key={index}>
                    <td>{schedule.startQty}</td>
                    <td>{schedule.endQty}</td>
                    <td>{schedule.price}</td>
                    <td>
                        <span className="btn btn-icon-only purple" onClick={this.editPriceSchedule.bind(this, index)}><i className="fa fa-pencil" ></i></span>&nbsp;&nbsp;&nbsp;
                        <span className="btn btn-icon-only red" onClick={this.removePriceSchedule.bind(this, index)}><i className="fa fa-trash-o" ></i></span>
                    </td>
                </tr>;
            }.bind(this));

        return (
            <div>
                <div>
                    <div className="portlet-title tabbable-line">
                        <ul className="nav nav-tabs">
                            <li className="active">
                                <a href="#item-add" data-toggle="tab" onClick={this.setTab.bind(this, 'tab1')}>
                                    Material
                                        </a>
                            </li>
                            <li>
                                <a href="#item-moreinfo" data-toggle="tab" onClick={this.setTab.bind(this, 'tabOther')}>
                                    More Info
                                        </a>
                            </li>
                            <li>
                                <a href="#item-tools" data-toggle="tab" onClick={this.setTab.bind(this, 'tabOther')}>
                                    Tools
                                        </a>
                            </li>
                            <div className="form-actions noborder text-right">
                                <Link to={"/material/" + this.props.params.materialId} className="btn red">
                                    Cancel
                                    </Link>&nbsp;&nbsp;
                                 {this.state.activeTabName == "tab1" ? <button type="button" className="btn blue" onClick={this.itemHandler}>Save</button> : ''}
                            </div>
                        </ul>
                    </div>
                    <div className="portlet light bordered" id="update_item" ref="update_item">
                        <div className="portlet-body">
                            <div className="tab-content">
                                <div className="tab-pane active" id="item-add">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <span className="caption-subject bold uppercase">General Details</span>
                                        </div>
                                    </div>
                                    <form role="form" id="createItem">
                                        <div className="form-body">
                                            <div className="row">
                                                <div className="col-md-9" style={{ marginLeft: '-15px' }}>
                                                    <div className="col-md-6">
                                                        <SingleInput
                                                            inputType="text"
                                                            parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                            className="form-control"
                                                            title="Name"
                                                            name="item_name"
                                                            htmlFor="item_name"
                                                            defaultValue={itemData.itemName ? itemData.itemName : ''}
                                                            key={itemData.itemName}
                                                            required={true}
                                                            ref={'item_name'}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <SingleInput
                                                            inputType="text"
                                                            parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                            className="form-control"
                                                            title="Model No"
                                                            name="item_modalNo"
                                                            htmlFor="item_modalNo"
                                                            defaultValue={itemData.modal ? itemData.modal : ''}
                                                            key={itemData.modal}
                                                            required={true}
                                                            ref={'item_modalNo'}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <SingleInput
                                                            inputType="text"
                                                            parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                            className="form-control"
                                                            title="Part No"
                                                            name="item_partNo"
                                                            htmlFor="item_partNo"
                                                            defaultValue={itemData.partNumber ? itemData.partNumber : ''}
                                                            key={itemData.partNumber}
                                                            required={false}
                                                            ref={'item_partNo'}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <SingleInput
                                                            inputType="text"
                                                            parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                            className="form-control"
                                                            title="Mfg"
                                                            name="item_manufacturer"
                                                            htmlFor="item_manufacturer"
                                                            defaultValue={itemData.manufacturer ? itemData.manufacturer : ''}
                                                            key={itemData.manufacturer}
                                                            required={true}
                                                            ref={'item_manufacturer'}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <SingleInput
                                                            inputType="text"
                                                            parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                            className="form-control"
                                                            title="Category"
                                                            name="category"
                                                            htmlFor="category"
                                                            defaultValue={itemData.itemCategory ? itemData.itemCategory : ''}
                                                            key={itemData.itemCategory}
                                                            required={false}
                                                            ref={'category'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="fileinput fileinput-exists" data-provides="fileinput">
                                                            <div
                                                                className="fileinput-preview thumbnail"
                                                                data-trigger="fileinput"
                                                                style={{
                                                                    width: 200,
                                                                    height: 150
                                                                }}>
                                                                <img
                                                                    src={this.state.imagePath ? this.state.imagePath : require('../../img/itemlogo.png')}
                                                                    className="img-responsive"
                                                                    alt="Logo" />
                                                            </div>
                                                            <div>
                                                                <span className="btn red btn-sm btn-outline btn-file">
                                                                    <span className="fileinput-new">
                                                                        Select
                                                                </span>
                                                                    <span className="fileinput-exists">
                                                                        Change
                                                                </span>
                                                                    <input type="hidden" />
                                                                    <input
                                                                        type="file"
                                                                        name="itemFileUpload"
                                                                        ref="itemFileUpload"
                                                                        id="itemFileUpload"
                                                                        accept='image/*'
                                                                        onChange={this.imageUpdateHandler} />
                                                                </span>
                                                                {this.state.imagePath ? <a
                                                                    href="javascript:;"
                                                                    className="btn red btn-sm"
                                                                    onClick={this.imageRemoveHandler}>
                                                                    Remove
                                                            </a> : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <SingleInput
                                                        inputType="number"
                                                        min={0}
                                                        parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                        className="form-control"
                                                        title="Labor Hrs"
                                                        name="labourHrs"
                                                        htmlFor="labourHrs"
                                                        defaultValue={itemData.labourHour ? itemData.labourHour : ''}
                                                        key={itemData.labourHour}
                                                        required={false}
                                                        ref={'labourHrs'}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <SingleInput
                                                        inputType="text"
                                                        parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                        className="form-control"
                                                        title="Manufacture Warranty"
                                                        name="mfgWarranty"
                                                        htmlFor="mfgWarranty"
                                                        defaultValue={itemData.manufactureWarranty ? itemData.manufactureWarranty : ''}
                                                        key={itemData.manufactureWarranty}
                                                        required={false}
                                                        ref={'mfgWarranty'}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <SingleInput
                                                        inputType="text"
                                                        parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                        className="form-control"
                                                        title="Series"
                                                        name="series"
                                                        htmlFor="series"
                                                        defaultValue={itemData.series ? itemData.series : ''}
                                                        key={itemData.series}
                                                        required={false}
                                                        ref={'series'}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <TextareaAutosize
                                                            style={{ resize: 'none' }}
                                                            type="text"
                                                            className="form-control"
                                                            ref="item_description"
                                                            name="item_description"
                                                            defaultValue={itemData.description ? itemData.description : ''}
                                                            key={itemData.description}
                                                            rows={3}>
                                                        </TextareaAutosize>
                                                        <label htmlFor="item_description">Description</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <TextareaAutosize
                                                            style={{ resize: 'none' }}
                                                            type="text"
                                                            className="form-control"
                                                            ref="item_notes"
                                                            name="item_notes"
                                                            defaultValue={itemData.notes ? itemData.notes : ''}
                                                            key={itemData.notes}
                                                            rows={3}></TextareaAutosize>
                                                        <label htmlFor="item_notes">Notes</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <select className="form-control edited" id="status" ref="status"
                                                            defaultValue={itemData.itemStatus ? itemData.itemStatus : 'Upcoming'} key={itemData.itemStatus}>
                                                            <option value="Upcoming">Upcoming</option>
                                                            <option value="Active">Active</option>
                                                            <option value="Retired">Retired</option>
                                                            <option value="Retiring">Retiring</option>
                                                        </select>
                                                        <label htmlFor="status">Status<span className="required">*</span></label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <SingleInput
                                                        inputType="text"
                                                        parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                        className="form-control"
                                                        title="Mfg Url"
                                                        name="mfgUrl"
                                                        htmlFor="mfgUrl"
                                                        defaultValue={itemData.mfgUrl ? itemData.mfgUrl : ''}
                                                        key={itemData.mfgUrl}
                                                        required={false}
                                                        ref={'mfgUrl'}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <label htmlFor="relatedItems">Related Items</label>
                                                        <Select
                                                            multi
                                                            value={this.state.relatedItemValue}
                                                            disabled={false}
                                                            name="relatedItems"
                                                            id="relatedItems"
                                                            ref="relatedItems"
                                                            options={this.state.relatedItemOptions}
                                                            onChange={this.handleRelatedItemChange}
                                                            onInputChange={this.onRelatedItemInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <label htmlFor="relatedItems">Alternative Items</label>
                                                        <Select
                                                            multi
                                                            value={this.state.alternativeItemValue}
                                                            disabled={false}
                                                            name="alternativeItems"
                                                            id="alternativeItems"
                                                            ref="alternativeItems"
                                                            options={this.state.alternativeItemOptions}
                                                            onChange={this.handleAlternativeItemChange}
                                                            onInputChange={this.onAlternativeItemInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <label htmlFor="relatedItems">Replacement Items</label>
                                                        <Select
                                                            multi
                                                            value={this.state.replacementItemValue}
                                                            disabled={false}
                                                            name="replacementItems"
                                                            id="replacementItems"
                                                            ref="replacementItems"
                                                            options={this.state.replacementItemOptions}
                                                            onChange={this.handleReplacementItemChange}
                                                            onInputChange={this.onReplacementItemInputChange}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="portlet-title">
                                                <div className="caption">
                                                    <span className="caption-subject bold uppercase">Suppliers</span>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4 col-md-offset-10" style={{ marginBottom: '10px' }}>
                                                        <button onClick={this.handleSupplierModal} className="btn green">
                                                            Add Supplier
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <AddSupplierModal
                                                addSupplierId="sup_add"
                                                ref="sup_add"
                                                handlePriceDateEvent={this.handlePriceDateEvent}
                                                priceDateDisplay={this.state.priceDateDisplay}
                                                addPriceSchedule={this.addPriceSchedule}
                                                addSupplier={this.addSupplier}
                                                priceScheduleDetails={this.state.priceScheduleDetails}
                                                priceScheduleData={priceScheduleData}
                                                headerText={this.state.headerText}
                                            />
                                            <div className="row">
                                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                                    <div className="portlet-body">
                                                        <div className="table-container table-responsive">
                                                            <table className="table table-striped table-bordered table-hover" id="sample_3">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Supplier</th>
                                                                        <th>List($)</th>
                                                                        <th>Dealer($)</th>
                                                                        <th>Demo($)</th>
                                                                        <th>Lead Time</th>
                                                                        <th>Price Date</th>
                                                                        <th>Source</th>
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
                                        </div>
                                    </form>
                                </div>
                                <div className="tab-pane" id="item-moreinfo">
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
                                                        <div className="col-md-7">
                                                            <div className="form-group form-md-line-input form-md-floating-label">
                                                                <div className="form-control form-control-static">
                                                                    {itemData.createdBy ? itemData.createdBy : '-'}
                                                                </div>
                                                                <label htmlFor="form_control_1">Created By</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-5">
                                                            <div className="form-group form-md-line-input form-md-floating-label">
                                                                <div className="form-control form-control-static">
                                                                    {itemData.createdBy ? moment(itemData.createdAt).format('LLL') : '-'}
                                                                </div>
                                                                <label htmlFor="form_control_1">
                                                                    Created On</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-7">
                                                            <div className="form-group form-md-line-input form-md-floating-label">
                                                                <div className="form-control form-control-static">
                                                                    {itemData.modifiedBy ? itemData.modifiedBy : '-'}
                                                                </div>
                                                                <label htmlFor="form_control_1">Modified By</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-5">
                                                            <div className="form-group form-md-line-input form-md-floating-label">
                                                                <div className="form-control form-control-static">
                                                                    {itemData.modifiedBy ? moment(itemData.updatedAt).format('LLL') : '-'}
                                                                </div>
                                                                <label htmlFor="form_control_1">Modified On</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="item-tools">
                                    <div className="portlet-body">
                                        <div className="tab-content">
                                            <form action="#" className="horizontal-form">
                                                <div className="form-body">
                                                    <div className="row">

                                                        <div className="col-md-6">
                                                            <label htmlFor="Project">Project</label>
                                                            <Select
                                                                disabled={this.state.disabled}
                                                                value={this.state.projectValue ? this.state.projectValue : ''}
                                                                key={this.state.projectValue ? this.state.projectValue : ''}
                                                                placeholder="Project"
                                                                name=""
                                                                options={this.state.projectOptions}
                                                                onChange={this.handleProjectChange}
                                                                onInputChange={this.onInputProjectChange} />
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
                </div>
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return {
        itemDetail: state.itemCreation.itemDetailData,
        itemListRelated: state.itemCreation.itemListRelated,
        itemListAlternative: state.itemCreation.itemListAlternative,
        itemListReplacement: state.itemCreation.itemListReplacement,
        projectList: state.documentCreation.projectList,
        imagePath: state.itemCreation.imagePath
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(itemAction, dispatch),
        proActions: bindActionCreators(documentAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ItemEdit);