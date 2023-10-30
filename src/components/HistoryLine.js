import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function MultiLineChart({ data }) {
    const chartRef = useRef(null);
    const [redraw, setRedraw] = useState(false);

    const colorMap = {
        'Con': '#0087DC',  // Conservative Party blue
        'Lab': '#E4003B',  // Labour Party red
        'LD': '#efbb39',
        'SNP': '#ae0fe5',
        'Green': 'green',
        'Reform': '#13d3e7',
        'Others': 'gray'
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

        const margin = { top: 10, right: 30, bottom: 30, left: 60 };
        const graphWidth = width - margin.left - margin.right;
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
            .range([0, graphWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, maxYValue])
            .range([graphHeight, 0]);

        // Draw X & Y axes
        content.append("g")
            .attr("transform", `translate(0,${graphHeight})`)
            .call(d3.axisBottom(xScale));

        content.append("g")
            .call(d3.axisLeft(yScale).tickValues([0, maxYValue]))
            .attr("class", "y-axis"); // Added class for styling


// Draw the line
        keys.forEach(key => {
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
            path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2000) // You can adjust this for faster/slower animation
                .attr("stroke-dashoffset", 0);
        });



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
