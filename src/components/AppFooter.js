import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="#" className='text-decoration-none' rel="noopener noreferrer">
          AUNIDS
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
