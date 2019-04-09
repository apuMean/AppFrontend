import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import * as appValid from '../../scripts/app';
import * as layout from '../../scripts/app';
import Select from 'react-select';
import jQuery from 'jquery';
import moment from 'moment';
import ReactDOM from 'react-dom';
import * as loader from '../../constants/actionTypes.js';
import * as documentAction from '../../actions/documentActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import "../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class DocumentEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            disabled: false,
            clientValue: '',
            clientOptions: [],
            projectValue: '',
            projectOptions: [],
            opportunityValue: '',
            opportunityOptions: [],
            estimateValue: '',
            estimateOptions: [],
            orderValue: '',
            orderOptions: [],
            poValue: '',
            poOptions: [],
            documentDetail: '',
            attachmentName: '',
            imageBlob: ''

        }
    }

    componentWillMount() {
        var data = {
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getCategoryList(data);

        var documentId = {
            documentId: this.props.params.documentId
        }
        this
            .props
            .actions
            .getDocumentDetailValues(documentId);

        var data1 = {
            parent: 'Documents',
            childone: '',
            childtwo: ''
        };

        this.props.breadCrumb(data1);
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
    }

    handleClientChange(value) {

        this.setState({ clientValue: value })
    }

    onInputClientChange(value) {
        var data = {
            name: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getClientData(data);
    }

    handleProjectChange(value) {

        this.setState({ projectValue: value })
    }

    onInputProjectChange(value) {
        var data = {
            title: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getProjectData(data);
    }

    handleOpportunityChange(value) {

        this.setState({ opportunityValue: value })
    }

    onInputOpportunityChange(value) {

        var data = {
            title: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getOpportunityData(data)
    }

    handleEstimateChange(value) {

        this.setState({ estimateValue: value })
    }

    onInputEstimateChange(value) {
        var data = {
            estimateNumber: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getEstimateData(data);
    }

    handleOrderChange(value) {

        this.setState({ orderValue: value })
    }

    onInputOrderChange(value) {
        var data = {
            orderNumber: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getOrderData(data);
    }

    handlePoChange(value) {

        this.setState({ poValue: value })
    }

    onInputPoChange(value) {
        var data = {
            poNumber: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getPoData(data);
    }

    selectOther(type, e) {
        ReactDOM
            .findDOMNode(this.refs.add_value)
            .value = "";
        if (e.target.value == "other") {
            e.target.selectedIndex = "0";
            this.setState({ addOther: type });
            $('#select-other').modal('show');
        }
    }

    handleAddOtherPopup(e) {

        e.preventDefault();
        var name = ReactDOM
            .findDOMNode(this.refs.add_value)
            .value
            .trim();
        if (name) {
            var type = this.state.addOther;
            switch (type) {
                case "Category":
                    this
                        .props
                        .actions
                        .addOtherCategory(name);
                    break;
                default:
                    break;
            }
            $('#select-other').modal('hide');
        }
    }

    documentHandler() {

        if (jQuery('#createDocument').valid()) {

            if (this.state.attachmentName) {

                $('div#update_document').block({
                    message: loader.GET_LOADER_IMAGE,
                    css: {
                        width: '25%'
                    },
                    overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
                });

                var docDetails = {
                    companyId: localStorage.companyId,
                    documentId: this.props.params.documentId,
                    clientId: this.state.clientValue
                        ? this.state.clientValue.id
                        : '',
                    projectId: this.state.projectValue
                        ? this.state.projectValue.id
                        : '',
                    opportunityId: this.state.opportunityValue
                        ? this.state.opportunityValue.id
                        : '',
                    estimateId: this.state.estimateValue
                        ? this.state.estimateValue.id
                        : '',
                    orderId: this.state.orderValue
                        ? this.state.orderValue.id
                        : '',
                    poId: this.state.poValue
                        ? this.state.poValue.id
                        : '',
                    documentType: ReactDOM
                        .findDOMNode(this.refs.docType)
                        .value,
                    documentCategoryId: ReactDOM
                        .findDOMNode(this.refs.docCategory)
                        .value,
                    referenceNumber: ReactDOM
                        .findDOMNode(this.refs.doc_refnum)
                        .value,
                    version: ReactDOM
                        .findDOMNode(this.refs.doc_version)
                        .value,
                    location: ReactDOM
                        .findDOMNode(this.refs.doc_location)
                        .value,
                    description: ReactDOM
                        .findDOMNode(this.refs.doc_desc)
                        .value,
                    fileName: ReactDOM
                        .findDOMNode(this.refs.doc_filename)
                        .value,
                    author: ReactDOM
                        .findDOMNode(this.refs.doc_author)
                        .value,
                    pages: parseInt(ReactDOM.findDOMNode(this.refs.doc_pages).value),
                    keyword: ReactDOM
                        .findDOMNode(this.refs.doc_keyword)
                        .value,
                    documentTitle: ReactDOM
                        .findDOMNode(this.refs.doc_title)
                        .value,
                    modifiedBy: localStorage.userName
                }

                this
                    .props
                    .actions
                    .updateDocument(docDetails, this.state.imageBlob);

            } else {
                toastr.error('Please select valid document.')
            }
        }
    }

    selectDocument() {
        var upload = ReactDOM.findDOMNode(this.refs.uploadAttach);
        upload.click();
    }

    getDocument(e) {
        var preview = document.querySelector('img');
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();
        var that = this;
        var ext = e.target.files[0].name.split('.').pop();
        this.setState({ attachmentName: e.target.files[0].name })
        reader.addEventListener("load", function () {
            let image = require("../../img/document.jpg");
            if (ext == "pdf") {
                image = require('../../img/pdf.jpg');
            } else if (ext == "docx" || ext == "doc") {
                image = require('../../img/doc.png');
            } else if (ext == "png" || ext == "jpg" || ext == "jpeg") {
                image = reader.result;
            } else {
                toastr.error('Unsupported file type.');
                that.setState({ attachmentName: '' });
                return false;
            }
            $('#doc_select').attr('src', image);
            that.setState({
                imageBlob: file
            })
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    componentWillReceiveProps(nextProps) {

        var client = [];
        var project = [];
        var opportunity = [];
        var estimate = [];
        var order = [];
        var pOrder = [];

        var clientList = nextProps
            .clientList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.name
                }
                client.push(obj)
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
            .oppList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.title
                }
                opportunity.push(obj)
            }.bind(this));

        var estimateList = nextProps
            .estimateList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.estimateNumber
                }
                estimate.push(obj)
            }.bind(this));

        var orderList = nextProps
            .orderList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.title
                }
                order.push(obj)
            }.bind(this));

        var pOrderList = nextProps
            .poList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.title
                }
                pOrder.push(obj)
            }.bind(this));

        // client
        if (client.length == 0 && nextProps.documentDetail.clientId) {
            var selClient = {
                id: nextProps.documentDetail.clientId._id,
                label: nextProps.documentDetail.clientId.companyName
            }

            this.setState({ clientValue: selClient })
        }
        // project
        if (project.length == 0 && nextProps.documentDetail.projectId) {
            var selProject = {
                id: nextProps.documentDetail.projectId._id,
                label: nextProps.documentDetail.projectId.title
            }

            this.setState({ projectValue: selProject })
        }
        // opportuinity
        if (opportunity.length == 0 && nextProps.documentDetail.opportunityId) {
            var selOpp = {
                id: nextProps.documentDetail.opportunityId._id,
                label: nextProps.documentDetail.opportunityId.title
            }

            this.setState({ opportunityValue: selOpp })
        }
        // estimate
        if (estimate.length == 0 && nextProps.documentDetail.estimateId) {
            var selEstimate = {
                id: nextProps.documentDetail.estimateId._id,
                label: nextProps.documentDetail.estimateId.title
            }

            this.setState({ estimateValue: selEstimate })
        }
        // order
        if (order.length == 0 && nextProps.documentDetail.orderId) {
            var selOrder = {
                id: nextProps.documentDetail.orderId._id,
                label: nextProps.documentDetail.orderId.title
            }

            this.setState({ orderValue: selOrder })
        }
        // pOrder
        if (pOrder.length == 0 && nextProps.documentDetail.poId) {
            var selPo = {
                id: nextProps.documentDetail.poId._id,
                label: nextProps.documentDetail.poId.title
            }

            this.setState({ poValue: selPo })
        }

        this.setState({
            clientOptions: client,
            opportunityOptions: opportunity,
            projectOptions: project,
            orderOptions: order,
            estimateOptions: estimate,
            poOptions: pOrder,
            attachmentName: nextProps.documentDetail ? nextProps.documentDetail.fileName : '',
            documentDetail: nextProps.documentDetail
        })

        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
    }

    render() {

        var documentData = this.state.documentDetail;
        var image = require('../../img/document.jpg');
        if (documentData) {
            var myfile = documentData.documentUrl;
            var ext = myfile ? myfile.split('.').pop() : '';
            if (ext == "pdf") {
                image = require('../../img/pdf.jpg');
            } else if (ext == "docx" || ext == "doc") {
                image = require('../../img/doc.png');
            } else if (ext == "png" || ext == "jpg" || ext == "jpeg") {
                image = documentData.documentUrl;
            }
        }

        var category = this
            .props
            .categoryList
            .map(function (category, index) {
                return <option value={category._id} key={index}>{category.categoryName}</option>;
            }.bind(this));

        return (
            <div>
                <div className="portlet-title tabbable-line">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#document-add" data-toggle="tab">
                                Document
                            </a>
                        </li>
                        <li>
                            <a href="#document-moreinfo" data-toggle="tab">
                                More Info
                            </a>
                        </li>
                        <div className="form-actions noborder text-right">
                            <Link to={"/document/" + this.props.params.documentId} className="btn red">
                                Cancel
                            </Link>&nbsp;&nbsp;
                            <button type="button" className="btn blue" onClick={this.documentHandler}>Save</button>
                        </div>
                    </ul>
                </div>
                <div className="portlet light bordered" id="update_document">
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="document-add">
                                <div className="portlet-title">
                                    <div className="caption">
                                        <span className="caption-subject bold uppercase">General Details</span>
                                    </div>
                                </div>
                                <form role="form" id="createDocument">
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <label htmlFor="client">Client<span className="required">*</span></label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.clientValue}
                                                        placeholder="Client"
                                                        name=""
                                                        options={this.state.clientOptions}
                                                        onChange={this.handleClientChange}
                                                        onInputChange={this.onInputClientChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <label htmlFor="project">Project<span className="required">*</span></label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.projectValue}
                                                        placeholder="Project"
                                                        name=""
                                                        options={this.state.projectOptions}
                                                        onChange={this.handleProjectChange}
                                                        onInputChange={this.onInputProjectChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <label htmlFor="opportunity">Opportunity<span className="required">*</span></label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.opportunityValue}
                                                        placeholder="Opportunity"
                                                        name=""
                                                        options={this.state.opportunityOptions}
                                                        onChange={this.handleOpportunityChange}
                                                        onInputChange={this.onInputOpportunityChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <label htmlFor="estimate">Estimate #<span className="required">*</span></label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.estimateValue}
                                                        placeholder="Estimate"
                                                        name=""
                                                        options={this.state.estimateOptions}
                                                        onChange={this.handleEstimateChange}
                                                        onInputChange={this.onInputEstimateChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <label htmlFor="order">Service Order #</label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.orderValue}
                                                        placeholder="Service Order"
                                                        name=""
                                                        options={this.state.orderOptions}
                                                        onChange={this.handleOrderChange}
                                                        onInputChange={this.onInputOrderChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <label htmlFor="purchaseOrder">Purchase Order #</label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.poValue}
                                                        placeholder="Purchase Order"
                                                        name=""
                                                        options={this.state.poOptions}
                                                        onChange={this.handlePoChange}
                                                        onInputChange={this.onInputPoChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" defaultValue={documentData.documentType} key={documentData.documentType} ref="docType" name="docType">
                                                        <option value="0">Select</option>
                                                        <option value="Word">Word</option>
                                                        <option value="Excel">Excel</option>
                                                        <option value="PowerPoint">PowerPoint</option>
                                                        <option value="PDF">PDF</option>
                                                        <option value="Email">Email</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    <label htmlFor="docType">Document Type<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div
                                                    className="form-group form-md-line-input form-md-floating-label"
                                                    id="document_category">
                                                    <select
                                                        className="form-control edited"
                                                        onChange={this
                                                            .selectOther
                                                            .bind(this, "Category")}
                                                        ref="docCategory"
                                                        key={documentData.documentCategoryId ? documentData.documentCategoryId._id : ''}
                                                        defaultValue={documentData.documentCategoryId ? documentData.documentCategoryId._id : ''}
                                                        name="docCategory">
                                                        <option value="0">Select</option>
                                                        {category}
                                                        <option value="other">Add Other</option>
                                                    </select>
                                                    <label htmlFor="category">Category<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="doc_desc"
                                                        name="description"
                                                        key={documentData.description}
                                                        defaultValue={documentData.description} />
                                                    <label htmlFor="description">Description<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="doc_refnum"
                                                        name="refNumber"
                                                        key={documentData.referenceNumber}
                                                        defaultValue={documentData.referenceNumber}
                                                    />
                                                    <label htmlFor="refNumber">Reference Number</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="doc_version"
                                                        name="version"
                                                        key={documentData.version}
                                                        defaultValue={documentData.version}
                                                    />
                                                    <label htmlFor="version">Version</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="doc_location"
                                                        name="location"
                                                        key={documentData.location}
                                                        defaultValue={documentData.location} />
                                                    <label htmlFor="location">Physical Location</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="doc_filename"
                                                        disabled={true}
                                                        name="fileName"
                                                        key={this.state.attachmentName}
                                                        defaultValue={this.state.attachmentName}
                                                    />
                                                    <label htmlFor="fileName">File Name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="doc_author"
                                                        name="author"
                                                        key={documentData.author}
                                                        defaultValue={documentData.author} />
                                                    <label htmlFor="author">Author</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input type="number" className="form-control" min="1" ref="doc_pages" name="pages" key={documentData.pages} defaultValue={documentData.pages} />
                                                    <label htmlFor="pages">Pages<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="doc_keyword"
                                                        name="keywords"
                                                        key={documentData.keyword}
                                                        defaultValue={documentData.keyword} />
                                                    <label htmlFor="keywords">Keywords<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="doc_title"
                                                        name="docTitle"
                                                        key={documentData.documentTitle}
                                                        defaultValue={documentData.documentTitle} />
                                                    <label htmlFor="docTitle">Document Title<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="docTitle">Document<span className="required">*</span></label>
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div>
                                                        <input type="file" name="uploadAttach" ref="uploadAttach" style={{ display: "none" }} onChange={this.getDocument} />
                                                        <div className="fileinput" data-provides="fileinput">
                                                            <div
                                                                className="fileinput-preview thumbnail"
                                                                data-trigger="fileinput"
                                                                style={{
                                                                    width: 200,
                                                                    height: 150
                                                                }}>
                                                                <img
                                                                    src={image}
                                                                    className="img-responsive"
                                                                    id="doc_select"
                                                                    alt="Logo" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a className="btn btn-sm btn-circle green" onClick={this.selectDocument}>
                                                        Change
                                                </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="tab-pane" id="document-moreinfo">
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
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.documentTitle}
                                                            </div>
                                                            <label htmlFor="form_control_1">Title</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.createdBy}
                                                            </div>
                                                            <label htmlFor="form_control_1">Created By</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.createdAt ? moment(documentData.createdAt).format('LLL') : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">On</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                -
                                                            </div>
                                                            <label htmlFor="form_control_1">Doc #</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.modifiedBy ? documentData.modifiedBy : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Modified By</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.modifiedBy ? moment(documentData.updatedAt).format('LLL') : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">On</label>
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
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return {
        categoryList: state.documentCreation.categoryList,
        projectList: state.documentCreation.projectList,
        estimateList: state.documentCreation.estimateList,
        clientList: state.documentCreation.clientList,
        orderList: state.documentCreation.orderList,
        poList: state.documentCreation.poList,
        oppList: state.documentCreation.oppList,
        documentDetail: state.documentCreation.documentDetailData
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(documentAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DocumentEdit);