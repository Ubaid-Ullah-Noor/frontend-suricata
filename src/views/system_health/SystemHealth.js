import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import ReactApexChart from 'react-apexcharts'
import dayjs from 'dayjs'
import apiService from 'src/services/apiService'
import responseHandler from 'src/services/responseHandler'
import { getAuth } from 'src/services/authProvider'
import ApexChart from '../charts/ApexChart'

const SystemHealth = () => {
  const [systemHealthData, setSystemHealthData] = useState([])
  const [bandwidthData, setBandwidthData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const user = getAuth()

      let authHeader = { Authooptionrization: `Bearer ${user.token}` }

      const response = await apiService.getHandler('api/system_health', authHeader)
      const data = await responseHandler(response)
      if (data) {
        setSystemHealthData(data.system_healths)
        setBandwidthData(data.bandwidths)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {/* Top Stats */}

      <CRow className="py-4 mb-5" >
        <CCol xl={3}  md={6} xm={12} className='mb-5'>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol sm={12}>
                  <p id="CPU-usage" className="card-title mb-0 text-center fw-bold">
                    CPU Usage
                  </p>
                  <CCol className='w-100' id="chart">                 
                    <ApexChart/>
                  </CCol>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xl={3}  md={6} xm={12} className='mb-5'>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol sm={12}>
                  <p id="ram-usage" className="card-title mb-0 text-center fw-bold">
                    RAM Usage
                  </p>
                  <CCol className='w-100' id="chart">
                  <ApexChart/>
                  </CCol>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xl={3}  md={6} xm={12} className='mb-5'>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol sm={12}>
                  <p id="disk-speed" className="card-title mb-0 text-center fw-bold">
                    Network Speed
                  </p>
                  <CCol className='w-100' id="chart">
                  <ApexChart/>
                  </CCol>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xl={3}  md={6} xm={12} className='mb-5'>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol sm={12}>
                  <p id="disk-usage" className="card-title mb-0 text-center fw-bold">
                    Disk Usage
                  </p>
                  <CCol className='w-100' id="chart">
                  <ApexChart/>
                  </CCol>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Main Graphs */}
      <CRow>
        <CCol sm={6}>
          <CCard
            className="mb-4"
            style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
          >
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    CPU Usage
                  </h4>
                </CCol>

                <CCol sm={12}>
                  <CChartLine
                    style={{ height: '400px', marginTop: '40px' }}
                    data={{
                      labels: systemHealthData.map((item) =>
                        dayjs(item.createdAt).format('hh:mm:ss'),
                      ),
                      datasets: [
                        {
                          label: 'CPU Used (%)',
                          backgroundColor: hexToRgba(getStyle('--cui-success'), 10),
                          borderColor: getStyle('--cui-success'),
                          pointHoverBackgroundColor: getStyle('--cui-success'),
                          borderWidth: 2,
                          data: systemHealthData.map((item) => item.cpu_used),
                          fill: true,
                        },

                        // {
                        //     label: 'CPU Free (%)',
                        //     backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                        //     borderColor: getStyle('--cui-info'),
                        //     pointHoverBackgroundColor: getStyle('--cui-info'),
                        //     borderWidth: 2,
                        //     data:systemHealthData.map(item=>item.cpu_free),
                        //     fill: true,
                        // },
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
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6}>
          <CCard
            className="mb-4"
            style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
          >
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    RAM Usage
                  </h4>
                </CCol>

                <CCol sm={12}>
                  <CChartLine
                    style={{ height: '400px', marginTop: '40px' }}
                    data={{
                      labels: systemHealthData.map((item) =>
                        dayjs(item.createdAt).format('hh:mm:ss'),
                      ),
                      datasets: [
                        {
                          label: 'RAM Used (MB)',
                          backgroundColor: hexToRgba(getStyle('--cui-success'), 10),
                          borderColor: getStyle('--cui-success'),
                          pointHoverBackgroundColor: getStyle('--cui-success'),
                          borderWidth: 2,
                          data: systemHealthData.map((item) => item.ram_used),
                          fill: true,
                        },

                        // {
                        //     label: 'RAM Free (MB)',
                        //     backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                        //     borderColor: getStyle('--cui-info'),
                        //     pointHoverBackgroundColor: getStyle('--cui-info'),
                        //     borderWidth: 2,
                        //     data:systemHealthData.map(item=>item.ram_free),
                        //     fill: true,
                        // },
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
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6}>
          <CCard
            className="mb-4"
            style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
          >
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    Network Speed
                  </h4>
                </CCol>

                <CCol sm={12}>
                  <CChartLine
                    style={{ height: '400px', marginTop: '40px' }}
                    data={{
                      labels: bandwidthData.map((item) => dayjs(item.createdAt).format('hh:mm:ss')),
                      datasets: [
                        {
                          label: 'Download (Mbps)',
                          backgroundColor: hexToRgba(getStyle('--cui-success'), 10),
                          borderColor: getStyle('--cui-success'),
                          pointHoverBackgroundColor: getStyle('--cui-success'),
                          borderWidth: 2,
                          data: bandwidthData.map((item) => item.download),
                          fill: true,
                        },

                        // {
                        //     label: 'Upload (Mbps)',
                        //     backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                        //     borderColor: getStyle('--cui-info'),
                        //     pointHoverBackgroundColor: getStyle('--cui-info'),
                        //     borderWidth: 2,
                        //     data:bandwidthData.map(item=>item.upload),
                        //     fill: true,
                        // },
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
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6}>
          <CCard
            className="mb-4"
            style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
          >
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    Disk Usage
                  </h4>
                </CCol>

                <CCol sm={12}>
                  <CChartLine
                    style={{ height: '400px', marginTop: '40px' }}
                    data={{
                      labels: systemHealthData.map((item) =>
                        dayjs(item.createdAt).format('hh:mm:ss'),
                      ),
                      datasets: [
                        {
                          label: 'Disk Used (GB)',
                          backgroundColor: hexToRgba(getStyle('--cui-success'), 10),
                          borderColor: getStyle('--cui-success'),
                          pointHoverBackgroundColor: getStyle('--cui-success'),
                          borderWidth: 2,
                          data: systemHealthData.map((item) => item.disk_used),
                          fill: true,
                        },

                        // {
                        //     label: 'Disk Free (GB)',
                        //     backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                        //     borderColor: getStyle('--cui-info'),
                        //     pointHoverBackgroundColor: getStyle('--cui-info'),
                        //     borderWidth: 2,
                        //     data:systemHealthData.map(item=>item.disk_free),
                        //     fill: true,
                        // },
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
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default SystemHealth
