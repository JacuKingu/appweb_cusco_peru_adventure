import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ name, placeholder, value, onChange, type = 'text', className = '' }) => {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`border p-2 rounded mb-4 w-full ${className}`}
        />
    );
};

Input.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    className: PropTypes.string,
};

export default Input;
