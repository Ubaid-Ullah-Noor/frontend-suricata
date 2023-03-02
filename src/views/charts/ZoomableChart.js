import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactApexChart from 'react-apexcharts'

export default class ZoomableChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      series: [
        {
          name: 'Logs Data',
          data: [31,99,78, 40, 28, 51, 42, 109, 100],
        },
      ],
      options: {
        chart: {
          height: 380,
          type: 'area',
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          type: 'datetime',
          categories: [
            '2018-09-19T00:00:00.000Z',
            '2018-09-19T01:30:00.000Z',
            '2018-09-19T02:30:00.000Z',
            '2018-09-19T03:30:00.000Z',
            '2018-09-19T04:30:00.000Z',
            '2018-09-19T05:30:00.000Z',
            '2018-09-19T06:30:00.000Z',
            '2018-09-19T07:30:00.000Z',
            '2018-09-19T08:30:00.000Z',
          ],
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm',
          },
        },
      },
    }
  }smooth

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="area"
        height={380}
        width={'100%'}
      />
    )
  }
}
