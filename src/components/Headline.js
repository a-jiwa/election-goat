import React from 'react';

function Headline() {
    // Define an array of numbers
    const numbers = [44, 26, 4, 13, 2];

    const colors = ["#E4003B", "#0087DC", "#49b90c", "#efbb39", "#ae0fe5"];

    // Define an array of party names
    const partyNames = ["Labour", "Tories", "Greens", "Lib Dems", "SNPs"];

    return (
        <div className="headline">
            {numbers.map((number, index) => (
                <div key={index} className="party-container">
                    <div className="party-box" style={{ borderColor: colors[index], backgroundColor: lightenColor(colors[index], 0.9) }}>
                        <div className="party-number" style={{ color: colors[index], fontWeight: 'bold' }}>{number}%</div>
                    </div>
                    <div className="party-name" style={{ color: colors[index]}}>{partyNames[index]}</div>
                </div>
            ))}
        </div>
    );
}

// Function to lighten a color
function lightenColor(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const newR = Math.min(Math.round(r + (255 - r) * factor), 255);
    const newG = Math.min(Math.round(g + (255 - g) * factor), 255);
    const newB = Math.min(Math.round(b + (255 - b) * factor), 255);

    return `rgb(${newR},${newG},${newB})`;
}

export default Headline;
