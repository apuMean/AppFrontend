
export function isValidMaterialSheet(FileUploadPath) {
    debugger
    if (FileUploadPath == '') {
        toastr.clear();
        toastr.error('Please select a valid file,File type invalid!');
    } else {
        let Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
        if (Extension == "csv" || Extension == "xlsx" || Extension == "xls") {
            return true;
        }
        else {
            toastr.clear();
            toastr.error('Please select a valid file,File type invalid!');
            return false;
        }
    }
}




