import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Home.css";

export default function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:4000/getorder")
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                console.log(data.user);
                setUser(data.user);
                setProducts(data.products);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Filter products to display only those associated with the logged-in user
    const userProducts = products.filter(product => product.user === user._id);

    return (
        <div className='container mt-3'>
            <h1 className='text-center'>Welcome to Renting</h1>
            {user && (
                <div className='user-info mb-3'>
                    <h2>Hello, {user.name}</h2>
                    <p>Email: {user.email}</p>
                </div>
            )}
            <div className='row'>
                {userProducts.map((item, index) => (
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
