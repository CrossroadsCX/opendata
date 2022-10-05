import * as Plot from '@observablehq/plot'


const aapl  = [
  {
    Date: new Date('2013-05-13'),
    Open: 64.501427,
    High: 65.414284,
    Low: 64.5,
    Close: 64.96286,
    AdjClose: 50.961628,
    Volume: 79237200,
  },
  {
    Date: new Date('2013-04-14'),
    Open: 80.501427,
    High: 65.414284,
    Low: 64.5,
    Close: 84.96286,
    AdjClose: 50.961628,
    Volume: 79237200,
  },

]

export const appl: React.FC = () => 
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.line(aapl, {x: "Date", y: "Close"})
  ]
})