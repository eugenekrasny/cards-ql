import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  title: PropTypes.string.isRequired,
  onPackageSubmit: PropTypes.func.isRequired,
  onPackageRemove: PropTypes.func.isRequired,
  onEditCancel: PropTypes.func.isRequired,
  quantity: PropTypes.number,
  price: PropTypes.number,
  inEditMode: PropTypes.bool,
  disabled: PropTypes.bool,
};

const defaultProps = {
  quantity: 0,
  price: 0,
  inEditMode: false,
  disabled: false,
};

class OrderForm extends Component {
  constructor(props) {
    super(props);
    const { quantity, price } = props;
    this.state = {
      quantity,
      price,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value,
    });
  }

  onSubmit(event) {
    const { onPackageSubmit } = this.props;
    onPackageSubmit(this.state);
    event.preventDefault();
  }

  render() {
    const { quantity, price } = this.state;
    const {
      inEditMode,
      title,
      disabled,
      onPackageRemove,
      onEditCancel,
    } = this.props;
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <strong>{title}</strong>
          <p>
            <label htmlFor="quantity">
              Please enter quantity of cards:
              &nbsp;
              <input
                type="number"
                name="quantity"
                min={1}
                max={100}
                onChange={this.handleChange}
                value={quantity}
                disabled={disabled}
                required
              />
            </label>
          </p>
          <p>
            <label htmlFor="price">
              Please enter price for each card:
              &nbsp;
              <input
                type="number"
                name="price"
                min={5}
                max={150}
                onChange={this.handleChange}
                value={price}
                disabled={disabled || inEditMode}
                required
              />
            </label>
          </p>
          {!inEditMode && <button type="submit" disabled={disabled}>Add Package</button>}
          {inEditMode
            && (
              <>
                <button type="submit" disabled={disabled}>Save</button>
                &nbsp;
                <button type="button" onClick={onPackageRemove} disabled={disabled}>Remove</button>
                &nbsp;
                <button type="button" onClick={onEditCancel} disabled={disabled}>Cancel</button>
              </>
            )}
        </fieldset>
      </form>
    );
  }
}

OrderForm.defaultProps = defaultProps;
OrderForm.propTypes = propTypes;

export default OrderForm;
