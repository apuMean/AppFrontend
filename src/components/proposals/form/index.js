import React from 'react';
import Select from 'react-select';
import autoBind from 'react-autobind';
import TextareaAutosize from 'react-autosize-textarea';

export const renderTextareaField = (
	{ input,name, label, val, className,meta: { touched, error }},
) => {
	return (<div>
		<TextareaAutosize
			style={{ resize: 'none' }}
			className={className}
			rows={1}
			{...input}
			ref={name}
			name={name}
		>
		</TextareaAutosize>
		{touched && error && <span style={{color:'red'}}>{error}</span>}
	</div>
	);
};


export const renderSelectField = (
	{ input,isdisabled,selectOptions,NoResult,name, val, className,placeholder,onChange,onInputChange},
) => {
	return ( <Select
		disabled={isdisabled}
		value={val}
		placeholder={placeholder}
		noResultsText={NoResult}
		name={name}
		options={selectOptions}
		onChange={onChange}
		onInputChange={onInputChange}
		{...input}
	/>);
};
// export const RadioSelectValueField = (
//     { input, label, onClick, data, val, meta: { touched, error }, ...custom },
// ) => {
//     return (
//         <div className="btn-group" data-toggle="buttons" {...input}>
//             {data.map((value, index) =>
//                 <label onClick = {onClick} className={(input.value === value.value) ? "btn green-meadow active focus" :"btn green-meadow "}>
//                     <input type="radio" className="toggle" value={value.value} /> {value.label}
//                 </label>

//             )}
//             {touched && error && <span className="text-danger"><h5>{error}</h5></span>}
//         </div>

//     )
// }

