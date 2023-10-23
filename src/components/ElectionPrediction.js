import React from 'react';

const ElectionPrediction = () => {
    const data = [
        { party: "Conservative", seats: 365, gains: 75, losses: 9, net: "+66", voteShare: "43.6%", change: "+1.2%", totalVotes: "13,966,565", className: "Conservative" },
        { party: "Labour", seats: 203, gains: 13, losses: 55, net: "-42", voteShare: "32.2%", change: "-7.8%", totalVotes: "10,295,607", className: "Labour" },
        { party: "Scottish National Party", seats: 48, gains: 14, losses: 1, net: "+13", voteShare: "3.9%", change: "+0.8%", totalVotes: "1,242,372", className: "ScottishNationalParty" },
        { party: "Liberal Democrat", seats: 11, gains: 3, losses: 13, net: "-10", voteShare: "11.6%", change: "+4.2%", totalVotes: "3,696,423", className: "LiberalDemocrat" },
        { party: "Democratic Unionist Party", seats: 8, gains: 0, losses: 2, net: "-2", voteShare: "0.8%", change: "-0.1%", totalVotes: "244,128", className: "DemocraticUnionistParty" },
        { party: "Sinn Féin", seats: 7, gains: 1, losses: 1, net: "+0", voteShare: "0.6%", change: "-0.2%", totalVotes: "181,853", className: "SinnFein" },
        { party: "Plaid Cymru", seats: 4, gains: 0, losses: 0, net: "+0", voteShare: "0.5%", change: "+0%", totalVotes: "153,265", className: "PlaidCymru" },
        { party: "Social Democratic and Labour Party", seats: 2, gains: 2, losses: 0, net: "+2", voteShare: "0.4%", change: "+0.1%", totalVotes: "118,737", className: "SDLP" },
        { party: "Green", seats: 1, gains: 0, losses: 0, net: "+0", voteShare: "2.7%", change: "+1.1%", totalVotes: "865,697", className: "Green" },
        { party: "Alliance", seats: 1, gains: 1, losses: 0, net: "+1", voteShare: "0.4%", change: "+0.2%", totalVotes: "134,115", className: "Alliance" },
        { party: "Brexit", seats: 0, gains: 0, losses: 0, net: "+0", voteShare: "2%", change: "+2%", totalVotes: "642,303", className: "Brexit" },
        { party: "Ind", seats: 0, gains: 0, losses: 23, net: "-23", voteShare: "0.6%", change: "+0.2%", totalVotes: "196,843", className: "Ind" },
        { party: "Change", seats: 0, gains: 0, losses: 5, net: "-5", voteShare: "0%", change: "+0%", totalVotes: "10,006", className: "Change" },
        { party: "Other", seats: 0, gains: 0, losses: 0, net: "+0", voteShare: "0.8%", change: "-1.6%", totalVotes: "264,002", className: "Other" },
    ];

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
            <h2>If the election was called today we predict:</h2>
            <h3>{generateTitle()}</h3> {/* This line displays the generated title */}
            <table>
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
                    <tr key={index} className={row.className}>
                        <td>{row.party}</td>
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
