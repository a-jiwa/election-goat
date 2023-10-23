import React, { useState, useEffect } from 'react';

function TitleTop() {
    const [loadedTime, setLoadedTime] = useState(null);

    useEffect(() => {
        const currentDate = new Date();
        const monthNames = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        const formattedDate = `UPDATED ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}, AT ${currentDate.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })}`;

        setLoadedTime(formattedDate);
    }, []);

    return (
        <div className="title-top">
            {loadedTime}
        </div>
    );
}

export default TitleTop;
