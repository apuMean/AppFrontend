import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import * as appValid from '../../scripts/app';
import * as layout from '../../scripts/app';
import Select from 'react-select';
import jQuery from 'jquery';
import ReactDOM from 'react-dom';
import * as loader from '../../constants/actionTypes.js';
import * as documentAction from '../../actions/documentActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import "../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class DocumentAdd extends React.Component {
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

        var data1 = {
            parent: 'Documents',
            childone: '',
            childtwo: ''
        };

        this.props.breadCrumb(data1);
    }

    componentWillUnmount() {
        localStorage.setItem("projectDocumentId", '');
        localStorage.setItem("documentProjectName", '');
    }

    componentDidMount() {
        appValid
            .FormValidationMd
            .init();

    }

    handleClientChange(value) {

        this.setState({ clientValue: value })
    }

    onInputClientChange(value) {
        var data = {
            companyName: value,
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

                $('div#create_document').block({
                    message: loader.GET_LOADER_IMAGE,
                    css: {
                        width: '25%'
                    },
                    overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
                });

                var docDetails = {
                    companyId: localStorage.companyId,
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
                    orderId: this.state.orderValue ? this.state.orderValue.id : '',
                    poId: this.state.poValue ? this.state.poValue.id : '',
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
                    createdBy: localStorage.userName
                }

                this
                    .props
                    .actions
                    .createDocument(docDetails, this.state.imageBlob);

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

        if (project.length == 0 && localStorage.projectDocumentId && localStorage.documentProjectName) {
            var obj = {
                id: localStorage.projectDocumentId,
                label: localStorage.documentProjectName
            }
            this.setState({ projectValue: obj })
        }

        var clientList = nextProps
            .clientList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.companyName
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
                    label: list.orderNumber
                }
                order.push(obj)
            }.bind(this));

        var pOrderList = nextProps
            .poList
            .map(function (list, index) {
                var obj = {
                    id: list._id,
                    label: list.poNumber
                }
                pOrder.push(obj)
            }.bind(this));

        this.setState({
            clientOptions: client,
            opportunityOptions: opportunity,
            projectOptions: project,
            orderOptions: order,
            estimateOptions: estimate,
            poOptions: pOrder
        })

        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
    }

    render() {

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
                        <div className="form-actions noborder text-right">
                            <Link to={localStorage.projectDocumentId ? "/project_documents/" + localStorage.projectDocumentId : "/document"} className="btn red">
                                Cancel
                            </Link>&nbsp;&nbsp;
                            <button type="button" className="btn blue" onClick={this.documentHandler}>Save</button>
                        </div>
                    </ul>
                </div>
                <div className="portlet light bordered" id="create_document">
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
                                                <div className="form-group form-md-floating-label">

                                                    <label htmlFor="client">Client<span className="required">*</span></label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.clientValue}
                                                        placeholder="Client"
                                                        name=""
                                                        options={this.state.clientOptions}
                                                        onChange={this.handleClientChange}
                                                        onInputChange={this.onInputClientChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-floating-label">

                                                    <label htmlFor="project">Project<span className="required">*</span></label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.projectValue}
                                                        placeholder="Project"
                                                        name=""
                                                        options={this.state.projectOptions}
                                                        onChange={this.handleProjectChange}
                                                        onInputChange={this.onInputProjectChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-floating-label">

                                                    <label htmlFor="opportunity">Opportunity<span className="required">*</span></label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.opportunityValue}
                                                        placeholder="Opportunity"
                                                        name=""
                                                        options={this.state.opportunityOptions}
                                                        onChange={this.handleOpportunityChange}
                                                        onInputChange={this.onInputOpportunityChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-floating-label">

                                                    <label htmlFor="estimate">Estimate #<span className="required">*</span></label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.estimateValue}
                                                        placeholder="Estimate"
                                                        name=""
                                                        options={this.state.estimateOptions}
                                                        onChange={this.handleEstimateChange}
                                                        onInputChange={this.onInputEstimateChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="order">Service Order #</label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.orderValue}
                                                        placeholder="Service Order"
                                                        name=""
                                                        options={this.state.orderOptions}
                                                        onChange={this.handleOrderChange}
                                                        onInputChange={this.onInputOrderChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-floating-label">

                                                    <label htmlFor="purchaseOrder">Purchase Order #</label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.poValue}
                                                        placeholder="Purchase Order"
                                                        name=""
                                                        options={this.state.poOptions}
                                                        onChange={this.handlePoChange}
                                                        onInputChange={this.onInputPoChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" ref="docType" name="docType">
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
                                                        defaultValue="" />
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
                                                        defaultValue="" />
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
                                                        defaultValue="" />
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
                                                        defaultValue="" />
                                                    <label htmlFor="location">Physical Location</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="doc_filename"
                                                        name="fileName"
                                                        disabled={true}
                                                        key={this.state.attachmentName}
                                                        defaultValue={this.state.attachmentName} />
                                                    <label htmlFor="fileName">File Name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="doc_author"
                                                        name="authorName"
                                                        defaultValue="" />
                                                    <label htmlFor="authorName">Author</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        ref="doc_pages"
                                                        min="1"
                                                        name="pages"
                                                        defaultValue="" />
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
                                                        defaultValue="" />
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
                                                        defaultValue="" />
                                                    <label htmlFor="docTitle">Document Title<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="docTitle">Document<span className="required">*</span></label>
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
                                                                src={require('../../img/document.jpg')}
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
                                </form>
                            </div>
                            <div
                                id="select-other"
                                className="modal fade bs-modal-sm"
                                tabIndex="-1"
                                aria-hidden="true">
                                <div className="modal-dialog modal-sm">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="actions">
                                                <h5 className="modal-title">Add {this.state.addOther}</h5>
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
                                                className="btn green"
                                                id="send-invite-button"
                                                onClick={this.handleAddOtherPopup}>Done</button>
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
        categoryList: state.documentCreation.categoryList,
        projectList: state.documentCreation.projectList,
        estimateList: state.documentCreation.estimateList,
        clientList: state.documentCreation.clientList,
        orderList: state.documentCreation.orderList,
        poList: state.documentCreation.poList,
        oppList: state.documentCreation.oppList
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(documentAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DocumentAdd);