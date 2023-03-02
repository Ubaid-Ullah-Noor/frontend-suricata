import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalBody,
  CModalContent,
  CModalTitle,
  CModalHeader,
  CModalFooter,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CFormSwitch,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import apiService from 'src/services/apiService'
import responseHandler from 'src/services/responseHandler'
import { getAuth } from 'src/services/authProvider'
import CIcon from '@coreui/icons-react'
import {
  cilLockLocked,
  cilUser,
  cilEnvelopeOpen,
  cilPhone,
  cilPeople,
  cilPencil,
  cilTrash,
  cilUserPlus,
  cilUserUnfollow
} from '@coreui/icons'
import './management.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

import DataTable from 'react-data-table-component'

const Management = () => {
  const [visible, setVisible] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [editModal, setEditModal] = useState({})
  const navigate = useNavigate()

  const columns = [
    {
      name: 'UserName',
      selector: (row) => row.user_name,
      sortable: true,
    },
    {
      name: 'First Name',
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Phone',
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: 'Role',
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: 'Status',
      cell: (row) => (
        <div className="danger">
          <CFormSwitch
            onChange={() => handleStatus(row.id, row.status)}
            label={row.status}
            id="formSwitchCheckChecked"
            defaultChecked={row.status == 'ACTIVE' ? true : false}
          />
        </div>
      ),
    },
    {
      name: 'Action',
      cell: (row) => (
        <>
          <span
            onClick={() => handleEditClick(row.id)}
            className="btn btn-primary"
            style={{ marginRight: '5px', backgroundColor: 'rgb(7, 66, 145)' }}
          >
            {' '}
            <CIcon icon={cilPencil} />
          </span>
          <span
            onClick={() => handleDeleteClick(row.id)}
            className="btn text-white"
            style={{ backgroundColor: 'rgb(255, 97, 97)' }}
          >
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

  const handleStatus = async (id, status) => {
    if (status === 'ACTIVE') {
      status = 'INACTIVE'
    } else {
      status = 'ACTIVE'
    }

    let data = {
      user_id: id,
      status: status,
    }

    const user = getAuth()

    let authHeader = { Authorization: `Bearer ${user.token}` }

    const response = await apiService.postHandler('api/users/update_status', data, authHeader)
    const response_data = await responseHandler(response)

    if (response_data) {
      toast.success('User updated Successfully')
      fetchData(0)
    }
  }

  const addUser = async (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault()
    const data = new FormData(e.target)
    console.log(data.get('user_name'))
    if (data.get('password') !== data.get('password_confirmation')) {
      toast.error('Password should match with confirm password')
    } else {
      const user = getAuth()

      let authHeader = { Authorization: `Bearer ${user.token}` }

      const response = await apiService.postHandler('api/users', data, authHeader)
      const response_data = await responseHandler(response)

      if (response_data) {
        toast.success('User added Successfully')
        document.getElementById('add_user_form').reset()
        setVisible(false)

        fetchData(0)
      }
    }
  }

  const editUser = async (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault()
    const data = new FormData(e.target)

    if (data.get('password') && data.get('password') !== data.get('password_confirmation')) {
      toast.error('Password should match with confirm password')
    } else {
      const user = getAuth()

      let authHeader = { Authorization: `Bearer ${user.token}` }

      const response = await apiService.postHandler('api/users/update', data, authHeader)
      const response_data = await responseHandler(response)

      if (response_data) {
        toast.success('User updated Successfully')
        document.getElementById('edit_user_form').reset()
        setVisibleEdit(false)

        fetchData(0)
      }
    }
  }

  const fetchData = async (page, limit = perPage) => {
    setLoading(true)

    const user = getAuth()

    let authHeader = { Authorization: `Bearer ${user.token}` }

    const response = await apiService.getHandler(
      `api/users?offset=${page}&limit=${limit}`,
      authHeader,
    )
    const response_data = await responseHandler(response)
    if (response_data) {
      let rows = response_data.rows

      setTableData(rows)
      setTotalRows(response_data.count)
    }
    setLoading(false)
  }

  const handlePageChange = (page) => {
    fetchData(page)
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage)
    fetchData(page, newPerPage)
  }

  useEffect(() => {
    const user = getAuth()

    if (user.role === 'USER') {
      navigate('/dashboard')
    }

    fetchData(0)
  }, [reload])

  return (
    <>
      {/* Top Stats */}

      <CRow className="justify-content-center g-3 pb-5">
            <CCol sm={3}>
              <CCard style={{ backgroundImage: 'linear-gradient(to bottom right, #074291 11%, #00ccff 100%)',padding:'20px 10px', border: 'none' }}>
                <CCardBody>
                  <CRow className="justify-content-center align-items-center ">
                    <CCol sm={3}>
                      <CIcon icon={cilUser} className="w-75 h-75 text-light"></CIcon>
                    </CCol>
                    <CCol sm={9}>
                      <h5 className="text-light">Total Users</h5>
                      <p className="text-light">(4)</p>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol sm={3}>
              <CCard style={{ backgroundImage: 'linear-gradient(to bottom right, #2bbc95 14%, #ccffcc 100%)',padding:'20px 10px', border: 'none' }}>
                <CCardBody>
                  <CRow className="justify-content-center align-items-center ">
                    <CCol sm={3}>
                      <CIcon icon={cilUserPlus} className="w-75 h-75 text-light"></CIcon>
                    </CCol>
                    <CCol sm={9}>
                      <h5 className="text-light">Active Users</h5>
                      <p className="text-light">(3)</p>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol sm={3}>
              <CCard style={{ backgroundImage: 'linear-gradient(to bottom right, #ff6161 14%, #ffcccc 100%)',padding:'20px 10px', border: 'none' }}>
                <CCardBody>
                <CRow className="justify-content-center align-items-center ">
                    <CCol sm={3}>
                      <CIcon icon={cilUserUnfollow} className="w-75 h-75 text-light"></CIcon>
                    </CCol>
                    <CCol sm={9}>
                  <h5 className="text-light">InActive Users</h5>
                  <p className="text-light">(1)</p>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

      <CCard
        className="mb-4"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border: 'none' }}
      >
        <CCardBody>
          <CRow>
            <CCol sm={8}>
              <h4 id="traffic" className="card-title mb-0">
                Managment
              </h4>
            </CCol>
            <CCol sm={4}>
              <CButton
                style={{ float: 'right', backgroundColor: 'rgb(7, 66, 145)' }}
                onClick={() => setVisible(!visible)}
              >
                Add New User
              </CButton>
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
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add New User</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm id="add_user_form" onSubmit={(e) => addUser(e)}>
            <CRow className="g-3">
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="First Name"
                    name="first_name"
                    required
                    autoComplete="firstname"
                  />
                </CInputGroup>
              </CCol>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Last Name"
                    name="last_name"
                    required
                    autoComplete="lastname"
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="g-3">
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Username"
                    name="user_name"
                    required
                    autoComplete="username"
                  />
                </CInputGroup>
              </CCol>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilPeople} />
                  </CInputGroupText>
                  <CFormSelect id="autoSizingSelect" name="role" required>
                    <option>Select Role</option>

                    <option value="ADMIN">Admin</option>

                    <option value="USER">User</option>
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="g-3">
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilEnvelopeOpen} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                  />
                </CInputGroup>
              </CCol>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Mobile Number"
                    name="phone"
                    required
                    autoComplete="mobileno"
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="Password"
                autoComplete="new-password"
              />
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                name="password_confirmation"
                minLength={6}
                required
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </CInputGroup>
            <CButton id="add-user-btn" color="primary" type="submit" className="px-4">
              Add User
            </CButton>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>

      <CModal
        alignment="center"
        scrollable
        visible={visibleEdit}
        onClose={() => setVisibleEdit(false)}
      >
        <CModalHeader>
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm id="edit_user_form" onSubmit={(e) => editUser(e)}>
            <input type={'hidden'} name="user_id" value={editModal.id} required />
            <CRow className="g-3">
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="First Name"
                    defaultValue={editModal.first_name}
                    name="first_name"
                    required
                    autoComplete="firstname"
                  />
                </CInputGroup>
              </CCol>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Last Name"
                    defaultValue={editModal.last_name}
                    name="last_name"
                    required
                    autoComplete="lastname"
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="g-3">
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Username"
                    defaultValue={editModal.user_name}
                    name="user_name"
                    required
                    autoComplete="username"
                  />
                </CInputGroup>
              </CCol>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilPeople} />
                  </CInputGroupText>
                  <CFormSelect
                    id="autoSizingSelect2"
                    defaultValue={editModal.role}
                    name="role"
                    required
                  >
                    <option value="">Select Role</option>

                    <option value="ADMIN">Admin</option>

                    <option value="USER">User</option>
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="g-3">
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilEnvelopeOpen} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Email"
                    defaultValue={editModal.email}
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                  />
                </CInputGroup>
              </CCol>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Mobile Number"
                    defaultValue={editModal.phone}
                    name="phone"
                    required
                    autoComplete="mobileno"
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                name="password"
                minLength={6}
                placeholder="Password"
                autoComplete="new-password"
              />
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                name="password_confirmation"
                minLength={6}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </CInputGroup>
            <CButton id="add-user-btn" color="primary" type="submit" className="px-4">
              Update User
            </CButton>
            <CButton color="secondary" onClick={() => setVisibleEdit(false)}>
              Close
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default Management
