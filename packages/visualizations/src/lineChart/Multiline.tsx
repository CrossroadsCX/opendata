/** MultilineChart.js */
import React from "react";
import * as d3 from "d3";
import './multiline.css'


const portfolio = [
  {
    date: "2020",
    value: 4000
  },
  {
    date: "2021",
    value: 5000
  },
  {
    date: "2022",
    value: 4000
  },
  {
    date: "2023",
    value: 6000
  },
  {
    date: "2024",
    value: 4000
  }
]


const portfolioData = {
  name: "Portfolio",
  color: "red",
  items: portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
};

export const MultilineChart = ({ }) => {

  const data = [portfolioData]
  const svgRef = React.useRef(null);

  const width = 600
  const height = 300
  const margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60
  }
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  React.useEffect(() => {
    if (data[0]) {
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data[0].items, (d) => d.date))
        .range([50, 500])
        .nice()
        
      const yScale = d3
        .scaleLinear()
        .domain([
          d3.min(data[0].items, (d) => d.value) - 400,
          d3.max(data[0].items, (d) => d.value) + 50
        ])
        .range([height, 0])
        .nice()
      // Create root container where we will append all other chart elements
      const svgEl = d3.select(svgRef.current);
      svgEl.selectAll("*").remove(); // Clear svg content before adding new elements
      const svg = svgEl
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      // Add X grid lines with labels
      const xAxis = d3
        .axisBottom(xScale)
        .ticks(5)
        .tickSize(-height + margin.bottom);
      const xAxisGroup = svg
        .append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);
      xAxisGroup.select(".domain").remove();
      xAxisGroup.selectAll("line").attr("stroke", "rgba(0, 0, 0, 0.2)");
      xAxisGroup
        .selectAll("text")
        .attr("opacity", 0.5)
        .attr("color", "black")
        .attr("font-size", "0.75rem");
      // Add Y grid lines with labels
      const yAxis = d3
        .axisLeft(yScale)
        .ticks(5)
        .tickSize(-width)
        .tickFormat((val) => `${val}`);
      const yAxisGroup = svg.append("g").call(yAxis);
      yAxisGroup.select(".domain").remove();
      yAxisGroup.selectAll("line").attr("stroke", "rgba(0, 0, 0, 0.2)");
      yAxisGroup
        .selectAll("text")
        .attr("opacity", 0.5)
        .attr("color", "black")
        .attr("font-size", "0.75rem");
      // Draw the lines
      const line = d3
        .line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.value));

        console.log(line)

      svg
        .selectAll(".line")
        .data(data)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", (d) => d.color)
        .attr("stroke-width", 3)
        .attr("d", (d) => line(d.items));
    }
  }, [data]);

  return (
    <div className="App">
      <svg ref={svgRef} width={svgWidth} height={svgHeight} />
    </div>
  )
}
