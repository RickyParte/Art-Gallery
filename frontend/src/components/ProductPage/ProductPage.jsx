import React, { useEffect, useState, useContext } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import './ProductPage.css';
import { StoreContext } from '../../Context/StoreContext';
import { Link } from 'react-router-dom';

const ProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
    const [artwork, setArtwork] = useState(null);
    console.log(id);



    useEffect(() => {
        // Simulate fetching data (replace with actual API call)
        const fetchArtwork = async () => {
            const response = await fetch(`http://localhost:4000/api/product/artworks/${id}`);
            const data = await response.json();
            console.log(data);
            setArtwork(data);
        };
        fetchArtwork();
    }, [id, url]);

    if (!artwork) {
        return <div className="loading">Loading...</div>;
    }

    

    return (

        <div className="product-page">
            <div className="product-image">
                <img src={url + "/images/" + artwork[0].image} alt={artwork[0].name} />
            </div>
            <div className="product-details">
                <h1>{artwork.name}</h1>
                <p className="product-features">{artwork[0].features}</p>
                <p className="product-price">Price: ₹{artwork[0].price}</p>
                {!cartItems[id] ? (
                    <div>
                    <button className="add-to-cart-btn" onClick={() => addToCart(id)}>Add to Cart</button>
                    <Link to={`/view/${artwork[0].certificateHash}`} className='Art-item-link'>
                        <button className='add-to-cart-btn-1' >View Certificate</button>
                    </Link>
                    </div>
                ) : (
                    <div className="product-counter">
                        <button onClick={() => removeFromCart(id)}>-</button>
                        <p>{cartItems[id]}</p>
                        <button onClick={() => addToCart(id)}>+</button>
                        <Link to={`/view/${artwork[0].certificateHash}`} className='Art-item-link'>
                            <button className='add-to-cart-btn-1' >View Certificate</button>
                        </Link>
                    </div>
                    
                )}
            </div>
        </div>
    );
};

export default ProductPage;
