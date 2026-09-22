import * as d3 from 'd3';
import './style.css';

const width = 1000;
const height = 600;
const padding = 70;

const svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then((response) => response.json())
  .then((json) => {
    const dataset = json.data;
    const parseDate = d3.timeParse('%Y-%m-%d');
    const dates = dataset.map((d) => parseDate(d[0]));
    const gdps = dataset.map((d) => d[1]);
    const barWidth = (width - 2 * padding) / dataset.length;

    const maxDate = new Date(d3.max(dates));
    maxDate.setMonth(maxDate.getMonth() + 3);

    const xScale = d3
      .scaleTime()
      .domain([d3.min(dates), maxDate])
      .range([padding, width - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(gdps)])
      .range([height - padding, padding]);

    const showTooltip = (event, d) => {
      tooltip
        .attr('data-date', d[0])
        .style('opacity', 0.9)
        .style('left', event.pageX + 16 + 'px')
        .style('top', event.pageY - 40 + 'px')
        .html(
          d[0].slice(0, 4) +
            ' Q' +
            (Math.floor(Number(d[0].slice(5, 7)) / 3) + 1) +
            '<br>$' +
            d[1] +
            ' Billion'
        );
    };

    svg
      .selectAll('.bar')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', (d) => d[0])
      .attr('data-gdp', (d) => d[1])
      .attr('x', (d) => xScale(parseDate(d[0])))
      .attr('y', (d) => yScale(d[1]))
      .attr('width', barWidth)
      .attr('height', (d) => height - padding - yScale(d[1]))
      .on('mouseover', showTooltip)
      .on('mousemove', showTooltip)
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height - padding})`)
      .call(d3.axisBottom(xScale));

    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding}, 0)`)
      .call(d3.axisLeft(yScale));
  });
