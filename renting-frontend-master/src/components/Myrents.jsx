import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Home.css";

export default function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('id');

    useEffect(() => {
        const fetchProductsAndOrders = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    fetch('http://localhost:4000/allproducts', {
                        headers: {
                            'auth-token': 'Bearer ' + localStorage.getItem('token'),
                        },
                    }),
                    fetch('http://localhost:4000/getorder'),
                ]);

                if (!productsRes.ok || !ordersRes.ok) {
                    throw new Error('Network response was not ok');
                }

                const productsData = await productsRes.json();
                const ordersData = await ordersRes.json();

                if (!Array.isArray(productsData.products)) {
                    throw new Error('Products data is not an array');
                }

                setProducts(ordersData.filter(order => order.user === userId));
                setLoading(false);
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchProductsAndOrders();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='container mt-3'>
            <h3 className='text-center'>Your Rented Products</h3>
            <div className='row'>
                {products.map((item, index) => (
                    <div className="col-md-4 mb-3" key={index}>
                        <div 
                            className="card w-100 card1" 
                            onClick={() => navigate('/recipt/' + item._id)} 
                            style={{ cursor: "pointer", borderRadius: "15px", border: "3px solid black" }}
                        >
                            {/* Uncomment the image section if you have images */}
                            {/* <div className='image-container'>
                                <img
                                    src={`http://localhost:4000/images/${item.image}`} // Make sure to include the base URL
                                    className='card-img-top'
                                    alt={item.name}
                                    style={{ borderRadius: '15px 15px 0px 0px' }}
                                />
                            </div> */}
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
