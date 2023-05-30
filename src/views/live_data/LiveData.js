import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCol, CRow, CButton, CButtonGroup, CCardHeader } from '@coreui/react'

import { getStyle, hexToRgba } from '@coreui/utils'
import ReactJson from 'react-json-view'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import { CChartLine, CChartBar } from '@coreui/react-chartjs'
import { DateRangePicker } from 'rsuite'

import 'rsuite/dist/rsuite.min.css'

import dayjs from 'dayjs'
import apiService from 'src/services/apiService'
import responseHandler from 'src/services/responseHandler'
import { getAuth } from 'src/services/authProvider'

import DataTable from 'react-data-table-component'
import { CChartDoughnut } from '@coreui/react-chartjs'
const LiveData = () => {
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [chartData, setChartData] = useState([])
  // Event type states
  const [EventType, setEventType] = useState([])
  const [EventCount, setEventCount] = useState([])
  
  //TOP protocols States
  const [TopProto, setTopProto] = useState([])
  const [TopProtoCount, setTopProtoCount] = useState([])


  const setTimeRange = async (range) => {
    let start_date = new Date(range[0]).toISOString()
    let end_date = new Date(range[1]).toISOString()

    await fetchChartData(start_date, end_date)
    await fetchLogs(0, perPage, start_date, end_date)
  }

  const columns = [
    {
      name: 'TimeStamp',
      selector: (row) => row.timestamp,
      sortable: true,
    },
    {
      name: 'Event Type',
      selector: (row) => row.event_type,
      sortable: true,
    },
    {
      name: 'Source Address',
      selector: (row) =>
        JSON.parse(row.logs).src_ip
          ? JSON.parse(row.logs).src_ip + ' : ' + JSON.parse(row.logs).src_port
          : '',
      sortable: true,
    },
    {
      name: 'Destination Address',
      selector: (row) =>
        JSON.parse(row.logs).dest_ip
          ? JSON.parse(row.logs).dest_ip + ' : ' + JSON.parse(row.logs).dest_port
          : '',
      sortable: true,
    },
    {
      name: 'Protocol',
      selector: (row) => JSON.parse(row.logs).proto,
      sortable: true,
    },
  ]

  const fetchChartData = async (start_date, end_date) => {
    console.log(start_date, end_date)
    const user = getAuth()

    let authHeader = { Authorization: `Bearer ${user.token}` }

    const response = await apiService.postHandler(
      'api/live_data/chart_data',
      { start_date, end_date },
      authHeader,
    )
    const response_data = await responseHandler(response)
    if (response_data) {
      setChartData(response_data)
    }
  }

  const fetchLogs = async (page, limit = perPage, start_date = null, end_date = null) => {
    setLoading(true)

    const user = getAuth()

    let authHeader = { Authorization: `Bearer ${user.token}` }

    const response = await apiService.postHandler(
      `api/live_data`,
      { offset: page, limit: limit, start_date, end_date },
      authHeader,
    )

    const response_data = await responseHandler(response)
    if (response_data) {
      let rows = response_data.rows.map((item) => {
        return {
          timestamp: item.timestamp,
          logs: item.logs,
          event_type: item.event_type,
        }
      })
      setTableData(rows)
      setTotalRows(response_data.count)
    }
    console.log('------------Table Data------------', response_data)

    // For Event Type
    const row = response_data.rows

    const counts = {}
    const eventTypes = []

    for (const obj of row) {
      const eventType = obj.event_type

      if (eventType in counts) {
        counts[eventType]++
      } else {
        counts[eventType] = 1
        eventTypes.push(eventType)
      }
    }

    const eventTypeCounts = eventTypes.map((eventType) => counts[eventType])

    setEventType(eventTypes)
    setEventCount(eventTypeCounts)

    // For UDP TCP Count

    const protoCounts = {}
    row.forEach((item) => {
      const proto = JSON.parse(item.logs).proto
      protoCounts[proto] = (protoCounts[proto] || 0) + 1
    })

    const uniqueProtos = Object.keys(protoCounts)
    const protoCountsArray = Object.values(protoCounts)

    setTopProto(uniqueProtos)
    setTopProtoCount(protoCountsArray)

    setLoading(false)
  }

  const handlePageChange = (page) => {
    fetchLogs(page)
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage)
    fetchLogs(page, newPerPage)
  }

  useEffect(
    () => {
      fetchLogs(0)

      let start_date = new Date()
      start_date.setMonth(start_date.getMonth() - 1)
      let end_date = new Date()
      fetchChartData(start_date, end_date)
    },
    [reload],
    [EventCount],
    [EventType],
  )

  const ExpandedComponent = ({ data }) => <ReactJson src={JSON.parse(data.logs)} />

  return (
    <>
      {/* Bar chart */}

      <CCard
        className="mb-4"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
      >
        <CCardBody>
          <CRow>
            <CCol sm={7}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
            </CCol>
            <CCol sm={5} className="d-none d-md-block" style={{ textAlign: 'right' }}>
              <DateRangePicker
                format="yyyy-MM-dd HH:mm:ss"
                defaultCalendarValue={[new Date(), new Date()]}
                onChange={setTimeRange}
              />
              <CButton
                onClick={() => {
                  setReload(reload + 1)
                }}
                style={{ marginLeft: '5px' }}
              >
                Reload
              </CButton>
            </CCol>
          </CRow>
          <CChartBar
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: chartData.map((item) => item.timestamp),
              datasets: [
                {
                  label: 'Logs Data',
                  backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                  borderColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data: chartData.map((item) => item.count),
                  fill: true,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </CCardBody>
      </CCard>

      <CRow>
        {/* Doughnut Chart For Event Types */}

        <CCol sm={6}>
          <CCard
            className="mb-4"
            style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
          >
            <CCardBody>
              <CRow>
                <CCol className="border-bottom " sm={12}>
                  <h5 id="traffic" className="card-title mb-2 text-center">
                    Event Types
                  </h5>
                </CCol>
                <CCol sm={12}>
                  <CChartDoughnut
                    data={{
                      labels: EventType,
                      datasets: [
                        {
                          backgroundColor: [
                            '#FFF6BD',
                            '#CEEDC7',
                            '#86C8BC',
                            '#ADA2FF',
                            '#C0DEFF',
                            '#FFE5F1',
                            '#FFF8E1',
                            '#FFD4B2',
                          ],
                          data: EventCount,
                        },
                      ],
                    }}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Doughnut Chart For Transport Protocols */}

        <CCol sm={6}>
          <CCard
            className="mb-4"
            style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
          >
            <CCardBody>
              <CRow>
                <CCol className="border-bottom " sm={12}>
                  <h5 id="traffic" className="card-title mb-2 text-center">
                    Top Transport Protocols
                  </h5>
                </CCol>
                <CCol sm={12}>
                  <CChartDoughnut
                    data={{
                      labels: TopProto,
                      datasets: [
                        {
                          backgroundColor: ['#C0DEFF', '#FFE5F1'],
                          data: TopProtoCount,
                        },
                      ],
                    }}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Table  */}

      <CCard
        className="mb-4"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
      >
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Live Data
              </h4>
            </CCol>

            <CCol sm={12}>
              <DataTable
                columns={columns}
                data={tableData}
                progressPending={loading}
                defaultSortFieldId={1}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default LiveData
