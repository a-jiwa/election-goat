import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function MultiLineChart({ data }) {
    const chartRef = useRef(null);
    const [redraw, setRedraw] = useState(false);

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

    const colorMap = {
        'Con': '#0087DC',  // Conservative Party blue
        'Lab': '#E4003B',  // Labour Party red
        'LD': '#efbb39',
        'SNP': '#ae0fe5',
        'Green': '#3db540',
        'Reform': 'rgba(19,211,231,0)',
        'Others': 'rgba(178,19,231,0)',
        'UKIP': 'rgba(178,19,231,0)',
        'SDP': 'rgba(178,19,231,0)',
        'TIG': 'rgba(178,19,231,0)',
        'BXP': 'rgba(123,87,134,0)',
    };

    const mapKeyToParty = key => {
        switch(key) {
            case 'Conservative': return 'Con';
            case 'Labour': return 'Lab';
            // Add other mappings as necessary
            default: return key;
        }
    };

    useEffect(() => {
        // Dynamically get width and height of parent container
        const width = chartRef.current.clientWidth;
        const height = chartRef.current.clientHeight;


        const margin = { top: 50, right: 20, bottom: 50, left: 50 };
        const padding = 100;  // adjust this value as needed
        const graphWidth = width - margin.left - margin.right - padding;
        const graphHeight = height - margin.top - margin.bottom;

        // Clear SVG
        const svg = d3.select(chartRef.current).html('');

        // Create SVG within chartRef
        const content = svg.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // List of groups = header of the csv files
        const keys = Object.keys(data[0]).filter(key => key !== 'Date');

        // Compute the maximum value from the data
        const maxYValue = d3.max(data, d => {
            return d3.max(keys, key => d[key]);
        });

        // Create X & Y scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.Date)))
            .range([0, graphWidth]);  // the graphWidth already considers the padding

        const yScale = d3.scaleLinear()
            .domain([0, maxYValue])
            .range([graphHeight, 0]);

        // Draw X & Y axes
        content.append("g")
            .attr("transform", `translate(0,${graphHeight})`)
            .call(
                d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat("%b")) // Format as abbreviated month names
                    .tickSize(10) // Adjust the size of the ticks
            )
            .selectAll("text")
            .style("font-size", "14px"); // Set font size for tick labels

        content.append("g")
            .call(d3.axisLeft(yScale).tickValues([0, maxYValue]))
            .attr("class", "y-axis"); // Added class for styling

        // Draw the line
        keys.forEach((key, index) => {
            const party = mapKeyToParty(key);

            const path = content.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colorMap[party])
                .attr("stroke-width", 5) // Adjust for desired thickness
                .attr("d", d3.line()
                    .curve(d3.curveBasis) // This makes the line smoother
                    .x(d => xScale(new Date(d.Date)))
                    .y(d => yScale(d[key]))
                );

            // Animation from left to right
            const totalLength = path.node().getTotalLength();
            const baseDelay = 100;  // You can adjust this value
            path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(1500)
                .delay(index * baseDelay)  // <-- Add this delay
                .attr("stroke-dashoffset", 0)
                .on('end', () => {
                    addCirclesAndText(content, data, xScale, yScale, colorMap, key, mapKeyToParty);
                });

            const lastDataPoint = data[data.length - 1]; // get the last data point
            content.append("circle")
                .attr("cx", xScale(new Date(lastDataPoint.Date)))
                .attr("cy", yScale(lastDataPoint[key]))
                .attr("r", 6) // adjust for desired circle size
                .attr("fill", colorMap[party])
                .style("opacity", 1);  // Add this line


            content.append("text")
                .attr("class", "data-label")  // Add this line
                .attr("x", xScale(new Date(lastDataPoint.Date)) + 10) // slightly to the right of the circle
                .attr("y", yScale(lastDataPoint[key]))
                .attr("dy", "0.35em") // to vertically center text
                .attr("text-anchor", "start") // to align text to the start
                // .style("font-size", "12px")
                .style("fill", colorMap[party])
                .text(lastDataPoint[key] + '%')
                .style("opacity", 1);
        });

        content.selectAll("circle").style("opacity", 0);
        content.selectAll(".data-label").style("opacity", 0);

        significantDates.forEach(dateObj => {
            // Draw the vertical line
            content.append("line")
                .attr("x1", xScale(new Date(dateObj.date)) - 5)
                .attr("x2", xScale(new Date(dateObj.date)) - 5)
                .attr("y1", 0)
                .attr("y2", graphHeight)
                .attr("stroke", "#2f2f2f")
                .attr("stroke-width", 3) // Adjust for desired thickness
                .attr("stroke-dasharray", "4"); // make it dashed, remove if you want a solid line

            // Add the label
            content.append("text")
                .attr("class", "date-label")  // Add this line
                .attr("x", xScale(new Date(dateObj.date)) - 5)
                .attr("y", -10) // position above the chart
                .attr("text-anchor", "middle") // center the text
                .text(dateObj.label);
        });

        function addCirclesAndText(content, data, xScale, yScale, colorMap, key, mapKeyToParty) {
            const party = mapKeyToParty(key);
            const lastDataPoint = data[data.length - 1];
            const circle = content.append("circle")
                .attr("cx", xScale(new Date(lastDataPoint.Date)))
                .attr("cy", yScale(lastDataPoint[key]))
                .attr("r", 6)
                .attr("fill", colorMap[party])
                .style("opacity", 0);

            circle.transition()
                .duration(300)  // Animation duration for circle appearance
                .style("opacity", 1);

            const textLabel = content.append("text")
                .attr("class", "data-label")
                .attr("x", xScale(new Date(lastDataPoint.Date)) + 10)
                .attr("y", yScale(lastDataPoint[key]))
                .attr("dy", "0.35em")
                .attr("text-anchor", "start")
                .style("fill", colorMap[party])
                .text(lastDataPoint[key] + '%')
                .style("opacity", 0);

            textLabel.transition()
                .duration(800)  // Animation duration for text appearance
                .style("opacity", 1);
        }
    }, [data]);

    useEffect(() => {
        // Update chart on window resize
        const handleResize = () => {
            // Toggle the redraw state to trigger a re-render
            setRedraw(!redraw);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [data, redraw]);

    return (
        <div className="chart-container" ref={chartRef}>
            {/* D3 chart will render here */}
        </div>
    );
}

export default MultiLineChart;
