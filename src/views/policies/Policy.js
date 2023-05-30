import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  CCard, 
  CCardBody, 
  CCol, 
  CRow,
  CButton,
  CModal,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
} from '@coreui/react'

import 'rsuite/dist/rsuite.min.css'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { 
  cilPencil, 
  cilLockLocked,
  cilUser,
  cilRuble,
  cilEnvelopeOpen,
  cilPhone,
  cilPeople,
  cilTrash,
} from '@coreui/icons'

import apiService from 'src/services/apiService'
import responseHandler from 'src/services/responseHandler'
import { getAuth } from 'src/services/authProvider'

import DataTable from 'react-data-table-component'

const Policy = () => {
  const { fileName } = useParams()

  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const [visible, setVisible] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editModal, setEditModal] = useState({})

  function reg1(str) {
    const regex = /msg:"(.*?)".*?flow:(.*?);.*?classtype:(.*?);/

    const match = str.match(regex)

    if (match) {
      const msg = match[1]
      return [msg]
    } else {
      return []
    }
  }

  function reg2(str) {
    const regex = /msg:"(.*?)".*?flow:(.*?);.*?classtype:(.*?);/

    const match = str.match(regex)

    if (match) {
      const flow = match[2]
      return [flow]
    } else {
      return []
    }
  }

  function reg3(str){
    const regex = /msg:"(.*?)".*?flow:(.*?);.*?classtype:(.*?);/;
  
  const match = str.match(regex);
  
  if (match) {
    const classtype = match[3];
  
    return [classtype]
  } else {
    return []
  }
}
    

  const columns = [
    {
      name: 'Message',
      cell: (row) => (
        <ul style={{ listStyle: 'none', margin:'0px' , padding:'0px' }}>
          {reg1(row).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
      sortable: true,
    },
    {
      name: 'Flow',
      cell: (row) => (
        <ul style={{ listStyle: 'none', margin:'0px' , padding:'0px' }}>
          {reg2(row).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
      sortable: true,
    },
    {
      name: 'Class Type',
      cell: (row) => (
        <ul style={{ listStyle: 'none', margin:'0px' , padding:'0px' }}>
          {reg3(row).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
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

  const handleEditClick = async (row) => {
    console.log(row)
    const user = getAuth()
    let authHeader = { Authorization: `Bearer ${user.token}` }
    const response = await apiService.getHandler(`api/users/${id}`, authHeader)
    const response_data = await responseHandler(response)
    if (response_data) {
      setEditModal(response_data)
      setVisibleEdit(true)
    }
  }

  // const handleDeleteClick = async (id) => {
  //   console.log(id)

  //   let text = 'Are you sure, you want to delete?'
  //   if (confirm(text) == true) {
  //     const user = getAuth()
  //     let authHeader = { Authorization: `Bearer ${user.token}` }
  //     const response = await apiService.getHandler(`api/users/delete/${id}`, authHeader)
  //     const response_data = await responseHandler(response)
  //     if (response_data) {
  //       toast.success('User deleted Successfully')
  //       fetchData(0)
  //     }
  //   }
  // }



  // Add Policy
  
  const addPolicy = async (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault()
    console.log ('add policy')
    const form1 = new FormData(e.target)
    var rule = form1.get('policy');

      const user = getAuth()

      let authHeader = { Authorization: `Bearer ${user.token}` }
      let data = {
        'fileName':fileName+'.rules',
        'rule':rule
      }

      const response = await apiService.postHandler('api/add_policy',data, authHeader)
      const response_data = await responseHandler(response) 
      
      if (response.request.status===200) {
        console.log(response.request.status)

        toast.success('Policy added Successfully')
        document.getElementById('add_policy_form').reset()
        setVisible(false)

        fetchRules()
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
    addPolicy()
  }, [reload])



  return (
    <>
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
                style={{ float: 'right', backgroundColor: 'rgb(7, 66, 145)' }}
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

      {/* Add Policy */}
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
                    <CIcon icon={cilRuble} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Rule"
                    name="policy"
                    required
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <CButton id="add-policy-btn" color="primary" type="submit" className="px-4">
              Add Policy
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

export default Policy
