import {useState, useEffect, useCallback} from 'react'

import Header from '../Header'
import DishItem from '../DishItem'

import './index.css'

const API_URL =
  'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [response, setResponse] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [restaurantName, setRestaurantName] = useState('')

  const addItemToCart = dish => {
    const existingItem = cartItems.find(item => item.dishId === dish.dishId)

    if (!existingItem) {
      const newDish = {
        ...dish,
        quantity: 1,
      }

      setCartItems(previousItems => [...previousItems, newDish])
    } else {
      setCartItems(previousItems =>
        previousItems.map(item =>
          item.dishId === dish.dishId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      )
    }
  }

  const removeItemFromCart = dish => {
    setCartItems(previousItems =>
      previousItems
        .map(item =>
          item.dishId === dish.dishId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter(item => item.quantity > 0),
    )
  }

  const getUpdatedData = tableMenuList =>
    tableMenuList.map(eachMenu => ({
      menuCategory: eachMenu.menu_category,
      menuCategoryId: eachMenu.menu_category_id,
      menuCategoryImage: eachMenu.menu_category_image,

      categoryDishes: eachMenu.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability: eachDish.dish_Availability,
        dishType: eachDish.dish_Type,
        addonCat: eachDish.addonCat || [],
      })),
    }))

  const fetchRestaurantApi = useCallback(async () => {
    try {
      setIsLoading(true)

      const apiResponse = await fetch(API_URL)
      const data = await apiResponse.json()

      const restaurantData = data[0]

      setRestaurantName(restaurantData.restaurant_name)

      const updatedData = getUpdatedData(restaurantData.table_menu_list)

      setResponse(updatedData)

      if (updatedData.length > 0) {
        setActiveCategoryId(updatedData[0].menuCategoryId)
      }
    } catch (error) {
      console.error('Failed to fetch restaurant data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRestaurantApi()
  }, [fetchRestaurantApi])

  const onUpdateActiveCategoryId = menuCategoryId => {
    setActiveCategoryId(menuCategoryId)
  }

  const renderTabMenuList = () =>
    response.map(eachCategory => {
      const isActive = eachCategory.menuCategoryId === activeCategoryId

      return (
        <li
          key={eachCategory.menuCategoryId}
          className={`each-tab-item ${isActive ? 'active-tab-item' : ''}`}
        >
          <button
            type="button"
            className="mt-0 mb-0 ms-2 me-2 tab-category-button"
            onClick={() =>
              onUpdateActiveCategoryId(eachCategory.menuCategoryId)
            }
          >
            {eachCategory.menuCategory}
          </button>
        </li>
      )
    })

  const renderDishes = () => {
    const activeCategory = response.find(
      eachCategory => eachCategory.menuCategoryId === activeCategoryId,
    )

    if (!activeCategory) {
      return null
    }

    return (
      <ul className="m-0 d-flex flex-column dishes-list-container">
        {activeCategory.categoryDishes.map(eachDish => (
          <DishItem
            key={eachDish.dishId}
            dishDetails={eachDish}
            cartItems={cartItems}
            addItemToCart={addItemToCart}
            removeItemFromCart={removeItemFromCart}
          />
        ))}
      </ul>
    )
  }

  const renderSpinner = () => (
    <div className="spinner-container">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )

  if (isLoading) {
    return renderSpinner()
  }

  return (
    <div className="home-background">
      <Header restaurantName={restaurantName} cartItems={cartItems} />

      <ul className="m-0 ps-0 d-flex tab-container">{renderTabMenuList()}</ul>

      {renderDishes()}
    </div>
  )
}

export default Home
