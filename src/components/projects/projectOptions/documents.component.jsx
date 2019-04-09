import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { browserHistory } from 'react-router';
import * as loader from '../../../constants/actionTypes.js';
import * as datatable from '../../../scripts/table-datatables-buttons.js';
import * as projectOptionAction from '../../../actions/projectOptionActions.js';
import "../../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class ProjectDocuments extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
    }
    componentWillMount() {

        var document = {
            companyId: localStorage.companyId,
            projectId: this.props.params.projectId
        }
        this
            .props
            .actions
            .getDocumentList(document);

        var data1 = {
            parent: 'Projects',
            childone: 'Documents',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        $('div#documentList').block({
            message: loader.GET_LOADER_IMAGE,
            css: {
                width: '25%'
            },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });

        setTimeout(function () {
            datatable
                .ProjectMoreOptions
                .init();
            $('div#documentList').unblock();
        }, 2000);
    }

    projectDocument() {
        localStorage.setItem("projectDocumentId", this.props.params.projectId);
        localStorage.setItem("documentProjectName", localStorage.projectName);
        browserHistory.push('/document/add');
    }

    componentWillReceiveProps(nextProps) { }
    render() {
        var documentList = this
            .props
            .documentList
            .map(function (doc, index) {

                return <tr key={index}>
                    <td>{moment(doc.createdAt).format('MM-DD-YYYY')}</td>
                    <td>{doc.documentTitle}</td>
                    <td>{doc.documentType}</td>
                    <td>{doc.description}</td>
                    <td>{doc.fileName}</td>
                    <td>{doc.pages ? doc.pages : '-'}</td>
                    {/*<td>
                       <i
                            className="icon-close "
                            onClick={this
                            .handleDelete
                            .bind(this, item._id, index)}
                            id={item._id}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i
                            className="icon-eye "
                            onClick={this
                    .handleDetail
                    .bind(this, item._id)}></i>
                    </td>*/}
                </tr>;
            }.bind(this));
        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span
                            className="caption-subject bold uppercase"
                            style={{
                                "fontSize": "15px"
                            }}>Documents</span>
                    </div>
                </div>
                <hr></hr>
                <div className="text-right" style={{ "marginBottom": "5px" }}>
                    <a onClick={this.projectDocument} className="btn btn-sm btn-circle green">
                        <i className="icon-plus"></i> New Document </a>&nbsp;&nbsp;
                    <Link
                        to={"/project/" + this.props.params.projectId}
                        className="btn btn-sm btn-circle red">
                        Back
                    </Link>
                </div>
                <div className="portlet-body" id="documentList">
                    <div className="tab-content">
                        <div className="tab-pane active">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover"
                                                    id="project_document">
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
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { documentList: state.projectOption.documentList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(projectOptionAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDocuments);