export type Dimensions = {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }
}

export type DataPoint = {
  date: Date,
  value: number;
}

export type LineData = {
  name: string;
  color: string;
  items: DataPoint[]
}

export type MultilineData = LineData[]
