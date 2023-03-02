import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCol,
  CButton,
  CModal,
  CModalBody,
  CModalContent,
  CModalTitle,
  CModalHeader,
  CModalFooter,
  CRow,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CFormSwitch,
} from '@coreui/react'

import 'rsuite/dist/rsuite.min.css'
import CIcon from '@coreui/icons-react'
import { cilNotes, cilPencil, cilTrash } from '@coreui/icons'

import apiService from 'src/services/apiService'
import responseHandler from 'src/services/responseHandler'
import { getAuth } from 'src/services/authProvider'

import DataTable from 'react-data-table-component'

const NFSEvents = () => {
  const { fileName } = useParams()
  console.log('params:', fileName)

  const [tableData, setTableData] = useState([])
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(0)
  const [totalRows, setTotalRows] = useState(0)

  const columns = [
    {
      name: 'Rule',
      cell: (row) => <>{row}</>,
      sortable: true,
    },

    {
      name: 'Action',
      width: '180px',
      cell: (row) => (
        <>
          <span
            onClick={() => handleEditClick(row)}
            className="btn btn-primary"
            style={{ marginRight: '5px' }}
          >
            {' '}
            <CIcon icon={cilPencil} />
          </span>
          <span onClick={() => handleDeleteClick(row)} className="btn btn-danger text-white">
            {' '}
            <CIcon icon={cilTrash} />
          </span>
        </>
      ),
    },
  ]

  const handleEditClick = async (id) => {
    console.log(id)
    const user = getAuth()
    let authHeader = { Authorization: `Bearer ${user.token}` }
    const response = await apiService.getHandler(`api/users/${id}`, authHeader)
    const response_data = await responseHandler(response)
    if (response_data) {
      setEditModal(response_data)
      setVisibleEdit(true)
    }
  }

  const handleDeleteClick = async (id) => {
    console.log(id)

    let text = 'Are you sure, you want to delete?'
    if (confirm(text) == true) {
      const user = getAuth()
      let authHeader = { Authorization: `Bearer ${user.token}` }
      const response = await apiService.getHandler(`api/users/delete/${id}`, authHeader)
      const response_data = await responseHandler(response)
      if (response_data) {
        toast.success('User deleted Successfully')
        fetchData(0)
      }
    }
  }

  const fetchRules = async () => {
    setLoading(true)

    const user = getAuth()

    let authHeader = { Authorization: `Bearer ${user.token}` }

    const response = await apiService.getHandler(`api/policies/${fileName}.rules`, authHeader)
    const response_data = await responseHandler(response)
    if (response_data) {
      setTableData(response_data)
      setTotalRows(response_data.length)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRules()
  }, [reload])

  return (
    <>

      {/* Policies Table */}

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={8}>
              <h4 id="traffic" className="card-title mb-0">
                {fileName} Rules
              </h4>
            </CCol>
            <CCol sm={4}>
              <CButton
                style={{ float: 'right' }}
                color="secondary"
                onClick={() => setVisible(!visible)}
              >
                Add New Policy
              </CButton>
            </CCol>

            <CCol sm={12}>
              <DataTable
                columns={columns}
                data={tableData}
                progressPending={loading}
                defaultSortFieldId={1}
                pagination
                paginationTotalRows={totalRows}
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Add Policy Modal */}
      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add New Policy</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm id="add_policy_form" onSubmit={(e) => addPolicy(e)}>
            <CRow className="g-3">
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilNotes} />
                  </CInputGroupText>
                  <CFormInput placeholder="Rule" name="Rule" required autoComplete="Rule" />
                </CInputGroup>
              </CCol>
            </CRow>
            <CButton id="add-policy-btn" color="primary" type="submit" className="px-4">
              Add policy
            </CButton>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default NFSEvents
