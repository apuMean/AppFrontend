const validate = values => {
	const errors = {};
	if (!values.projectName) {
		errors.projectName = 'Required';
	}
	if (!values.projectLocation) {
		errors.projectLocation = 'Required';
	}
	if (!values.summary) {
		errors.summary = 'Required';
	}
	if (!values.note) {
		errors.note = 'Required';
	}
	//   if (!values.customer) {
	//     errors.customer = 'Required'
	//   }
	//   if (!values.individual) {
	//     errors.individual = 'Required'
	//   }
	//   if (!values.salesRep) {
	//     errors.salesRep = 'Required'
	//   }
	//   else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
	//       errors.email='Invalid email address'
	// }  
	return errors;
};
  
export default validate;
  