import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, required = false, className = '' }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
        </div>
    );
};

export default Input;
