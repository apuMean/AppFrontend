import React from 'react';
export const DropZoneActions = ({ onUpload, hideShowHandler, hidden }) => (
    <div className="col-sm-12 col-xs-12 col-md-2">
        <label htmlFor="file_input_id" style={{ color: '#2e71d9', cursor: 'pointer' }}>
            <i className="fa fa-upload"></i>  Upload Files
            </label>
        <input type="file" multiple style={{ display: 'none' }} id="file_input_id" onChange={onUpload} />
        <label style={{ color: '#2e71d9', cursor: 'pointer' }}>
            <span onClick={hideShowHandler}>
                {hidden ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}  {hidden ? 'Hide deleted files' : 'Show deleted files'}
            </span>
        </label>
    </div>
)