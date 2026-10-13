import {useState, useEffect, useContext} from 'react'

import Header from '../Header'
import DishItem from '../DishItem'
import CartContext from '../../context/CartContext'

import './index.css'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [response, setResponse] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState('')

  const {setRestaurantName} = useContext(CartContext)

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

  useEffect(() => {
    const fetchRestaurantApi = async () => {
      const dishesApiUrl =
        'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

      try {
        const apiResponse = await fetch(dishesApiUrl)
        const data = await apiResponse.json()

        const restaurantData = Array.isArray(data) ? data[0] : data

        if (!restaurantData) {
          return
        }

        const menuList = restaurantData.table_menu_list || []

        setRestaurantName(restaurantData.restaurant_name || '')

        const updatedData = getUpdatedData(menuList)
        setResponse(updatedData)

        if (updatedData.length > 0) {
          setActiveCategoryId(updatedData[0].menuCategoryId)
        }
      } catch (error) {
        console.error('Failed to fetch restaurant menu:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurantApi()
  }, [setRestaurantName])

  const renderTabMenuList = () =>
    response.map(eachCategory => (
      <li
        className={`each-tab-item ${
          eachCategory.menuCategoryId === activeCategoryId
            ? 'active-tab-item'
            : ''
        }`}
        key={eachCategory.menuCategoryId}
      >
        <button
          type="button"
          className="mt-0 mb-0 ms-2 me-2 tab-category-button"
          onClick={() => setActiveCategoryId(eachCategory.menuCategoryId)}
        >
          {eachCategory.menuCategory}
        </button>
      </li>
    ))

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
          <DishItem key={eachDish.dishId} dishDetails={eachDish} />
        ))}
      </ul>
    )
  }

  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner-border" role="status" />
      </div>
    )
  }

  return (
    <div className="home-background">
      <Header />

      <ul className="m-0 ps-0 d-flex tab-container">{renderTabMenuList()}</ul>

      {renderDishes()}
    </div>
  )
}

export default Home
