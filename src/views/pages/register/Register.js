import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect
} from '@coreui/react'
import './register.css'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilEnvelopeOpen, cilPhone, cilPeople } from '@coreui/icons'


const Register = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CRow className="g-3">
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput placeholder="First Name" autoComplete="firstname" />
                    </CInputGroup>
                    </CCol>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput placeholder="Last Name" autoComplete="lastname" />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow className="g-3">
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    </CCol>
                    <CCol>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilPeople} />
                        </CInputGroupText>
                        <CFormSelect id="autoSizingSelect">

                          <option>Select Role</option>

                          <option value="admin">Admin</option>

                          <option value="user">User</option>

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
                        <CFormInput placeholder="Email" autoComplete="email" />
                    </CInputGroup>
                    </CCol>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilPhone} />
                        </CInputGroupText>
                        <CFormInput placeholder="Mobile Number" autoComplete="mobileno" />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
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
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <CButton id='login-btn' color="primary"  onClick={(e) => handleSubmit(e)} className="px-4">
                          Add User
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
