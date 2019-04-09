import React from 'react';
export const ToggleListGrid = ({ defaultView, toggleDropzoneView, onUpload, hideShowHandler, hidden }) => (
    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <h3 style={{ float: 'left' }} className="col-lg-4 col-md-4 col-sm-4 col-xs-4 bold">Opportunities Files</h3>
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="drop-actions">
                <label htmlFor="file_input_id" style={{ color: '#2e71d9', cursor: 'pointer' }}>
                    <i className="fa fa-upload"></i>  Upload Files
            </label>
                <input type="file" multiple style={{ display: 'none' }} id="file_input_id" onChange={onUpload} />
                <label style={{ color: '#2e71d9', cursor: 'pointer', paddingLeft: '15px' }}>
                    <span onClick={hideShowHandler}>
                        {hidden ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}  {hidden ? 'Hide deleted files' : 'Show deleted files'}
                    </span>
                </label>
            </div>
        </div>
        <div className="btn-group  btn-group-circle change-view-btn">
            <button className="btn btn-default btn-sm" id="list" onClick={toggleDropzoneView}
                style={{ backgroundColor: defaultView ? '#a9a9a9' : '' }}>
                <span className="fa fa-list view-icon">
                </span>List</button>
            <button className="btn btn-default btn-sm" id="grid" onClick={toggleDropzoneView}
                style={{ backgroundColor: defaultView ? '' : '#a9a9a9' }}>
                <span className="fa fa-th-large view-icon">
                </span>Grid</button>
        </div>
    </div>
)