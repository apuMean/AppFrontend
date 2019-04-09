import React from 'react';
import Dropzone from 'react-dropzone';
export const RenameFileModal = ({ rename_id, title, handleRenameFile, fileName, fileNameHandler, modified }) => (
    <div id={rename_id}
        className="modal fade bs-modal-sm"
        tabIndex="-1"
        aria-hidden="true">
        <div className="modal-dialog modal-sm">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="actions">
                        <h5 className="modal-title bold">{title}</h5>
                    </div>
                </div>
                <div className="modal-body">
                    <label><span className="bold"> Modified date -</span> {modified}</label>
                    <input
                        type="text"
                        className="form-control"
                        id="addvalue"
                        name="addvalue"
                        value={fileName}
                        onChange={fileNameHandler} />
                </div>
                <div className="modal-footer">
                    <button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
                    <button type="button" className="btn green"
                        id="send-invite-button"
                        onClick={handleRenameFile}>Done</button>
                </div>
            </div>
        </div>
    </div>
)