import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Map from "./Map";
import dropdown from "../images/dropdown.png";
import "../css/Home.css"; // Assuming you have a CSS file for styling

export default function RentNow() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from the URL parameters
    const [map, setMap] = useState(false);
    const [rent, setRent] = useState([]);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    // const code=data.zip

    useEffect(() => {
        fetch("http://localhost:4000/allproducts")
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data.products)) {
                    setRent(data.products);
                    const product = data.products.find((product) => product._id === id);
                    setData(product);  // Set the specific product data
                } else {
                    throw new Error('Data is not an array');
                }
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                setError(error);
            });
    }, [id]);  // Add id as a dependency to re-run the effect if id changes

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;  // Show a loading message while fetching data
    }

    return (
        <div className="container">
            <div className="container d-flex mt-3 justify-content-between border" >
                <div className="d-flex border ms-5" >
                    <div className="image-container mb-3">
                        <img src={`http://localhost:4000/images/${data.image}`} className="card-img-top" alt={data.name}  />
                    </div>
                    <div className="d-flex border me-5" style={{ width: "500px" }}>
                        <div>
                            <h3>{data.name}</h3>
                            <hr />
                            <h5>Price: {data.new_price} Rs/day</h5>
                            <h6>Licence Number: <strong>MH 48 AD 123</strong></h6>
                            <h6>Year: 2024</h6>
                            <h6>Type: {data.category}</h6>
                            <h6>Pickup/Drop Address:{data.zip}</h6>
                            <div>{data.description}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <button 
                    className="d-flex justify-content-center py-1 me-2"
                    onClick={() => setMap(!map)}
                    style={{ backgroundColor: "red", borderRadius: "20px 0px 0px 20px", width: "100%", border: "none" }}
                >
                    <strong>
                        {!map ? (
                            <div>Show Map <img src={dropdown} width={"25px"} alt="dropdown" /></div>
                        ) : (
                            <div>Hide Map <img src={dropdown} width={"25px"} style={{ transform: "rotate(180deg)" }} alt="dropdown" /></div>
                        )}
                    </strong>
                </button>
                <button 
                    className="d-flex justify-content-center py-1 ms-2"
                    onClick={() => navigate(`/exit/${data._id}`)}
                    style={{ backgroundColor: "red", borderRadius: "0px 20px 20px 0px", width: "100%", border: "none" }}
                >
                    <strong>Rent Now</strong>
                </button>
            </div>
            {map && <Map zip={data.zip} />}
        </div>
    );
}
