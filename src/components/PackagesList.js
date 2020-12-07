import React from 'react';
import PropTypes from 'prop-types';
import '../styles/packages-list.css';

const propTypes = {
  packages: PropTypes.arrayOf(PropTypes.object).isRequired,
  onModifyPackage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const defaultProps = {
  disabled: false,
};

const SinglePackage = ({ packages, onModifyPackage, disabled }) => (
  <ul className="packages-list">
    {packages.map(({ id, quantity, price }, index) => {
      const title = `Package ${index + 1}`;
      return (
        <li className="packages-list__item" key={id}>
          <span>{title}</span>
          <span>
            €
            {(price * quantity).toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => onModifyPackage(id)}
            disabled={disabled}
          >
            Modify
          </button>
        </li>
      );
    })}
  </ul>
);

SinglePackage.defaultProps = defaultProps;
SinglePackage.propTypes = propTypes;

export default SinglePackage;
