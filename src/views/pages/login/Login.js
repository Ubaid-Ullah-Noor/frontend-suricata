import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import './login.css'
import Logo from '../../../assets/images/logo.jpg'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useState,useEffect } from 'react'
import apiService from 'src/services/apiService';
import responseHandler from 'src/services/responseHandler'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'; 

import Cookies from "universal-cookie";
const cookies = new Cookies();


const Login = () => {
  const [username, setUsername] = useState(``)
  const [password, setPassword] = useState(``)
  const [login, setLogin] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    const user = cookies.get("USER");
    if(user){
      navigate('/dashboard')
    }
  }, []);


  const handleSubmit =async (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();
    
    if(!username || !password){
      toast.error("Please fill required fields")
    
    }
    else{
      const data={
        user_name:username,
        password:password
      }
      const response=await apiService.postHandler("api/login",data);
      const response_data=await responseHandler(response);
      
      if(response_data){
       
         // set the cookie
         cookies.set("USER", response_data, {
          path: "/",
        });

        navigate('/dashboard')

      }
    } 
  }

  return (
    <div className="bg-image bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-2">
              <img src={Logo} id ='logo' alt="Logo" />
                <CCardBody>
                  <CForm onSubmit={(e)=>handleSubmit(e)}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" required name="username"  onChange={(e) => setUsername(e.target.value)} value={username} autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12}>
                        <CButton id='login-btn' color="primary"  onClick={(e) => handleSubmit(e)} className="px-4">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>    
    </div>
  )
}

export default Login
