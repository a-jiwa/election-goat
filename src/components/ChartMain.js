import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const PollGraph = ({ data, events, svgWidth }) => {
    const svgRef = useRef();

    const colorMap = {
        'Con': '#0087DC',  // Conservative Party blue
        'Lab': '#E4003B',  // Labour Party red
        'Lib Dems': '#efbb39',
        'SNP': '#ae0fe5',
        'Green': 'green',
        'Reform': '#13d3e7',
        'Others': 'gray'
    };

    function interpolateYValue(dataPoints, date) {
        for (let i = 0; i < dataPoints.length - 1; i++) {
            const currentPoint = dataPoints[i];
            const nextPoint = dataPoints[i + 1];

            const currentDate = new Date(currentPoint.Date);
            const nextDate = new Date(nextPoint.Date);

            if (currentDate <= date && date <= nextDate) {
                // Linear interpolation formula: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
                return currentPoint.WeeklyAvg +
                    (date - currentDate) * (nextPoint.WeeklyAvg - currentPoint.WeeklyAvg) /
                    (nextDate - currentDate);
            }
        }
        return null;
    }

    function sanitizePartyName(party) {
        return party.replace(/\s+/g, '-');
    }

    function getFormattedPercentage(value) {
        return (value * 100).toFixed(2) + '%';
    }


    useEffect(() => {
        const svg = d3.select(svgRef.current);

        svg.select(".chart-content").selectAll("*").remove();

        const xScale = d3
            .scaleTime()
            .domain([
                d3.min(data, party => d3.min(party.Values, d => new Date(d.Date))),
                d3.max(data, party => d3.max(party.Values, d => new Date(d.Date)))
            ])
            .range([svgWidth * 0.05, svgWidth * 0.99]);  // Adjust percentages based on your design

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, party => d3.max(party.Values, d => d3.max(d.Actual)))])
            .range([550, 50]);

        const xAxis = d3.axisBottom(xScale)
            .tickSize(-500)
            .tickFormat(d => d3.timeFormat("%b %Y")(d).toUpperCase());


        const yAxis = d3.axisLeft(yScale)
            .tickSize(-1050)  // This is the negative width of the main charting area
            .tickFormat(d => `${(d * 100).toFixed(0)}%`);

        svg.selectAll(".tick line")
            .attr("stroke", "lightgray")
            .attr("stroke-opacity", 0.5)
            .attr("shape-rendering", "crispEdges");

        const isSmallScreen = svgWidth < 800;
        const fontSizeForTick = isSmallScreen ? "10px" : "14px";

        svg.select(".x-axis")
            .style("transform", "translateY(550px)")
            .call(xAxis)
            .style("font-family", "'Courier', monospace")
            .selectAll(".tick text")
            .attr("transform", "rotate(-45)")
            .attr("dy", "0em")  // Adjusts vertical position. Modify value as needed.
            .attr("dx", "-3em")  // Adjusts vertical position. Modify value as needed.
            .style("font-family", "'Courier', monospace"); // Set font to Courier

        svg.selectAll(".tick text")
            .style("font-size", fontSizeForTick)

        svg.select(".y-axis")
            .style("transform", "translateX(50px)")
            .call(yAxis)
            .call(g => g.select(".domain").remove())  // This line removes the domain line
            .selectAll(".tick text")
            .attr("dx", isSmallScreen ? "-2.5em" : "-0.5em")
            .style("font-family", "'Courier', monospace"); // Set font to Courier


        // Draw weekly average lines for each party
        const line = d3
            .line()
            .x(d => xScale(new Date(d.Date)))
            .y(d => yScale(d.WeeklyAvg))
            .defined(d => d.WeeklyAvg !== null);

        const allPartyLines = {};
        data.forEach(party => {
            allPartyLines[party.Party] = party.Values.filter(d => d.WeeklyAvg !== null);
        });
        data.forEach(party => {
            const partyColor = colorMap[party.Party] || 'grey';  // Default to grey if party's color isn't defined

            // Draw poll circles - adjusted for Actual array
            party.Values.forEach(dateEntry => {
                dateEntry.Actual.forEach(value => {
                    svg.select(".chart-content").append("circle")
                        .attr("cx", xScale(new Date(dateEntry.Date)))
                        .attr("cy", yScale(value))
                        .attr("r", 2)
                        .attr("fill", partyColor)
                        .attr("opacity", 0.3);  // Lowered opacity for points
                });
            });

            // Filter the data for the line to only include values where WeeklyAvg is not null
            const lineData = party.Values.filter(d => d.WeeklyAvg !== null);

            // Draw weekly average lines
            svg.select(".chart-content")
                .append("path")
                .datum(lineData)
                .attr("d", line)
                .attr("stroke", partyColor)
                .attr("stroke-width", 2.5)  // Thicker line
                .attr("fill", "none");
        });

        // Mouse tracking line
        const mouseG = svg.select(".chart-content").append("g").attr("class", "mouse-over-effects");


        mouseG
            .append("path")
            .attr("class", "mouse-line")
            .style("stroke", "lightgray")
            .style("stroke-width", 1)
            .style("opacity", 0);

        mouseG
            .append("text")
            .attr("class", "mouse-text")
            .style("opacity", 0);

        svg.on("mousemove", function(event) {
            Object.keys(allPartyLines).forEach(party => {
                mouseG.select(`.intersection-circle-${sanitizePartyName(party)}`).remove();
                mouseG.select(`.percentage-text-${sanitizePartyName(party)}`).remove();  // Removing the percentage text
                mouseG.select(`.percentage-text-outline-${sanitizePartyName(party)}`).remove();  // Removing the percentage text
            });

            const mouseX = d3.pointer(event, this)[0];
            if (mouseX > 50 && mouseX < (svgWidth * 0.99)) {
                svg.style("cursor", "crosshair");  // Set the cursor to cross
                d3.select(".mouse-line")
                    .attr("d", () => {
                        let d = "M" + mouseX + ",550";
                        d += " " + mouseX + ",50";
                        return d;
                    })
                    .style("opacity", 1);

                // Get the date from the x position
                const date = xScale.invert(mouseX);

                // For matching with events
                const matchFormatter = d3.timeFormat("%d %B %Y");
                const matchFormattedDate = matchFormatter(date);

                // For displaying on graph
                const displayFormatter = d3.timeFormat("%b %d, %Y");
                const displayFormattedDate = displayFormatter(date);

                // Update the text displayed above the vertical line with `displayFormattedDate`
                svg.select(".mouse-text")
                    .attr("x", mouseX)
                    .attr("y", 40)  // Adjust this value as needed to position the text
                    .style("text-anchor", "middle")
                    .text(displayFormattedDate)
                    .style("opacity", 1)
                    .style("font-family", "'Roboto', sans-serif");

                // Check if the date exists in the events.json using the matchFormattedDate
                const matchingEvents = events.filter(event => event.Date === matchFormattedDate);

                if (matchingEvents.length) {
                    // Update the events section with the corresponding events
                    d3.select(".events-section").remove(); // Clear the previous event first

                    const eventG = svg.select(".chart-content").append("g").attr("class", "events-section");

                    // Display the date at the top of the events section
                    eventG.append("text")
                        .attr("x", 60)
                        .attr("y", 650)
                        .text(matchFormattedDate)
                        .style("font-family", "'Roboto', sans-serif")
                        .style("font-size", "16px")
                        .style("font-weight", "bold");

                    // Display the list of events below the date
                    eventG.selectAll(".event-text")
                        .data(matchingEvents)
                        .enter()
                        .append("text")
                        .attr("x", 60)
                        .attr("y", (d, i) => 670 + i * 30)  // Adjust for the space needed for the date
                        .text(d => `• ${d.Event}`)
                        .style("font-family", "'Roboto', sans-serif")
                        .style("font-size", "14px");

                } else {
                    d3.select(".events-section").remove();  // Clear the events section if no events match
                }

                Object.entries(allPartyLines).forEach(([party, lineData]) => {
                    const interpolatedY = interpolateYValue(lineData, date);
                    if (interpolatedY === null) return;

                    const intersectionY = yScale(interpolatedY);

                    mouseG.append("circle")
                        .attr("class", `intersection-circle-${sanitizePartyName(party)}`)
                        .attr("cx", mouseX)
                        .attr("cy", intersectionY)
                        .attr("r", 5)
                        .attr("fill", colorMap[party]);

                    mouseG.append("text")
                        .attr("class", `percentage-text-outline-${sanitizePartyName(party)}`)
                        .attr("x", mouseX + 5)  // Positioning the text to the right of the circle
                        .attr("y", intersectionY - 10)  // Adjusting the vertical position slightly above the circle
                        .style("font-family", "'Roboto', sans-serif")
                        .attr("font-size", "15px")  // Adjust this value as per the desired size
                        .attr("fill", 'white')
                        .attr("stroke", "white")
                        .attr("stroke-width", 3)  // Adjust for desired stroke thickness
                        .style("font-weight", 'bold')  // Make the text bold
                        .text(getFormattedPercentage(interpolatedY));  // Setting the interpolated percentage as text

                    // Add the interpolated percentage text
                    mouseG.append("text")
                        .attr("class", `percentage-text-${sanitizePartyName(party)}`)
                        .attr("x", mouseX + 5)  // Positioning the text to the right of the circle
                        .attr("y", intersectionY - 10)  // Adjusting the vertical position slightly above the circle
                        .style("font-family", "'Roboto', sans-serif")
                        .attr("font-size", "15px")  // Adjust this value as per the desired size
                        .attr("fill", colorMap[party])
                        .style("font-weight", 'bold')  // Make the text bold
                        .text(getFormattedPercentage(interpolatedY));  // Setting the interpolated percentage as text
                });

            } else {
                svg.style("cursor", "default");  // Reset the cursor when outside the region
            }
        })
            .on("mouseleave", function() {
                svg.style("cursor", "default");  // Reset the cursor when mouse leaves the SVG
                d3.select(".mouse-line").style("opacity", 0);
                d3.select(".mouse-text").style("opacity", 0);  // Hide the text on mouse leave
                mouseG.selectAll("circle[class^='intersection-circle']").remove();
                mouseG.selectAll("text[class^='percentage-text']").remove();
            });

    }, [data, svgWidth]);

    return (
        <svg ref={svgRef} width={svgWidth} height="800">
            <g className="chart-content" />
            <g className="x-axis" />
            <g className="y-axis" />
        </svg>

    );
};

function ChartMain() {
    const [fetchedPollData, setFetchedPollData] = useState([]);
    const [fetchedEvents, setFetchedEvents] = useState([]);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        // Fetch poll data
        fetch('https://a-jiwa.github.io/uk-poll-data/poll_data.json')
            .then(response => response.json())
            .then(data => setFetchedPollData(data))
            .catch(error => console.error("Error fetching poll data:", error));

        // Fetch events data
        fetch('https://a-jiwa.github.io/uk-poll-data/events.json')
            .then(response => response.json())
            .then(data => setFetchedEvents(data))
            .catch(error => console.error("Error fetching events data:", error));

    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            console.log(window.innerWidth)
        };

        window.addEventListener('resize', handleResize);

        return () => {
            // Cleanup - remove the listener when the component unmounts
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    let svgWidth = windowWidth * 0.8;  // Default width
    if (windowWidth < 600) {
        svgWidth = windowWidth;
    } else if (windowWidth > 1400) {
        svgWidth = 1120;
    }

    return (
        <div className="chart-main">
            <PollGraph data={fetchedPollData} events={fetchedEvents} svgWidth={svgWidth} />
        </div>
    );
}

export default ChartMain;


