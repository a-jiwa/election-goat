// HistoricalGrid.js
import React from 'react';
import HistoricalChart from './HistoricalChart';

const electionWinners = [
    { year: 2019, date: '2019-12-12', previous: 'Conservative', winner: 'Johnson', party: 'Conservative', leaders: ['Boris Johnson', 'Liz Truss', 'Rishi Sunak'], file: 'election_data_2019.json' },
    { year: 2017, date: '2017-06-08', previous: 'Conservative', winner: 'May', party: 'Conservative', leaders: ['Theresa May', 'Boris Johnson'], file: 'election_data_2017.json' },
    { year: 2015, date: '2015-05-07', previous: 'Conservative', winner: 'Cameron', party: 'Conservative', leaders: ['David Cameron', 'Theresa May'], file: 'election_data_2015.json' },
    { year: 2010, date: '2010-05-06', previous: 'Labour', winner: 'Cameron', party: 'Conservative', leaders: ['David Cameron'], file: 'election_data_2010.json' },
    { year: 2005, date: '2005-05-05', previous: 'Labour', winner: 'Blair', party: 'Labour', leaders: ['Tony Blair', 'Gordon Brown'], file: 'election_data_2005.json' },
    { year: 2001, date: '2001-06-07', previous: 'Labour', winner: 'Blair', party: 'Labour', leaders: ['Tony Blair'], file: 'election_data_2001.json' },
    { year: 1997, date: '1997-05-01', previous: 'Conservative', winner: 'Blair', party: 'Labour', leaders: ['Tony Blair'], file: 'election_data_1997.json' },
    { year: 1992, date: '1992-04-09', previous: 'Conservative', winner: 'Major', party: 'Conservative', leaders: ['John Major'], file: 'election_data_1992.json' },
    { year: 1987, date: '1987-06-11', previous: 'Conservative', winner: 'Thatcher', party: 'Conservative', leaders: ['Margaret Thatcher'], file: 'election_data_1987.json' },
];

const HistoricalGrid = () => {
    return (
        <div className='historical-section'>
            <h3 className='historical-title'>Previous Elections</h3>
            <div className='historical-grid'>
                {electionWinners.map(({ year, previous, date, winner, party, file, leaders }, index) => (
                    <HistoricalChart
                        key={index}
                        url={file}
                        year={year}
                        date={date}
                        previous={previous}
                        winner={winner}
                        party={party}
                        leaders={leaders} // if you plan to use leaders info in HistoricalChart
                    />
                ))}
            </div>
        </div>
    );
};

export default HistoricalGrid;
