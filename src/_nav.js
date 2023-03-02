import React,{useState,useEffect} from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilChartLine,
  cilSpeedometer,
  cilHeart,
  cilNewspaper,
  cilWarning,
  cilMonitor,
  cilBook,
  cilPeople,
  cilHistory,
  cilNotes
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'



const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
   
  },

  {
    component: CNavGroup,
    name: 'Monitoring',
    to: '/dashboard',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'System Health',
        to: '/system_health',
        icon: <CIcon icon={cilHeart} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Live Data',
        to: '/live_data',
        icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Summary',
        to: '/base/breadcrumbs',
        icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />
      },
    ],
  },

  {
    component: CNavItem,
    name: 'Alert',
    to: '/alerts',
    icon: <CIcon icon={cilWarning} customClassName="nav-icon" />,
   
  },

  {
    component: CNavItem,
    name: 'Reporting',
    to: '/cards',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  
  },
  {
    component: CNavItem,
    name: 'System',
    to: '/system_details',
    icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
   
  },
  {
    component: CNavGroup,
    name: 'Policies',
    to: '#',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'App Layer',
        to: '/policy/AppLayer',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Decoder Events',
        to: '/policy/DecoderEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Dhcp Events',
        to: '/policy/DhcpEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Dnp3 Events',
        to: '/policy/Dnp3Events',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'DNS Events',
        to: '/policy/DNSEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Files',
        to: '/policy/Files',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Http2 Events',
        to: '/policy/Http2Events',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Http Events',
        to: '/policy/HttpEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'IPSEC Events',
        to: '/policy/IpsecEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Kerberos Events',
        to: '/policy/KerberosEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Local',
        to: '/policy/Local',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'ModBus Events',
        to: '/policy/ModBusEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'MQTT Events',
        to: '/policy/MQTTEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'NFS Events',
        to: '/policy/NFSEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'NTP Events',
        to: '/policy/NTPEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'SMB Events',
        to: '/policy/SMBEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'SMTP Events',
        to: '/policy/SMTPEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'SSH Events',
        to: '/policy/SSHEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Stream Events',
        to: '/policy/StreamEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'TLS Events',
        to: '/policy/TLSEvents',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />
      },
     
    ],
  },
  {
    component: CNavItem,
    name: 'Management',
    to: '/management',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
   
  }
 

]


export default _nav
