import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'

import dayjs from "dayjs"
import apiService from 'src/services/apiService';
import responseHandler from 'src/services/responseHandler';
import { getAuth } from 'src/services/authProvider'


const SystemDetail = () => {
    const [systemDetailData, setSystemDetailData] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const user = getAuth();

            let authHeader = { Authorization: `Bearer ${user.token}` }

            const response = await apiService.getHandler("api/os_details", authHeader);
            const data = await responseHandler(response);
            console.log(response)
            if (data) {
                setSystemDetailData(data);
            }

        }
        fetchData();

    }, []);



    return (
        <>
            <CRow className='justify-content-center'>
                <CCol sm={12} className="mb-4">
                    <CCard style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}>
                        <CCardBody>
                            <h4 className='text-center'>System's Details</h4>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol sm={4}>
                    <CCard className="mb-4" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}>
                        <CCardBody>
                            <h6 id="traffic" className="card-title mb-0">
                                CPU Information
                            </h6>
                            <p className='text-primary mt-2'>Free Space: {systemDetailData?.cpu?.cpu_free} %</p>
                            <p className='text-primary mt-2'>Used Space: {systemDetailData?.cpu?.cpu_usage} %</p>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol sm={4}>
                    <CCard className="mb-4" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}>
                        <CCardBody>
                            <h6 id="traffic" className="card-title mb-0">
                                RAM Information
                            </h6>
                            <p className='text-primary mt-2'>Free Memory: {systemDetailData?.mem_info?.freeMemMb}</p>
                            <p className='text-primary mt-2'>Used Memory: {systemDetailData?.mem_info?.usedMemMb}</p>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol sm={4}>
                    <CCard className="mb-4" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}>
                        <CCardBody>
                            <h6 id="traffic" className="card-title mb-0">
                                Disk Information
                            </h6>
                            <p className='text-primary mt-2'>Free: {systemDetailData?.drive_info?.freeGb} GB</p>
                            <p className='text-primary mt-2'>Used: {systemDetailData?.drive_info?.usedGb} GB</p>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>


        </>
    )
}

export default SystemDetail
