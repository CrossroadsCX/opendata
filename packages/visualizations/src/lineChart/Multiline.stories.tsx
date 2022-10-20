import React from 'react'
import { Story, Meta } from '@storybook/react'
import { MultilineChart, MultilineChartProps } from './Multiline'
import { groupBy } from 'lodash'
// @ts-ignore-line
import sampleData from '../../data/campaign_finance_sample.csv'

const dimensions = {
  width: 600,
  height: 300,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60
  }
}

const recordsWithYear = sampleData.map((ee: Record<string, unknown>) => (
  { ...ee, YEAR: (ee.DATE_OCCURED as string).split('/')[2] }
))

const groupedByYear = groupBy(recordsWithYear, 'YEAR')

const years = Object.keys(groupedByYear)

const financeReporting = years.map((year) => {
  return {
    date: year,
    value: groupedByYear[year].reduce((acc, num) => acc + parseInt(num.AMOUNT), 0)
  }
}
)

const financeReporting2 = [
  {
    date: "2019",
    value: 21394401
  },
  {
    date: "2020",
    value: 4498382
  },
  {
    date: "2021",
    value: 10361978
  },
  {
    date: "2022",
    value: 10939235
  },
]

const financeReportingData = {
  name: "Red",
  color: "red",
  items: financeReporting.map((d) => ({ ...d, date: new Date(d.date) }))
}

const financeReportingData2 = {
  name: "Blue",
  color: "blue",
  items: financeReporting2.map((d) => ({ ...d, date: new Date(d.date) }))
}

export default {
  title: 'Charts/LineChart',
  component: MultilineChart,
} as Meta

const Template: Story<MultilineChartProps> = (args) => <MultilineChart {...args} />

export const SingleLine = Template.bind({})
SingleLine.args = { data: [financeReportingData], dimensions, xLabel: 'Year', yLabel: 'Contribution' }

export const MultiLine = Template.bind({})
MultiLine.args = { data: [financeReportingData, financeReportingData2], dimensions, xLabel: 'Year', yLabel: 'Contribution' }

