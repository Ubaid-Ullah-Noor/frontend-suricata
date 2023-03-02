import React, { useState, useEffect } from 'react'
import { CButton, CButtonGroup, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { CChartLine, CChartBar } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import apiService from 'src/services/apiService'
import responseHandler from 'src/services/responseHandler'
import { getAuth } from 'src/services/authProvider'
import ZoomableChart from '../charts/ZoomableChart'
import { CChartDoughnut } from '@coreui/react-chartjs'

import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  const [chartData, setChartData] = useState([])
  const [filter, setFilter] = useState(`Minute`)

  useEffect(() => {
    async function fetchData() {
      const user = getAuth()

      let authHeader = { Authorization: `Bearer ${user.token}` }

      const response = await apiService.getHandler('api/logs?filter=' + filter, authHeader)
      const response_data = await responseHandler(response)
      console.log('-------------------Response-------------', response)
      if (response_data) {
        setChartData(response_data)
      }
    }
    fetchData()
  }, [filter])

  return (
    <>
      <WidgetsDropdown />
      <CCard
        className="mb-4"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
      >
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="secondary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Minute', 'Hour', 'Day', 'Month'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    onClick={() => setFilter(value)}
                    active={value === filter}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
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

        <CCol sm={4}>
          <CCard
            className="mb-4"
            style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
          >
            <CCardBody>
              <CRow>
              <CCol className='border-bottom ' sm={12}>
              <h5 id="traffic" className="card-title mb-2 text-center">
                Event Types
              </h5>
            </CCol>
                <CCol sm={12}>
                  <CChartDoughnut
                    data={{
                      labels: ['Stats', 'DNS', 'Alert', 'TLS','Flow', 'DHCP', 'File Info', 'HTTP'],
                      datasets: [
                        {
                          backgroundColor: ['#FFF6BD', '#CEEDC7', '#86C8BC', '#ADA2FF', '#C0DEFF', '#FFE5F1', '#FFF8E1', '#FFD4B2'],
                          data: [40, 20, 80, 10,58,35,65,25]
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

        <CCol sm={4}>
          <CCard
            className="mb-4"
            style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
          >
            <CCardBody>
              <CRow>
              <CCol className='border-bottom ' sm={12}>
              <h5 id="traffic" className="card-title mb-2 text-center">
                Top Transport Protocols
              </h5>
            </CCol>
                <CCol sm={12}>
                  <CChartDoughnut
                    data={{
                      labels: ['TCP', 'UDP'],
                      datasets: [
                        {
                          backgroundColor: ['#C0DEFF', '#FFE5F1'],
                          data: [40, 20],
                        },
                      ],
                    }}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Doughnut Chart For Network Protocols */}

        <CCol sm={4}>
          <CCard
            className="mb-4"
            style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
          >
            <CCardBody>
              <CRow>
              <CCol className='border-bottom ' sm={12}>
              <h5 id="traffic" className="card-title mb-2 text-center">
                Top Network Protocols
              </h5>
            </CCol>
                <CCol sm={12}>
                  <CChartDoughnut
                    data={{
                      labels: ['DNS', 'TLS','HTTP', 'DHCP', 'NTP'],
                      datasets: [
                        {
                          backgroundColor: ['#FFF6BD', '#CEEDC7', '#86C8BC', '#ADA2FF', '#C0DEFF'],
                          data: [40, 20, 70, 65,87],
                        },
                      ],
                    }}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>



        <CCol sm={4}>
        <CCard
        className="mb-4"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
      >
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <h4 id="event-type" className="card-title text-center mb-0">
                Event Types
              </h4>
            </CCol>
          </CRow>
          <CChartBar
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels:['Flow','File Info', 'HTTP', 'Alert', 'Stats'],
              datasets: [
                {
                  indexAxis:'y',
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 0,
                  data: [65, 59, 80, 81,37],
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
        </CCol>



        <CCol sm={4}>
        <CCard
        className="mb-4"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
      >
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <h4 id="trans-protocols" className="card-title text-center mb-0">
                Transport Protocols
              </h4>
            </CCol>
          </CRow>
          <CChartBar
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels:['TCP','UDP'],
              datasets: [
                {
                  indexAxis:'y',
                  backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 0,
                  data: [37,76],
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
        </CCol>



        <CCol sm={4}>
        <CCard
        className="mb-4"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
      >
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <h4 id="network-protocols" className="card-title text-center mb-0">
                Network Protocols
              </h4>
            </CCol>
          </CRow>
          <CChartBar
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels:['DNS','TLS', 'HTTP', 'DHCP', 'NTP'],
              datasets: [
                {
                  label: 'Alerts',
                  indexAxis:'y',
                  backgroundColor: [
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 0,
                  data: [65, 59, 80, 81,37],
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
        </CCol>

      </CRow>

      {/* <CCard
        className="mb-4"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
      >
        <CCardBody>
          <ZoomableChart />
        </CCardBody>
      </CCard> */}
    </>
  )
}

export default Dashboard
