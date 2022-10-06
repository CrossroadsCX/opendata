
import React from 'react'
import { Story, Meta } from '@storybook/react'
import { MultilineChart, MultilineChartProps } from '../src/lineChart/Multiline'

const dimensions = {
  width: 600,
  height: 300,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60
  }
};

const financeReporting = [
  {
    date: "2016",
    value: 4394401
  },
  {
    date: "2017",
    value: 985912
  },
  {
    date: "2018",
    value: 5361978
  },
  {
    date: "2019",
    value: 2239235
  },
  {
    date: "2020",
    value: 18259794
  }
]

const financeReporting2 = [
  {
    date: "2016",
    value: 1394401
  },
  {
    date: "2017",
    value: 3685912
  },
  {
    date: "2018",
    value: 7361978
  },
  {
    date: "2019",
    value: 10239235
  },
  {
    date: "2020",
    value: 3859794
  }
]

const financeReportingData = {
  name: "Portfolio",
  color: "red",
  items: financeReporting.map((d) => ({ ...d, date: new Date(d.date) }))
};

const financeReportingData2 = {
  name: "Portfolio",
  color: "blue",
  items: financeReporting2.map((d) => ({ ...d, date: new Date(d.date) }))
};

export default {
  title: 'Charts/Multiline',
  component: MultilineChart,
} as Meta

const Template: Story<MultilineChartProps> = (args) => <MultilineChart {...args} />

export const SingleLine = Template.bind({})
SingleLine.args = { data: [financeReportingData], dimensions, xLabel: 'Year', yLabel:'Finance' }

export const MultiLine = Template.bind({})
MultiLine.args = { data: [financeReportingData, financeReportingData2], dimensions, xLabel: 'Year', yLabel:'Finance' }

