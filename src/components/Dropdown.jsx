// DropdownExample.js
import React from "react";

function DropdownExample({ options, label, selectedValue, onChange, className }) {
    return (
        <div className="dropdown">
            <label>{label}</label>
            <select className={className}
                value={selectedValue}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="dropdown-option">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default DropdownExample;
