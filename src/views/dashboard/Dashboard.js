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
