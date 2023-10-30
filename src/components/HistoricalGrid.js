// HistoricalGrid.jsx
import React, { useState, useEffect } from 'react';
import YearButton from './YearButton';
import MultiLineChart from './HistoryLine';

const YEARS = [2019, 2017, 2015, 2010, 2005, 2001, 1997, 1992, 1987];

const ELECTION_DATA = {
    2019: {
        party: 'conservatives',
        description: 'The lead-up to the 2019 UK election was dominated by the divisive Brexit issue, with ongoing negotiations, parliamentary gridlock, and the resignations of key government officials. Additionally, concerns over the state of the National Health Service (NHS) and the rising levels of violent crime in major cities took center stage as critical topics for voters. Amidst these challenges, the question of leadership and the future direction of the United Kingdom were paramount in the minds of the electorate.',
    },
    2017: {
        party: 'conservatives',
        description: 'The 2017 UK election was characterized by the unexpected snap election called by Prime Minister Theresa May, seeking a stronger mandate for her government\'s Brexit negotiations. It unfolded against the backdrop of terrorist attacks in Manchester and London, which led to intensified debates on national security and counterterrorism measures. Moreover, domestic issues such as healthcare funding and education reforms also played significant roles in shaping the election discourse.',
    },
    2015: {
        party: 'conservatives',
        description: 'The 2015 UK election was defined by the clash of economic ideologies, with the Conservative Party championing austerity measures as the path to fiscal responsibility, while the Labour Party advocated for increased public spending and social welfare programs. Concerns about immigration and national identity also featured prominently in the campaign, fueled by the rise of the UK Independence Party (UKIP). Additionally, the Scottish National Party (SNP) surged in popularity, leading to discussions of greater devolution and the possibility of a second Scottish independence referendum.',
    },
    2010: {
        party: 'conservatives',
        description: 'The 2010 UK general election was marked by a significant shift in the political landscape, as no single party secured an outright majority in the House of Commons. This "hung parliament" led to intense negotiations and the formation of a coalition government between the Conservative Party, led by David Cameron, and the Liberal Democrats, led by Nick Clegg. The economic backdrop of the global financial crisis and concerns about government spending and deficit reduction were central issues in the campaign, along with discussions on electoral reform and the role of the UK in international conflicts, such as the war in Afghanistan.',
    },
    2005: {
        party: 'labour',
        description: 'The 2005 UK general election unfolded in the aftermath of the Iraq War and saw Prime Minister Tony Blair seeking re-election for a third term. The war, along with concerns about terrorism and national security, remained prominent issues during the campaign, as did debates over public services, including healthcare and education. Additionally, the economy and taxation policies were at the forefront of voters\' minds, making it a multifaceted election marked by discussions on foreign policy, domestic issues, and the leadership of the Labour Party.',
    },
    2001: {
        party: 'labour',
        description: 'The 2001 UK general election took place against the backdrop of Prime Minister Tony Blair\'s first term in office and his Labour Party\'s strong majority in Parliament. It was a campaign characterized by a sense of continuity, with Blair\'s government focusing on issues such as healthcare reform, education, and economic stability. The election also occurred in the wake of the September 11th terrorist attacks in the United States, leading to heightened concerns about national security and Britain\'s role in the global fight against terrorism.',
    },
    1997: {
        party: 'labour',
        description: 'The 1997 UK general election marked a historic turning point in British politics, as the Labour Party, led by Tony Blair, swept to power after 18 years of Conservative Party rule. The campaign was centered around Blair\'s promise of a "New Labour" agenda, emphasizing modernization, social justice, and investment in public services. Key issues included healthcare reform, education, and the state of the economy, with a strong desire for change resonating among voters. This election ushered in a new era in British politics, with a focus on the "Third Way" and a departure from traditional left-right divisions.',
    },
    1992: {
        party: 'conservatives',
        description: 'The 1992 UK general election was a closely contested battle between the Conservative Party, led by Prime Minister John Major, and the Labour Party, led by Neil Kinnock. It followed a period of economic turbulence and internal divisions within the Conservative Party, but Major\'s government ultimately secured victory, albeit with a reduced majority. Key issues included the state of the economy, unemployment, and public services, as well as the debate over the UK\'s relationship with Europe. The election outcome reaffirmed the Conservative Party\'s grip on power for another term and had a significant impact on the direction of British politics in the 1990s.',
    },
    1987: {
        party: 'conservatives',
        description: 'The 1987 UK general election saw Conservative Prime Minister Margaret Thatcher seeking re-election for a third consecutive term. The campaign was marked by her government\'s focus on economic prosperity, deregulation, and privatization, which were seen as key to Britain\'s success. Additionally, the election centered on issues such as law and order, with debates over crime and the Conservative Party\'s "tough on crime" stance. Thatcher\'s strong leadership and the appeal of her government\'s economic policies ultimately led to a resounding victory for the Conservative Party, solidifying her status as one of Britain\'s most iconic leaders of the 20th century.',
    }
};

function MainComponent() {
    const [activeYear, setActiveYear] = useState(2019);
    const [electionData, setElectionData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://raw.githubusercontent.com/a-jiwa/UK-Election-Polling-History/main/json_files/election_data_${activeYear}.json`);
                const data = await response.json();
                setElectionData(data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, [activeYear]);

    return (
        <div className="historical-container">
            <h3 className="election-intro">The lead up to previous elections</h3>
            <h1 className="election-year-heading">
                How was{' '}
                <span className={ELECTION_DATA[activeYear].party + ' highlighted-year'}>
          {activeYear}
        </span>{' '}
                different?
            </h1>
            <p className="election-description">{ELECTION_DATA[activeYear].description}</p>

            <div className="year-buttons-container">
                {YEARS.map(year => (
                    <YearButton
                        key={year}
                        year={year}
                        isActive={year === activeYear}
                        onClick={() => setActiveYear(year)} // Adjusted this to be an arrow function
                    />
                ))}
            </div>

            {electionData && <MultiLineChart data={electionData.data} />}
        </div>
    );
}

export default MainComponent;
