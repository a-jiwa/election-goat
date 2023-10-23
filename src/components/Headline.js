import React from 'react';

function Headline() {
    // Define an array of numbers
    const numbers = [44, 26, 10, 6, 4];

    const colors = ["#E4003B", "#0087DC", "#49b90c", "#efbb39", "#ae0fe5"];

    // Define an array of party names
    const partyNames = ["Labour", "Tories", "Greens", "Lib Dems", "SNPs"];

    return (
        <div className="headline">
            {numbers.map((number, index) => (
                <div key={index} className="party-container">
                    <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25" cy="25" r="25" fill={colors[index]} />
                        <text
                            x="50%"
                            y="35%"
                            dominantBaseline="text-before-edge"
                            textAnchor="middle"
                            fill="white"
                            fontSize="14px"
                        >
                            {number}
                        </text>
                        <text
                            x="80%"
                            y="50%"
                            dominantBaseline="text-after-edge"
                            textAnchor="middle"
                            fill="white"
                            fontSize="10px"
                        >
                            %
                        </text>
                    </svg>
                    <div className="party-name">{partyNames[index]}</div>
                </div>
            ))}
        </div>
    );
}

export default Headline;
