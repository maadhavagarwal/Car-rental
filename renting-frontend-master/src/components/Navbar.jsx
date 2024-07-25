import React, { useState } from "react";
import "../css/Navbar.css";
import { Link, Navigate } from "react-router-dom";

export default function Navbar() {
    
    const [showPopup, setShowPopup] = useState(false);
    const [user,setUser]=useState("")
    const [password,setPassword]=useState("")
    
    const togglePopup=()=>{
        setShowPopup(!showPopup)
    }
    const logout=()=>{localStorage.clear();window.location.href='/login'}
    const login=()=>{
      const data={email:user,password:password}
      fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if(data.status===200){
          localStorage.setItem('token',data.token)
          window.location.href='/'
        }
        else{
          alert(data.message)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    }

  return (
    <div>
<nav className="navbar navbar-expand-lg px-3 bg-dark" style={{content:''}}>
      <a className="navbar-brand" href="/">Car rental</a>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
           <Link to={'/'} className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
          <Link to={'/myrents'} className="nav-link">My Rents</Link>
          </li>
          <li className="nav-item">
          <Link to={'/addvehical'} className="nav-link">Add Vehical</Link>
          </li>
        </ul>
      </div>
      
      {localStorage.getItem('auth-token') ? <button className="btn btn-outline-success my-2 my-sm-0 ml-auto" type="button" onClick={logout}>Logout</button>
      
      :
      <button className="btn btn-outline-success my-2 my-sm-0 ml-auto" type="button" onClick={togglePopup}>Login</button>
}
</nav>
    {showPopup &&<div className="popup">
      <div className="popup-content">
        <span className="close" onClick={togglePopup}>&times;</span>
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label className="d-flex justify-content-start">Username:</label>
            <input type="text"  className="d-flex justify-content-start" placeholder="Username" id="username" onChange={(e)=> setUser(e.target.value)} required />
          </div>
          <div className="form-group mb-0">
            <label className="d-flex justify-content-start">Password:</label>
            <input type="password" className="d-flex justify-content-start" placeholder="Password" id="password" onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <div className="d-flex justify-content-start">New to Rentz?<Link to={'/signup'} onClick={togglePopup}>Signup</Link></div>
          <button type="submit" className="btn-submit w-100 mt-3" onClick={login}>Login</button>
        </form>
      </div>
    </div>}

    </div>
  );
}
