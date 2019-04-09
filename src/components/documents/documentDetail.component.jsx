import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import * as functions from '../common/functions';
import * as documentAction from '../../actions/documentActions.js';
import "../../styles/bootstrap-fileinput.css";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DeleteModal from '../common/deleteModal.component.js';
import autoBind from 'react-autobind';

class DocumentDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
    }

    componentWillMount() {
        var data1 = {
            parent: 'Documents',
            childone: '',
            childtwo: ''
        };

        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        var documentId = {
            documentId: this.props.params.documentId
        }
        this
            .props
            .actions
            .getDocumentDetailValues(documentId);
        functions.showLoader('doc_detail');
    }

    handleDelete() {
        $('#document_delete').modal('show');
    }

    deleteDocumentHandler() {
        if (this.props.params.documentId) {
            $('#document_delete').modal('hide');
            functions.showLoader('doc_detail');
            var data = {
                documentId: this.props.params.documentId
            }
            this.props.actions.deleteDocument(data);
        }
    }

    render() {
        var documentData = this.props.documentDetail;
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
        return (
            <div>
                {documentData
                    ? <div>
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
                                <div className="text-right">
                                    <Link to="/document" className="btn btn-sm btn-circle red">
                                        Cancel
                                    </Link>&nbsp;&nbsp;
                                    <button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
                                        Delete </button>&nbsp;&nbsp;
                                    <Link to={"/document/" + this.props.params.documentId + '/edit'} className="btn btn-sm btn-circle green">
                                        Edit
                                    </Link>
                                </div>
                            </ul>
                        </div>
                        <div className="portlet light bordered" id="doc_detail">
                            <div className="portlet-body">
                                <div className="tab-content">
                                    <div className="tab-pane active" id="document-add">
                                        <div className="portlet-title">
                                            <div className="caption">
                                                <span className="caption-subject bold uppercase">General Details</span>
                                            </div>
                                        </div>
                                        <form role="form">
                                            <div className="form-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.clientId
                                                                    ? documentData.clientId.companyName
                                                                    : ''}
                                                            </div>
                                                            <label htmlFor="form_control_1">Client</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.projectId
                                                                    ? documentData.projectId.title
                                                                    : ''}
                                                            </div>
                                                            <label htmlFor="form_control_1">Project</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.opportunityId
                                                                    ? documentData.opportunityId.title
                                                                    : ''}
                                                            </div>
                                                            <label htmlFor="form_control_1">Opportunity</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.estimateId
                                                                    ? documentData.estimateId.estimateNumber
                                                                    : ''}
                                                            </div>
                                                            <label htmlFor="form_control_1">Estimate #</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.orderId
                                                                    ? documentData.orderId.orderNumber
                                                                    : ''}
                                                            </div>
                                                            <label htmlFor="form_control_1">Service Order #</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.poId
                                                                    ? documentData.poId.poNumber
                                                                    : ''}
                                                            </div>
                                                            <label htmlFor="form_control_1">Purchase Order #</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.description}
                                                            </div>
                                                            <label htmlFor="form_control_1">Description</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.documentType}
                                                            </div>
                                                            <label htmlFor="form_control_1">Document Type</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.documentCategoryId.categoryName}
                                                            </div>
                                                            <label htmlFor="form_control_1">Category</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.referenceNumber}
                                                            </div>
                                                            <label htmlFor="form_control_1">Reference Number</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.version}
                                                            </div>
                                                            <label htmlFor="form_control_1">Version</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.location}
                                                            </div>
                                                            <label htmlFor="form_control_1">Physical Location</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.fileName}
                                                            </div>
                                                            <label htmlFor="form_control_1">File Name</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.author}
                                                            </div>
                                                            <label htmlFor="form_control_1">Author</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.pages}
                                                            </div>
                                                            <label htmlFor="form_control_1">Pages</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.keyword}
                                                            </div>
                                                            <label htmlFor="form_control_1">Keywords</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {documentData.documentTitle}
                                                            </div>
                                                            <label htmlFor="form_control_1">Document Title</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="form_control_1">Document</label>
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
                                                                        src={image}
                                                                        className="img-responsive"
                                                                        alt="Logo" />
                                                                </div>
                                                            </div>
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
                    : null}
                <DeleteModal
                    deleteModalId="document_delete"
                    deleteUserHandler={this.deleteDocumentHandler} />
            </div >

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return { documentDetail: state.documentCreation.documentDetailData };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(documentAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DocumentDetail)