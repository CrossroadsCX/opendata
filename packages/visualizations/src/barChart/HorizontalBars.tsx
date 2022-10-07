/** MultilineChart.js */
import React from 'react';
import * as d3 from 'd3';
import './multiline.css'
import { Dimensions, BarData, DataPoint } from './types'

export type HorizontalBarsChartProps = {
  data: BarData
  dimensions: Dimensions
  xLabel?: string
  yLabel?: string
}


export const HorizontalBarsChart: React.FC<HorizontalBarsChartProps> = ({
  data, dimensions, xLabel, yLabel,
}) => {

  const svgRef = React.useRef(null);

  const width = dimensions.width
  const height = dimensions.height
  const margin = dimensions.margin

  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom + 20;

  React.useEffect(() => {
    if (data.items) {

      const xDomain = d3.extent(data.items, (d: DataPoint) => d.value)
      const xScale = d3
        .scaleLinear()
        .domain(xDomain as Iterable<Number>)
        .range([50, 500])
        .nice()

      const yScale = d3
        .scaleBand()
        .domain(data.items.map(d => d.label as string))
        .range([height, 0])
        .padding(.2)

      // Create root container where we will append all other chart elements
      const svgEl = d3.select(svgRef.current);
      svgEl.selectAll('*').remove(); // Clear svg content before adding new elements
      const svg = svgEl
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      // Add X grid lines with labels
      const xAxis = d3
        .axisBottom(xScale)
        .ticks(5)
        .tickSize(-width + margin.bottom)
        .tickFormat((val) => `${Intl.NumberFormat('en-US', {
          notation: "compact",
          maximumFractionDigits: 1
        }).format(val as number)}`)

      const xAxisGroup = svg
        .append('g')
        .attr('transform', `translate(0, ${height + 50 - margin.bottom})`)
        .call(xAxis)
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').clone()
          .attr('y2', margin.top + margin.bottom - height)
          .attr('stroke-opacity', 0.1))
        .call(g => g.append('text')
          .attr('x', width / 2)
          .attr('y', margin.bottom - 5)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'end')
          .attr('font-weight', 'bold')
          .text(xLabel || ''));

      xAxisGroup.select('.domain').remove();

      xAxisGroup
        .selectAll('line')
        .attr('stroke', 'rgba(0, 0, 0, 0.2)')
        .attr('stroke-width', .5)

      xAxisGroup
        .selectAll('text')
        .attr('opacity', 0.5)
        .attr('color', 'black')
        .attr('font-size', '0.75rem');
      // Add Y grid lines with labels
      const yAxis = d3
        .axisLeft(yScale)
        .ticks(10)
        .tickFormat((val) => `${val}`)

      const yAxisGroup = svg.append('g').call(yAxis)
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').clone()
          .attr('x2', width - margin.left - margin.right)
          .attr('stroke-width', 0))
        .call(g => g.append('text')
          .attr('x', -margin.left)
          .attr('y', 0)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .text(yLabel || ''))

      yAxisGroup.select('.domain').remove();
      yAxisGroup.selectAll('line').attr('stroke', 'rgba(0, 0, 0, 0.2)');
      yAxisGroup
        .selectAll('text')
        .attr('opacity', 0.5)
        .attr('color', 'black')
        .attr('font-size', '0.75rem');


      svg.selectAll("myRect")
        .data(data.items)
        .join("rect")
        .attr("x", xScale(0))
        .attr("y", d => yScale(d.label as string))
        .attr("width", d => xScale(d.value))
        .attr("height", yScale.bandwidth())
        .attr("fill", data.color)


      svg.append('g')
        .selectAll('text')
        .data(data.items)
        .enter()
        .append('text')
        .attr('opacity', 0.5)
        .attr('color', 'black')
        .attr('font-size', '0.75rem')
        .attr('fill', 'currentColor')
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 'start')
        .attr("x", d => xScale(d.value) + 55)
        .attr("y", d => yScale(d.label as string) + yScale.bandwidth() / 2)
        .text(d => d.value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }))
        .classed('label', true)
    }
  }, [data]);

  return (
    <div className='App'>
      <svg ref={svgRef} width={svgWidth} height={svgHeight} />
    </div>
  )
}
