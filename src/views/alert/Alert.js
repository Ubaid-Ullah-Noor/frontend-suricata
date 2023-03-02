import React, { useState, useEffect } from 'react'

import { CCard, CCardBody, CCol, CRow, CButton } from '@coreui/react'

import MapContainer from 'src/components/MapContainer'
import { CChartLine, CChartBar } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'

import 'rsuite/dist/rsuite.min.css'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'

import apiService from 'src/services/apiService'
import responseHandler from 'src/services/responseHandler'
import { getAuth } from 'src/services/authProvider'
import { DateRangePicker } from 'rsuite'

import DataTable from 'react-data-table-component'
import ReactJson from "react-json-view";
import _ from 'underscore';

const Alert = () => {

  const [alerts,setAlerts]=useState([]);
  const [countryData,setCountryData]=useState([]);
  const [tableData,setTableData]=useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [ruleData,setRuleData]=useState([]);



  const columns = [
    {
      name: 'TimeStamp',
      selector: row => row.timestamp,
      sortable: true,
    },
    {
      name: 'Event Type',
      selector: row => row.event_type,
      sortable: true,
    },
    {
      name: 'Source Address',
      selector: row => JSON.parse(row.logs).src_ip?JSON.parse(row.logs).src_ip +" : "+JSON.parse(row.logs).src_port:"",
      sortable: true,
    },
    {
      name: 'Destination Address',
      selector: row => JSON.parse(row.logs).dest_ip?JSON.parse(row.logs).dest_ip+" : "+JSON.parse(row.logs).dest_port:"",
      sortable: true,
    },
    {
      name: 'Protocol',
      selector: row => JSON.parse(row.logs).proto,
      sortable: true,
    },

  ];

  const handlePageChange = page => {
     fetchLogs(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchLogs(page,newPerPage);
  };


  const setTimeRange = async (range) => {
    let start_date = new Date(range[0]).toISOString()
    let end_date = new Date(range[1]).toISOString()

    await fetchLogs(0,perPage,start_date, end_date);
    await fetchByRules(start_date, end_date);
    await fetchAlerts(start_date,end_date);
  }

  const fetchByRules=async (start_date="",end_date="")=>{
    const user=getAuth();

    let authHeader={Authorization:`Bearer ${user.token}`}

    const response=await apiService.getHandler(`api/alerts_by_rule?start_date=${start_date}&end_date=${end_date}`,authHeader);
    const response_data=await responseHandler(response);
    console.log('-------------------alert response--------------', response)
    if(response_data){
      setRuleData(response_data);

    }
  }

  const groupByCountry=(data)=>{
    let result=_.groupBy(data, function(item){ return  item.country});
    let counts=[];
    for(let item in result){
      counts.push({
        country:item,
        count:result[item].length
      })
    }
    return counts;
  }

  const fetchAlerts=async (start_date="",end_date="")=>{
    const user=getAuth();

    let authHeader={Authorization:`Bearer ${user.token}`}

    const response=await apiService.getHandler(`api/alerts?start_date=${start_date}&end_date=${end_date}`,authHeader);
    const response_data=await responseHandler(response);
    if(response_data){
      setAlerts(response_data);
      setCountryData(groupByCountry(response_data));

    }
  }


  const fetchLogs = async (page=0,limit=perPage,start_date="",end_date="") => {
    setLoading(true);

      const user=getAuth();

      let authHeader={Authorization:`Bearer ${user.token}`}

      const response=await apiService.getHandler(`api/all_alerts?offset=${page}&limit=${limit}&start_date=${start_date}&end_date=${end_date}`,authHeader);
      const response_data=await responseHandler(response);
      if(response_data){
        let rows=response_data.rows.map(item=>{
          return {
            timestamp:item.timestamp,
            logs: item.logs,
            event_type:item.event_type
          }
        })
        setTableData(rows);
        setTotalRows(response_data.count);
      }
      setLoading(false);

  };

  useEffect(()=>{
    fetchLogs();
    fetchByRules();
    fetchAlerts();
  },[])


  const ExpandedComponent = ({ data }) =><ReactJson src={JSON.parse(data.logs)} />;

  return (
    <>
      <CRow className='mb-2'>
            <CCol sm={7}></CCol>
            <CCol sm={5} className="d-none d-md-block" style={{ textAlign: 'right' }}>
              <DateRangePicker
                format="yyyy-MM-dd HH:mm:ss"
                defaultCalendarValue={[new Date(), new Date()]}
                onChange={setTimeRange}
              />

            </CCol>
          </CRow>

      <CCard className="mb-4">
        <CCardBody>

          <MapContainer locations={alerts}/>
        </CCardBody>
      </CCard>
      
      <CCard
        className="mb-4"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
      >
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <h4 id="traffic" className="card-title mb-0">
                Alert Count
              </h4>
            </CCol>
          </CRow>
          <CChartBar
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels:['paskitan','india', 'china', 'Turkey', 'ireland', 'Srilanka'],
              datasets: [
                {
                  label: 'Alerts',
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
                  data: [65, 59, 80, 81,37,76],
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
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={7}>
                  <h4 id="alert_by_rule" className="card-title mb-0">
                    Alerts By Country
                  </h4>
                </CCol>
                <CCol sm={12}>

                  <DataTable
                    columns={[
                      { name: 'Rule',
                        selector: row => row.country,
                        sortable: true,
                      },
                      { name: 'Count',
                        selector: row => row.count,
                        sortable: true,
                      }
                    ]}
                    data={countryData}
                    progressPending={loading}
                    defaultSortFieldId={1}
                    pagination
                    paginationServer

                  />

                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

        </CCol>
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={7}>
                  <h4 id="alert_by_rule" className="card-title mb-0">
                    Alerts By Rules
                  </h4>
                </CCol>
                <CCol sm={12}>

                  <DataTable
                    columns={[
                      { name: 'Rule',
                        selector: row => row.rule,
                        sortable: true,
                      },
                      { name: 'Count',
                        selector: row => row.count,
                        sortable: true,
                      }
                    ]}
                    data={ruleData}
                    progressPending={loading}
                    defaultSortFieldId={1}
                    pagination
                    paginationServer

                  />

                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

        </CCol>

      </CRow>

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={7}>
              <h4 id="traffic" className="card-title mb-0">
                All Alerts
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
              expandableRows expandableRowsComponent={ExpandedComponent}
          />

              </CCol>
          </CRow>
        </CCardBody>
      </CCard>


    </>
  )
}

export default Alert
