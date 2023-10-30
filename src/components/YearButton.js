// YearButton.jsx
import React from 'react';

function YearButton({ year, isActive, onClick }) {
    return (
        <button
            className={`year-button ${isActive ? 'active' : ''}`}
            onClick={() => onClick(year)}
        >
            {year}
        </button>
    );
}

export default YearButton;
