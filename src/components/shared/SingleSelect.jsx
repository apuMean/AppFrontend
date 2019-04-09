import React from 'react';

class SingleSelect extends React.Component {
    render() {
        return (
            <div id={this.props.parentDivId || null} className={this.props.parentDivClass || null}>
                <select
                    className={this.props.className || null}
                    name={this.props.name || null}
                    id={this.props.id || null}
                    ref={this.props.id || null}
                    key={this.props.key || null}
                    defaultValue={this.props.defaultValue || null}
                    onBlur={this.props.handleOnBlur || null}
                    onChange={this.props.handleOnChange || null}>
                    {this.props.defaultSelect ? <option value="0">{this.props.placeholder}</option> : null}
                    {this.props.options}
                    {this.props.other ? <option value="other">Add Other</option> : null}
                </select>
                <label htmlFor={this.props.htmlFor || null}>
                    {this.props.title || null}
                    {this.props.required || null ? <span className="required">*</span> : null}
                </label>
            </div>
        );
    }
}

SingleSelect.propTypes = {
    parentDivId: React.PropTypes.string,
    parentDivClass: React.PropTypes.string,
    className: React.PropTypes.string,
    title: React.PropTypes.string,
    name: React.PropTypes.string,
    options: React.PropTypes.array,
    ref: React.PropTypes.string,
    id: React.PropTypes.string,
    key: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
    htmlFor: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    handleOnBlur: React.PropTypes.func,
    handleOnChange: React.PropTypes.func,
    required: React.PropTypes.bool,
    defaultSelect: React.PropTypes.bool,
    other: React.PropTypes.bool,
};

export default SingleSelect; 