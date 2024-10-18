import React, { useContext } from 'react';
import './ArtItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const ArtItem = ({ id, name, price, features, image }) => {
    const { cartItems, addToCart, removeFromCart,url } = useContext(StoreContext);


    return (
        <div className='Art-Item'>
            <div className='Art-item-img-container'>
                <img className='Art-item-image' src={url+"/images/"+image} alt=""/>
                {!cartItems[id] 
                    ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt=""/>
                    : <div className='art-item-counter'>
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt=""/>
                        <p>{cartItems[id]}</p>
                        <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt=""/>
                    </div>
                }
            </div>
            <div className='Art-item-info'>
                <div className='Art-item-name-rating'>
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt=""/>
                </div>
                <p className="Art-item-desc">{features}</p>
                <p className='Art-item-price'>₹{price}</p>
            </div>
        </div>
    );
}

export default ArtItem;
