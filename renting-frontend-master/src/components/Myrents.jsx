import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/Home.css";

export default function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

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

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='container mt-3'>
            <h1 className='text-center'>Welcome to Renting</h1>
            <div className='row'>
                {products.map((item, index) => (
                    
                    <div className="col-md-4 mb-3" key={index}>
                        <div 
                            className="card w-100 card1" 
                            onClick={() => navigate('/recipt/' + item._id)} 
                            style={{ cursor: "pointer", borderRadius: "15px", border: "3px solid black" }}
                        >
                            <div className="image-container">
                                <img 
                                    src={item.image} 
                                    className="card-img-top" 
                                    alt={item.name} 
                                    style={{ borderRadius: "15px 15px 0px 0px" }}
                                />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title mb-2"><strong>{item.name}</strong></h5>
                            
                            </div>
                        </div>
                    </div>
                    
                ))}
            </div>
        </div>
    );
}
