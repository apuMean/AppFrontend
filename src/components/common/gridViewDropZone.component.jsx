import React from 'react';
import Dropzone from 'react-dropzone';
import * as authorize from '../authorization/roleTypes';
import * as func from '../common/functions';
export const GridViewZone = ({ dropHandler, files, handleRenameClick, handleDeleteClick, hidden, restoreFile, downloadFile }) => (
    <div className="col-sm-12 col-xs-12 col-md-12">
        <Dropzone
            accept=".jpeg,.png,.jpg,.gif,.txt,.rtf,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.pps,.msg,.log,.odt,.pages,.csv,.xml"
            activeStyle={{ border: '2px solid #007AF5', background: 'white', padding: '20px', margin: '0 auto', textAlign: 'center' }}
            disableClick={true}
            style={{ background: 'white', padding: '20px', margin: '0 auto', textAlign: 'center' }} className="dropzone"
            onDrop={dropHandler}>
            <div className="row">
                {files.map(function (file, index) {
                    if (!file.temp_deleted || hidden) {
                        return (
                            <div key={index} className="file-grid col-md-3 col-sm-3 col-xs-6">
                                <img className="img-responsive file-img" alt="image" src={file.fileTypeId == 1 ? file.filePath : require('../../img/document_image.png')} />
                                <div className="file-overlay">
                                    <div className="overlay-btn">
                                        <a data-toggle="dropdown" className="fa fa-arrows-alt hover-ico dropdown-toggle btn btn-default action-btn white-col" href="#" aria-expanded="false"></a>
                                        <ul className="dropdown-menu custom-dropdown">
                                            {file.temp_deleted ? null : <li><a href="javascript:;" onClick={e => downloadFile(index, e)}>Download </a></li>}
                                            {file.temp_deleted ? null : <li><a href="javascript:;" onClick={e => handleRenameClick(index, e)}>Rename</a></li>}
                                            {file.temp_deleted ? null : <li><a href="javascript:;" onClick={e => handleDeleteClick(index, e)} >Delete</a></li>}
                                            {file.temp_deleted ? <li><a href="javascript:;" onClick={e => restoreFile(index, e)} >Restore</a></li> : null}
                                            {(file.temp_deleted && func.shouldBeVisible(authorize.userAuthorize)) ? <li><a href="javascript:;">Delete permanently</a></li> : null}
                                        </ul>
                                    </div>
                                </div>
                                <div className="file-name-txt">{file.filename ? file.filename : '-'}</div>
                            </div>
                        )
                    }
                })}
            </div>
        </Dropzone>
    </div>
)