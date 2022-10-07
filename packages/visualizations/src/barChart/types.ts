export type Dimensions = {
  width: number
  height: number
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

export type DataPoint = {
  value: number
  label: string
}

export type BarData = {
  name: string
  color: string
  items: DataPoint[]
}
