import React from 'react';

const ElectionPrediction = () => {
    const data = [
        {
            party: "Labour",
            seats: 355, // assumed based on significant lead in polls
            gains: 152, // assumed, due to the substantial increase in vote share
            losses: 0,
            net: "+152",
            voteShare: "44%", // from polling
            change: "+11.8%", // change calculated based on difference from current data
            totalVotes: "14,089,814", // assumed, this would need proper calculation based on total votes cast
            className: "Labour"
        },
        {
            party: "Conservative",
            seats: 210, // assumed, significant loss due to lower polling
            gains: 0,
            losses: 155, // assumed, due to the substantial decrease in vote share
            net: "-155",
            voteShare: "26%", // from polling
            change: "-17.6%", // change calculated based on difference from current data
            totalVotes: "8,328,572", // assumed, this would need proper calculation based on total votes cast
            className: "Conservative"
        },
        {
            party: "Liberal Dems",
            seats: 25, // assumed, small gain due to increase in vote share
            gains: 14,
            losses: 0,
            net: "+14",
            voteShare: "13%", // from polling
            change: "+1.4%", // change calculated based on difference from current data
            totalVotes: "4,164,286", // assumed, this would need proper calculation based on total votes cast
            className: "LiberalDemocrat"
        },
        {
            party: "Green",
            seats: 5, // assumed, small gain due to increase in vote share
            gains: 4,
            losses: 0,
            net: "+4",
            voteShare: "4%", // from polling
            change: "+1.3%", // change calculated based on difference from current data
            totalVotes: "1,280,653", // assumed, this would need proper calculation based on total votes cast
            className: "Green"
        },
        {
            party: "SNPs",
            seats: 50, // assumed, small gain, vote share not directly comparable due to different base (GB vs Scotland)
            gains: 2,
            losses: 0,
            net: "+2",
            voteShare: "2%", // from polling, but this is GB-wide, not Scotland specific
            change: "-1.9%", // change calculated based on difference from current data
            totalVotes: "640,326", // assumed, this would need proper calculation based on total votes cast
            className: "ScottishNationalParty"
        },
        // Other parties like Reform not included, can be added similarly
    ];


    const partyColors = {
        Conservative: '#0087DC', // blue
        Labour: '#DC241f', // red
        ScottishNationalParty: '#FFF95D', // yellow
        LiberalDemocrat: '#FDBB30', // orange
        Green: '#6AB023', // green
        // Add more parties and their respective colors here
    };


    const generateTitle = () => {
        // Sort the data based on seats
        const sortedData = [...data].sort((a, b) => b.seats - a.seats);

        // Get the top two parties
        const topParty = sortedData[0];
        const secondTopParty = sortedData[1];

        // Calculate the difference in seats
        const seatDifference = topParty.seats - secondTopParty.seats;

        // Generate a title based on the seat difference
        if (seatDifference > 100) {
            return `Landslide victory for ${topParty.party}`;
        } else if (seatDifference > 50) {
            return `Decisive win for ${topParty.party}`;
        } else if (seatDifference > 0) {
            return `Marginal win for ${topParty.party}`;
        } else {
            return `It's a tie between ${topParty.party} and ${secondTopParty.party}`;
        }
    }


    return (
        <div className="prediction">
            <h2>Election Prediction</h2> {/* Changed the title */}
            <h3>{generateTitle()}</h3> {/* Subtitle showing the generated title */}
            <table className="prediction-table" >
                <thead>
                <tr>
                    <th>Party</th>
                    <th>Seats</th>
                    <th>Gains</th>
                    <th>Losses</th>
                    <th>Net</th>
                    <th>Vote share</th>
                    <th>Change</th>
                    <th>Total votes</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        <td style={{ position: 'relative', paddingLeft: '25px' }}> {/* Adjusted padding to make space for the color square */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    width: '15px',
                                    height: '15px',
                                    backgroundColor: partyColors[row.className],
                                    transform: 'translateY(-50%)',
                                }}
                            />
                            {row.party}
                        </td>
                        <td>{row.seats}</td>
                        <td>{row.gains}</td>
                        <td>{row.losses}</td>
                        <td>{row.net}</td>
                        <td>{row.voteShare}</td>
                        <td>{row.change}</td>
                        <td>{row.totalVotes}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ElectionPrediction;
