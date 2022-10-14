
import React from 'react'
import { groupBy } from 'lodash'
import { Story, Meta } from '@storybook/react'
import { HorizontalBarsChart, HorizontalBarsChartProps } from './HorizontalBars'
// @ts-ignore-line
import sampleData from '../../data/campaign_finance_sample.csv'

const dimensions = {
  width: 600,
  height: 300,
  margin: {
    top: 10,
    right: 30,
    bottom: 30,
    left: 220
  }
};

const groupedByCommittee = groupBy(sampleData, 'COMMITTEE_NAME')

const keys = Object.keys(groupedByCommittee)

const tenKeys = keys.slice(0, 10)

const financeReporting = tenKeys.map((key) => {
  return {
    value: groupedByCommittee[key].reduce((acc, num) => acc + parseInt(num.AMOUNT), 0),
    label: key
  }
}
)

const financeReportingData = {
  name: "Expeditures",
  color: "steelblue",
  items: financeReporting
};

export default {
  title: 'Charts/BarChart',
  component: HorizontalBarsChart,
} as Meta

const Template: Story<HorizontalBarsChartProps> = (args) => <HorizontalBarsChart {...args} />

export const HorizontalBars = Template.bind({})
HorizontalBars.args = { data: financeReportingData, dimensions, xLabel: 'Aumont', yLabel: 'Organization' }
