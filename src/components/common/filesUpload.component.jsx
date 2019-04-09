import Dropzone from 'react-dropzone';
import React from 'react';

class FilesUploadScreen extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-9 col-md-9 col-sm-12">
                    <Dropzone
                        activeStyle={{ border: '1px solid #007AF5', background: 'white', padding: '20px', margin: '0 auto', textAlign: 'center' }}
                        disableClick={true}
                        style={{ border: '1px solid #D3D3D3', background: 'white', padding: '20px', margin: '0 auto', textAlign: 'center' }} className="dropzone"
                        onDrop={(files) => this.props.onDrop(files)}>
                        <h3 className="sbold">Drag and drop your files here or click upload.</h3>
                        <div>{this.props.filesPreview}</div>
                    </Dropzone>
                </div>
            </div>
        )
    }
}

export default FilesUploadScreen;