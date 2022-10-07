
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
    left: 150
  }
};

const financeReporting = [
  {
    value: 4394401,
    label: 'DEMOCRATIC ACTION'
  },
  {
    value: 985912,
    label: 'DAGA PAC'
  },
  {
    value: 5361978,
    label: 'NC REALTORS PAC'
  },
  {
    value: 2239235,
    label: 'EMILYS LIST'
  },
  {
    value: 8259794,
    label: 'FLIPPABLE'
  },
  {
    value: 219235,
    label: 'DUKE ENERGY CORP PAC'
  },
  {
    value: 1825974,
    label: 'NSCFAA PAC INC'
  },
  {
    value: 4394401,
    label: 'NC HOSPITAL ASSN PAC'
  },
  {
    value: 985912,
    label: 'SNITH ANDERSON PAC'
  },
  {
    value: 5361978,
    label: 'NC FARM BUREAU PAC'
  },
  {
    value: 2239235,
    label: 'NC DENTAL SOCIETY PAC'
  }
]

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

export const SingleLine = Template.bind({})
SingleLine.args = { data: financeReportingData, dimensions, xLabel: 'Aumont', yLabel:'Organization' }
