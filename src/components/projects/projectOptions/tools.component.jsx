import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loader from '../../../constants/actionTypes.js';
import * as datatable from '../../../scripts/table-datatables-buttons.js';
import * as projectOptionAction from '../../../actions/projectOptionActions.js';
import "../../../styles/bootstrap-fileinput.css";
class ProjectTools extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    componentWillMount() {

        var toolsId = {
            toolsId: this.props.params.projectId
        }
        this.props.actions.getToolsList(toolsId);

        var data1 = {
            parent: 'Projects',
            childone: 'Tools',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        $('div#toolsList').block({
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
            $('div#toolsList').unblock();
        }, 2000);
    }

    componentWillReceiveProps(nextProps) { }
    render() {
        var toolsList = this
            .props
            .toolsList
            .map(function (tool, index) {

                return <tr key={index}>
                    <td>{tool.itemName}</td>
                    <td>{tool.manufacturer}</td>
                    <td>{tool.description}</td>
                    <td>{tool.assetTag}</td>
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
                            }}>Tools</span>
                    </div>
                </div>
                <hr></hr>
                <div className="text-right">
                    <Link
                        to={"/project/" + this.props.params.projectId}
                        className="btn btn-sm btn-circle red"
                        style={{
                            "marginBottom": "5px"
                        }}>
                        BACK
                    </Link>
                </div>
                <div className="portlet-body" id="toolsList">
                    <div className="tab-content">
                        <div className="tab-pane active">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover"
                                                    id="project_tools">
                                                    <thead >
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Manufacturer</th>
                                                            <th>Description</th>
                                                            <th>Asset Tag</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {toolsList}
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
    return { toolsList: state.projectOption.toolsList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(projectOptionAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectTools);