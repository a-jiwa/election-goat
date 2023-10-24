import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HistoricalChart = ({ url, year, date, winner, party, previous, leaders }) => {
    const chartRef = useRef(null);

    const significantDates = [
        { date: '1990-11-28', label: 'Thatcher Resigns' }, // Margaret Thatcher announced her resignation as Prime Minister in November 1990.
        { date: '1992-09-16', label: 'Black Wednesday' }, // The UK's withdrawal from the ERM (Exchange Rate Mechanism) on a day known as Black Wednesday.
        { date: '2003-03-20', label: 'Iraq War' }, // The UK, alongside the US, invaded Iraq on allegations of weapons of mass destruction.
        { date: '2000-09-08', label: 'Fuel Protests' }, // The miners' strike of 1984-85 was a major industrial action affecting the British coal industry.
        { date: '2008-09-15', label: 'Financial Crisis' }, // Height of the global financial crisis, with significant events like the fall of Lehman Brothers.
        { date: '2010-05-11', label: 'Cameron Becomes PM' }, // David Cameron became Prime Minister, leading a coalition government with the Liberal Democrats.
        { date: '2015-05-02', label: '2015 Election' },
        { date: '2016-06-23', label: 'Brexit Referendum' }, // The UK voted to leave the EU in a historic referendum.
        { date: '2017-06-08', label: 'Snap Election' }, // Theresa May's snap general election, which resulted in a hung parliament.
        { date: '2019-06-08', label: 'May Resigns' },
    ];

    useEffect(() => {
        if (!chartRef.current) return;

        console.log(`https://raw.githubusercontent.com/a-jiwa/UK-Election-Polling-History/main/json_files/${url}`);

        fetch(`https://raw.githubusercontent.com/a-jiwa/UK-Election-Polling-History/main/json_files/${url}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Define party colors
                const partyColors = {
                    "Labour": "#E4003B",
                    "Conservative": "#0087DC",
                    "LD": "#efbb39",
                    "Green": "rgba(73,185,12,0)",
                    "UKIP": "rgba(174,15,229,0)",
                    "TIG": "rgba(15,211,229,0)",
                    "BXP": "rgba(44,61,10,0)",
                    "SDP": "rgba(44,61,10,0)",
                };

                const margin = { top: 60, right: 60, bottom: 60, left: 60 };
                const width = 800 - margin.left - margin.right;
                const height = 500 - margin.top - margin.bottom;

                // Clear previous SVG
                d3.select(chartRef.current).selectAll('*').remove();

                // Set up SVG
                const svg = d3.select(chartRef.current)
                    .append('svg')
                    .attr('width', '100%')
                    .attr('height', '100%')
                    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                // Create scales
                const xScale = d3.scaleTime().range([0, width]);
                const yScale = d3.scaleLinear().range([height, 0]);

                // Set the domains for the scales
                xScale.domain(d3.extent(data.data, d => new Date(d.Date)));
                yScale.domain([5, 56]);

                // Generate axes
                const xAxis = d3.axisBottom(xScale)
                    .ticks(d3.timeYear.every(1))
                    .tickFormat(d3.timeFormat("%y"));

                const yAxis = d3.axisLeft(yScale)
                    .tickValues([5, 55])
                    .tickFormat(d => `${d}%`);

                // Append x-axis and assign a class
                const xAxisG = svg.append('g')
                    .attr('transform', `translate(0,${height})`)
                    .attr('class', 'axis')
                    .call(xAxis)
                    .call(g => g.select(".domain").remove());

                // Add vertical dotted lines at each of the yearly markers
                xAxisG.selectAll(".tick").append("line")
                    .attr("stroke", "#8d8d8d")
                    .attr("stroke-dasharray", "2,6")
                    .attr("stroke-width", 3)
                    .attr("y1", 0)
                    .attr("y2", -height);

                // Append y-axis and assign a class
                svg.append('g')
                    .attr('class', 'axis')
                    .call(yAxis);

                // Calculate the x position of the election date
                const electionDate = new Date(date);
                const xPos = xScale(electionDate);

                // Draw a vertical line at the election date
                svg.append('line')
                    .style('stroke', '#ff2abd')
                    .style('stroke-width', 3)
                    .style('stroke-dasharray', '3, 3')
                    .attr('x1', xPos)
                    .attr('y1', 0)
                    .attr('x2', xPos)
                    .attr('y2', height);

                svg.append('text')
                    .attr('x', xPos)
                    .attr('y', -7)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '20px')
                    .style('fill', '#ff2abd')
                    .text('Election')

                // Check if a date is within the chart's range and if so, draw a line and label
                significantDates.forEach(({ date, label }) => {
                    const significantDate = new Date(date);
                    if (significantDate >= xScale.domain()[0] && significantDate <= xScale.domain()[1]) {
                        const xPos = xScale(significantDate);

                        // Draw a vertical line at this date
                        svg.append('line')
                            .style('stroke', 'rgba(51,51,51,0.93)')
                            .style('stroke-width', 3)
                            .style('stroke-dasharray', '3, 10')
                            .attr('x1', xPos)
                            .attr('y1', 45)
                            .attr('x2', xPos)
                            .attr('y2', height);

                        // Add a label for this line
                        svg.append('text')
                            .attr('x', xPos)
                            .attr('y', 30)
                            .attr('text-anchor', 'middle')
                            .style('font-size', '25px')
                            .style('fill', 'rgba(51,51,51,0.93)')
                            .text(label);
                    }
                });

                // Add title
                svg.append("text")
                    .attr("x", (width / 2))
                    .attr("y", 0 - (margin.top / 10))
                    .attr("text-anchor", "middle")
                    .style("font-size", "35px")
                    .text(`${year}`);

                // Add color to the winner's name based on their party
                svg.append("text")
                    .attr("x", (width / 2))
                    .attr("y", 0 - (margin.top / 1.5))
                    .attr("text-anchor", "middle")
                    .style("font-size", "25px")
                    .style("fill", partyColors[party])
                    .text(winner);

                const parties = Object.keys(data.data[0]).filter(key => key !== "Date");
                console.log(parties);

                parties.forEach(partyKey => {
                    const line = d3.line()
                        .x(d => xScale(new Date(d.Date)))
                        .y(d => yScale(d[partyKey] || 0))
                        .defined(d => !isNaN(d[partyKey]));

                    // Check if the current party is the "previous" party and set opacity accordingly
                    const isPreviousParty = previous === partyKey;
                    const lineOpacity = isPreviousParty ? 1 : 0.9;
                    const lineWidth = isPreviousParty ? 4 : 3.5;
                    const lineDashed = isPreviousParty ? '1' : '2, 5';

                    svg.append('path')
                        .datum(data.data)
                        .attr('fill', 'none')
                        .attr('stroke', partyColors[partyKey] || "black")
                        .attr('stroke-linejoin', 'round')
                        .attr('stroke-linecap', 'round')
                        .attr('stroke-width', lineWidth)
                        .style('opacity', lineOpacity)
                        .style('stroke-dasharray', lineDashed)
                        .attr('d', line);
                });

            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }, [url]);

    return <div ref={chartRef} style={{ width: "100%", height: "100%" }}></div>;
};

export default HistoricalChart;
