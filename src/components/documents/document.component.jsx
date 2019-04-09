import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as functions from '../common/functions';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as documentAction from '../../actions/documentActions.js';
import * as dashboardActions from '../../actions/dashboardActions';
import { browserHistory } from 'react-router';
import autoBind from 'react-autobind';

class Documents extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            documentData: [],
            documentId: '',
            deleteIndex: ''
        }
    }
    componentWillMount() {
        var data = {
            parent: 'Documents',
            childone: '',
            childtwo: ''
        };
        var companyId = {
            companyId: localStorage.companyId
        }

        this.props.breadCrumb(data);

        this
            .props
            .documentActions
            .getDocmentsList(companyId);
    }
    componentDidMount() {
        functions.showLoader('documentList');
    }

    handleDetail(docId) {
        browserHistory.push('/document/' + docId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.documentList) {
            var documentState = JSON.parse(JSON.stringify(nextProps.documentList));
            this.setState({ documentData: documentState });
            var document_list = $('#document_list').DataTable();
            document_list.destroy();
            setTimeout(function () {
                datatable
                    .DocumentTable
                    .init();
                $('div#documentList').unblock();
            }, 3000);
        }
    }

    render() {
        var documentList = this
            .state
            .documentData
            .map(function (doc, index) {

                return <tr key={index} onClick={this.handleDetail.bind(this, doc._id)}>
                    <td>{moment(doc.createdAt).format("MM-DD-YYYY")}</td>
                    <td>{doc.documentTitle}</td>
                    <td>{doc.documentType}</td>
                    <td>{doc.description}</td>
                    <td>{doc.fileName}</td>
                    <td>{doc.pages}</td>
                </tr>;
            }.bind(this));
        return (
            <div
                className="portlet light portlet-fit portlet-datatable bordered"
                id="documentList">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Documents</span>
                    </div>

                    <div className="actions">
                        <Link to="/document/add" className="btn btn-sm btn-circle green">
                            <i className="icon-plus"></i>
                            New Document
                        </Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container table-responsive">
                        <table
                            className="table table-striped table-bordered table-hover"
                            id="document_list">
                            <thead >
                                <tr>
                                    <th>Created</th>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>File Name</th>
                                    <th># Pages</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documentList}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return { documentList: state.documentCreation.documentList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(dashboardActions, dispatch),
        documentActions: bindActionCreators(documentAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Documents);