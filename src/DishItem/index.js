import './index.css'

const DishItem = ({
  dishDetails,
  cartItems,
  addItemToCart,
  removeItemFromCart,
}) => {
  const {
    dishId,
    dishName,
    dishType,
    dishPrice,
    dishCurrency,
    dishDescription,
    dishImage,
    dishCalories,
    addonCat,
    dishAvailability,
  } = dishDetails

  const cartItem = cartItems.find(item => item.dishId === dishId)
  const quantity = cartItem ? cartItem.quantity : 0

  const onIncreaseQuantity = () => {
    addItemToCart(dishDetails)
  }

  const onDecreaseQuantity = () => {
    removeItemFromCart(dishDetails)
  }

  const isNonVeg = dishType === 1
  const hasCustomizations = Array.isArray(addonCat) && addonCat.length > 0

  const renderController = () => (
    <div className="controller-container d-flex align-items-center bg-success">
      <button className="button" type="button" onClick={onDecreaseQuantity}>
        -
      </button>

      <p className="quantity">{quantity}</p>

      <button className="button" type="button" onClick={onIncreaseQuantity}>
        +
      </button>
    </div>
  )

  return (
    <li className="mb-3 p-3 dish-item-container d-flex">
      <div className={`veg-border ${isNonVeg ? 'non-veg-border' : ''} me-3`}>
        <div className={`veg-round ${isNonVeg ? 'non-veg-round' : ''}`} />
      </div>

      <div className="dish-details-container">
        <h1 className="dish-name">{dishName}</h1>

        <p className="dish-currency-price">
          {dishCurrency} {dishPrice}
        </p>

        <p className="dish-description">{dishDescription}</p>

        {dishAvailability && renderController()}

        {!dishAvailability && (
          <p className="not-availability-text text-danger">Not available</p>
        )}

        {hasCustomizations && (
          <p className="addon-availability-text">Customizations available</p>
        )}
      </div>

      <p className="dish-calories text-warning">{dishCalories} calories</p>

      <img className="dish-image" src={dishImage} alt={dishName} />
    </li>
  )
}

export default DishItem
