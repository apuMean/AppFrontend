import React from 'react';

class SingleInput extends React.Component {
  render() {
    return (
      <div id={this.props.parentDivId || null} className={this.props.parentDivClass || null}>
        <input
          type={this.props.inputType || null}
          className={this.props.className || null}
          name={this.props.name || null}
          id={this.props.id || null}
          ref={this.props.name || null}
          defaultValue={this.props.defaultValue || null}
          onBlur={this.props.handleOnBlur || null}
          onChange={this.props.handleOnChange || null}
          key={this.props.key || null}
          min={this.props.min === 0 ? 0 : this.props.min || null}
          max={this.props.max || null}
          disabled={this.props.disabled || null}
        />
        <label htmlFor={this.props.htmlFor || null}>
          {this.props.title || null}
          {this.props.required || null ? <span className="required">*</span> : null}
        </label>
      </div>
    );
  }
}

SingleInput.propTypes = {
  inputType: React.PropTypes.oneOf(['text', 'number']),
  parentDivId: React.PropTypes.string,
  parentDivClass: React.PropTypes.string,
  className: React.PropTypes.string,
  title: React.PropTypes.string,
  name: React.PropTypes.string,
  ref: React.PropTypes.string,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  disabled: React.PropTypes.bool,
  id: React.PropTypes.string,
  key: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  htmlFor: React.PropTypes.string,
  handleOnBlur: React.PropTypes.func,
  handleOnChange: React.PropTypes.func,
  defaultValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  required: React.PropTypes.bool
};

export default SingleInput; 