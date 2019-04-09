import React from 'react';
import Dropzone from 'react-dropzone';
import moment from 'moment';
import * as authorize from '../authorization/roleTypes';
import * as func from '../common/functions';
export const ListViewZone = ({ dropHandler, files, handleRenameClick, handleDeleteClick, hidden, restoreFile, downloadFile }) => (
    <div className="col-sm-12 col-xs-12 col-md-12">
        <Dropzone
            accept=".jpeg,.png,.jpg,.gif,.txt,.rtf,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.pps,.msg,.log,.odt,.pages,.csv,.xml"
            activeStyle={{ border: '2px solid #007AF5', background: 'white', padding: '20px', margin: '0 auto', textAlign: 'center' }}
            disableClick={true}
            style={{ background: 'white', padding: '20px', margin: '0 auto', textAlign: 'center' }} className="dropzone"
            onDrop={dropHandler}>
            <div className="table-responsive table-overflow">
                <table className="table table_drop table-bordred table-striped" id="mytable">
                    <thead>
                        <tr>
                            <th className="row-name">Name<span className="fa fa-caret-down sort-ico"></span></th>
                            <th className="row-date">Date<span className="fa fa-caret-down sort-ico"></span></th>
                            <th className="row-size">Size<span className="fa fa-caret-down sort-ico"></span></th>
                            <th className="row-uploader">Uploader<span className="fa fa-caret-down sort-ico"></span></th>
                            <th className="row-action"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map(function (file, index) {
                            if (!file.temp_deleted || hidden) {
                                return (
                                    <tr key={index}>
                                        <td style={{ overflow: 'hidden' }}>
                                            <img style={{ width: '8%' }} src={file.fileTypeId == 1 ? file.filePath : require('../../img/document_image.png')} alt="description here" />
                                            <span style={{ paddingLeft: '10px' }}>{file.filename ? file.filename : '-'}</span>
                                        </td>
                                        <td style={{ overflow: 'hidden' }}>{file.createdAt ? moment(file.createdAt).format("L") : '-'}</td>
                                        <td style={{ overflow: 'hidden' }}>{file.size ? (parseFloat(file.size)).toFixed(2) + ' KB' : '-'}</td>
                                        <td style={{ overflow: 'hidden' }}>{file.uploader ? file.uploader : '-'}</td>
                                        <td>
                                            <ul className="nav navbar-nav">
                                                <li className="dropdown">
                                                    <a data-toggle="dropdown" className="dropdown-toggle btn btn-default action-btn" href="javascript:;" aria-expanded="false">
                                                        <span className="ellipsis-ico fa fa-ellipsis-h pull-right"></span>
                                                    </a>
                                                    <ul className="dropdown-menu custom-dropdown">
                                                        {file.temp_deleted ? null : <li><a href="javascript:;" onClick={e => downloadFile(index, e)}>Download </a></li>}
                                                        {file.temp_deleted ? null : <li><a href="javascript:;" onClick={e => handleRenameClick(index, e)}>Rename</a></li>}
                                                        {file.temp_deleted ? null : <li><a href="javascr231132213132ipt:;" onClick={e => handleDeleteClick(index, 'TEMP', e)} >Delete</a></li>}
                                                        {file.temp_deleted ? <li><a href="javascript:;" onClick={e => restoreFile(index, e)} >Restore</a></li> : null}
                                                        {(file.temp_deleted && func.shouldBeVisible(authorize.userAuthorize)) ? <li><a href="javascript:;" onClick={e => handleDeleteClick(index, 'PERM', e)}>Delete permanently</a></li> : null}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                )
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </Dropzone>
    </div>
)