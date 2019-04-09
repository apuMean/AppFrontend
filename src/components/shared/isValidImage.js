
export function isValidImage(FileUploadPath) {
	if (FileUploadPath == '') {
		toastr.clear();
		toastr.error('Please select a valid image! ie. ".gif, .png, .bmp, .jpeg, .jpg"');
	} else {
		let Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
		if (Extension == 'gif' || Extension == 'png' || Extension == 'bmp'
            || Extension == 'jpeg' || Extension == 'jpg') {
			return true;
		}
		else {
			toastr.clear();
			toastr.error('Please select a valid image! ie. ".gif, .png, .bmp, .jpeg, .jpg"');
			return false;
		}
	}
}




