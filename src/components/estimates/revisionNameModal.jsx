import React from 'react';
const RevisionModal = (props) => {
    return (
        <div id={props.modalId} className="modal fade bs-modal-sm" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="caption">
                            <span className="caption-subject bold">Name Selected Revision</span>
                        </div>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            className="form-control"
                            id="revName"
                            name="revName"
                            value={props.revName}
                            onChange={props.revisionChangeHandler} />
                    </div>
                    <div className="modal-footer" style={{ textAlign: 'center' }}>
                        <button type="button" className="btn btn-xs red" onClick={e => props.revisionNameHandler('REMOVE', e)}>Remove Name</button>
                        <button type="button" className="btn btn-xs green" onClick={e => props.revisionNameHandler('SAVE', e)}>Save</button>
                        <button type="button" className="btn btn-xs dark btn-outline" onClick={e => props.revisionNameHandler('CLOSE', e)} > Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default RevisionModal;