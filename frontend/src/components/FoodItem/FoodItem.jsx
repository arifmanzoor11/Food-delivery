import React, { useContext, useRef } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../context/StoreContext';

const FoodItem = ({id, name, price, description, image}) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const minusBtnRef = useRef(null);

  const handleRemove = () => {
    // Remove and re-add animation class to restart animation
    const btn = minusBtnRef.current;
    if (btn) {
      btn.classList.remove('anim-shrink');
      // Trigger reflow to restart animation
      void btn.offsetWidth; 
      btn.classList.add('anim-shrink');
    }
    removeFromCart(id);
  }

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={url + '/images/' + image} alt="" />
        {
          !cartItems[id] ? 
            <img className='add anim-open-left' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="Add item" /> : 
            <div className="food-item-counter anim-open-left">
              <img
                ref={minusBtnRef}
                onClick={handleRemove}
                src={assets.remove_icon_red}
                alt="Remove one item"
                title="Remove one item"
              />
              <p>{cartItems[id]}</p>
              <img
                onClick={() => addToCart(id)}
                src={assets.add_icon_green}
                alt="Add one item"
                title="Add one item"
              />
            </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  )
}

export default FoodItem;
