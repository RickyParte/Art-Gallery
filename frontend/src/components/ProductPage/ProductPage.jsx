import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';
import { StoreContext } from '../../Context/StoreContext';

const ProductPage = () => {
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
                <img src={url + "/images/" + artwork.image} alt={artwork.name} />
            </div>
            <div className="product-details">
                <h1>{artwork.name}</h1>
                <p className="product-features">{artwork.features}</p>
                <p className="product-price">Price: ₹{artwork.price}</p>
                {!cartItems[id] ? (
                    <button className="add-to-cart-btn" onClick={() => addToCart(id)}>Add to Cart</button>
                ) : (
                    <div className="product-counter">
                        <button onClick={() => removeFromCart(id)}>-</button>
                        <p>{cartItems[id]}</p>
                        <button onClick={() => addToCart(id)}>+</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
