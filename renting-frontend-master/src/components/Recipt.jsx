import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Recipt.css";

export default function Recipt() {
  const [receiptData, setReceiptData] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [products,setProducts] = useState([]);
  const [error,setError] = useState(null);
  const currentDate = new Date().toLocaleDateString();

  const handlePrintClick = () => {
    var printContents = document.getElementById("a").innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };
  useEffect(() => {
    fetch("http://localhost:4000/getorder")
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
            console.log('Fetched data:', data);
            setProducts(data);
        })
        .catch((error) => {
            console.error('Fetch error:', error);
            setError(error);
        });
}, []);


  return (
    <div className="container d-flex justify-content-center mt-3">
      <div className="receipt">
        <div id="a">
        <div className="header">
          <h2>RENTING RECIPT</h2>
          <p><strong>Date: {currentDate}</strong></p>
        </div>
        <hr className="px-0" />
        {products.map((item, index) => (
          
        <div className="body">
          <table className="table">
            <tbody>
              <tr>
                <th className="th">Vehicle Name</th>
                <td className="td">
                  <strong>{item.name}</strong>
                </td>
              </tr>
              <tr>
                <th className="th">Type</th>
                <td className="td">
                    {item.category}
                </td>
              </tr>
              <tr>
                <th className="th">Clients Name</th>
                <td className="td">Arlen Dmello</td>
              </tr>
              <tr>
                <th className="th">Drop Date</th>
                <td className="td">
                  <strong>{item.date}</strong>
                </td>
              </tr>
              <tr>
                <th className="th">Rent per Day</th>
                <td className="td">1000Rs</td>
              </tr>
              <tr>
                <th className="th">Total Days Of Renting</th>
                <td className="td">
                  <strong>{item.days}</strong>
                </td>
              </tr>
              <tr>
                <th className="th">Phone</th>
                <td className="td">{item.phone}</td>
              </tr>
              <tr>
                <th className="th">Email</th>
                <td className="td">{item.email}</td>
              </tr>
              <tr>
                <th className="th">Pickup/Drop Address</th>
                <td className="td">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo,
                  rerum quas fuga tempore laudantium perferendis?
                </td>
              </tr>
            </tbody>
          </table>
        </div>
         ))}
        <div className="footer">
          <h3>Total Amount:1000</h3>
        </div>
       
        </div>
          <div className='d-flex justify-content-between mt-5'>
         
          <button type="button" className="submitButton" onClick={handlePrintClick}>
            Print
          </button>
          </div>
      </div>
    </div>
  );
}
