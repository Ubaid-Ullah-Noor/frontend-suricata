import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions, cilChartLine, cilUser } from '@coreui/icons'
import apiService from 'src/services/apiService'
import responseHandler from 'src/services/responseHandler'
import { getAuth } from 'src/services/authProvider'
import { getStyle, hexToRgba } from '@coreui/utils'
import dayjs from 'dayjs'
import Colors from '../theme/colors/Colors'
import { getIconsView } from '../icons/brands/Brands';

const WidgetsDropdown = () => {
  const [cpuFree, setCpuFree] = useState(``)
  const [cpuUsed, setCpuUsed] = useState(``)
  const [driveFree, setDriveFree] = useState(``)
  const [driveUsed, setDriveUsed] = useState(``)
  const [ramFree, setRamFree] = useState(``)
  const [ramUsed, setRamUsed] = useState(``)
  const [netIn, setNetIn] = useState(``)
  const [netOut, setNetOut] = useState(``)
  const [systemHealthData, setSystemHealthData] = useState([])
  const [bandwidthData, setBandwidthData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const user = getAuth()

      let authHeader = { Authorization: `Bearer ${user.token}` }

      const osResponse = await apiService.getHandler('api/os_details', authHeader)
      const osResponseData = await responseHandler(osResponse)
      if (osResponseData) {
        setCpuFree(osResponseData.cpu.cpu_free)
        setCpuUsed(osResponseData.cpu.cpu_usage)
        setDriveUsed(osResponseData.drive_info.usedGb)
        setDriveFree(osResponseData.drive_info.freeGb)
        setRamUsed(osResponseData.mem_info.usedMemMb)
        setRamFree(osResponseData.mem_info.freeMemMb)
        setNetIn(osResponseData.net_info.total.inputMb)
        setNetOut(osResponseData.net_info.total.outputMb)
      }
    }
    fetchData()
  }, [])

  const [chartData, setChartData] = useState([])
  const [filter, setFilter] = useState(`Minute`)

  useEffect(() => {
    async function fetchData() {
      const user = getAuth()

      let authHeader = { Authorization: `Bearer ${user.token}` }

      const response = await apiService.getHandler('api/logs?filter=' + filter, authHeader)
      const response_data = await responseHandler(response)
      if (response_data) {
        setChartData(response_data)
      }
    }
    fetchData()
  }, [filter])

  useEffect(() => {
    async function fetchData() {
      const user = getAuth()

      let authHeader = { Authorization: `Bearer ${user.token}` }

      const response = await apiService.getHandler('api/system_health', authHeader)

      console.log('-------------------Response health-------------', response)
      const data = await responseHandler(response)
      if (data) {
        setSystemHealthData(data.system_healths)
        setBandwidthData(data.bandwidths)
      }
    }
    fetchData()
  }, [])
  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4 p-2"
          style={{
            backgroundImage: 'linear-gradient(to left bottom,#3399ff 14%, #c0deff 100%)',
            border: 'none',
            color: 'white',
          }}
          value={
            <>
              <span className="fs-6 fw-normal">
                <b>{parseInt(cpuFree)}%</b> Free
              </span>{' '}
              <span className="fs-6 fw-normal">
                <b>{parseInt(cpuUsed)}%</b> Used
              </span>
            </>
          }
          title="CPU Usage"
          chart={
            <CChartLine
              style={{ height: '100%' }}
              data={{
                labels: systemHealthData.map((item) => dayjs(item.createdAt).format('hh:mm')),
                datasets: [
                  {
                    label: 'CPU Used (%)',
                    backgroundColor: 'transparent',
                    borderColor: '#003366',
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
                // scales: {
                //   x: {
                //     color:'#ffffff',
                //     type: 'time',
                //     time: {
                //       unit: 'date',
                //       parser: 'dd/mm/yyyy'
                //     }
                //   },
                //   y: {
                //     color:'#ffffff',
                //   }
                // }
              }}
            />
          }
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4 p-2"
          style={{
            backgroundImage: 'linear-gradient(to left bottom, #2bbc95 14%, #ccffcc 100%)',
            border: 'none',
            color: 'white',
          }}
          value={
            <>
              <span className="fs-6 fw-normal">
                <b>{parseInt(ramFree)}MB</b> Free
              </span>{' '}
              <span className="fs-6 fw-normal">
                <b>{parseInt(ramUsed)}MB</b> Used
              </span>
            </>
          }
          title="Memory Usage"
          chart={
            <CChartLine
              style={{ height: '100%' }}
              data={{
                labels: systemHealthData.map((item) => dayjs(item.createdAt).format('hh:mm')),
                datasets: [
                  {
                    label: 'RAM Used (MB)',
                    backgroundColor: 'transparent',
                    borderColor: '#009933',
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
          }
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4 p-2"
          style={{
            backgroundImage: 'linear-gradient(to left bottom , #f9b115 14%, #ffff99 100%)',
            border: 'none',
            color: 'white',
          }}
          value={
            <>
              <span className="fs-6 fw-normal">
                <b>{parseInt(driveFree)}GB</b> Free
              </span>{' '}
              <span className="fs-6 fw-normal">
                <b>{parseInt(driveUsed)}GB</b> Used
              </span>
            </>
          }
          title="Disk Usage"
          chart={
            <CChartLine
              style={{ height: '100%' }}
              data={{
                labels: systemHealthData.map((item) => dayjs(item.createdAt).format('hh:mm')),
                datasets: [
                  {
                    label: 'Disk Used (GB)',
                    backgroundColor: 'transparent',
                    borderColor: '#cc6600',
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
                valueAxis: {
                  color: 'white',
                },
              }}
            />
          }
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4 p-2"
          style={{
            backgroundImage: 'linear-gradient(to left bottom , #ff6161 14%, #ffcccc 100%)',
            border: 'none',
            color: 'white',
          }}
          value={
            <>
              <span className="fs-6 fw-normal">
                Traffic In <b>{netIn}Mb</b>
              </span>{' '}
              <span className="fs-6 fw-normal">
                Traffic Out <b>{netOut}Mb</b>
              </span>
            </>
          }
          title="Network Traffic"
          chart={
            <CChartBar
              style={{ height: '100%' }}
              data={{
                labels: chartData.map((item) => item.timestamp),

                datasets: [
                  {
                    label: 'Network Traffic',
                    borderColor: '#ffffff',
                    pointHoverBackgroundColor: getStyle('--cui-info'),
                    borderWidth: 1,
                    data: chartData.map((item) => item.count),
                    fill: true,
                    backgroundColor: '#ffffff',
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
          }
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
