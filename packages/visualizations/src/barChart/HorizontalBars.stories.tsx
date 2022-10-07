
import React from 'react'
import { Story, Meta } from '@storybook/react'
import { HorizontalBarsChart, HorizontalBarsChartProps} from './HorizontalBars'

const dimensions = {
  width: 600,
  height: 300,
  margin: {
    top: 10,
    right: 30,
    bottom: 30,
    left: 60
  }
};

const financeReporting = [
  {
    value: 4394401,
    label: 'AAA'
  },
  {
    value: 985912,
    label: 'BBB'
  },
  {
    value: 5361978,
    label: 'CCC'
  },
  {
    value: 2239235,
    label: 'DDD'
  },
  {
    value: 8259794,
    label: 'EEE'
  },
  {
    value: 219235,
    label: 'FFF'
  },
  {
    value: 1825974,
    label: 'GGG'
  },
  {
    value: 4394401,
    label: 'HHH'
  },
  {
    value: 985912,
    label: 'III'
  },
  {
    value: 5361978,
    label: 'JJJ'
  },
  {
    value: 2239235,
    label: 'KKK'
  }
]

const financeReportingData = {
  name: "Expeditures",
  color: "blue",
  items: financeReporting
};

export default {
  title: 'Charts/BarChart',
  component: HorizontalBarsChart,
} as Meta

const Template: Story<HorizontalBarsChartProps> = (args) => <HorizontalBarsChart {...args} />

export const SingleLine = Template.bind({})
SingleLine.args = { data: financeReportingData, dimensions, xLabel: 'Aumont', yLabel:'Organization' }
