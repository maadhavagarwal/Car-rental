import React from 'react'
import { Link } from 'react-router-dom'
import main1 from "../images/Remove-bg.ai_1721930680163.png"
import "../css/main.css"
const main = () => {
  return (
    <div>
    <div className='left'>
        <h1 className='main'>
            Best Rental System
            
            Start Renting now<button> <Link to="/carrent">Rent Now</Link></button>
            </h1>
    </div>
    <div className='right'>
        <img src={main1} alt="" className='main1' />
        
    </div>
      
    </div>
  )
}

export default main
