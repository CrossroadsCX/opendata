import React, { useRef } from 'react'
import * as d3 from 'd3'

type TableProps = {
  data: unknown[];
  dimensions: {
    width: number;
    height: number;
    margin: number;
  }
}

const Table = ({ data, dimensions }) => {
  const tableRef = useRef(null)

  return (
    <>
      Table
    </>
  )
}