import {useState} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import Home from './components/Home'
import Login from './components/Login'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

const App = () => {
  const [cartList, setCartList] = useState([])
  const [restaurantName, setRestaurantName] = useState('')

  const addCartItem = dish => {
    setCartList(prevCartList => {
      const existingDish = prevCartList.find(
        item => item.dishId === dish.dishId,
      )

      if (existingDish) {
        return prevCartList.map(item =>
          item.dishId === dish.dishId
            ? {...item, quantity: item.quantity + 1}
            : item,
        )
      }

      return [...prevCartList, {...dish, quantity: 1}]
    })
  }

  const removeCartItem = dishId => {
    setCartList(prevCartList =>
      prevCartList.filter(item => item.dishId !== dishId),
    )
  }

  const removeAllCartItems = () => {
    setCartList([])
  }

  const incrementCartItemQuantity = dishId => {
    setCartList(prevCartList =>
      prevCartList.map(item =>
        item.dishId === dishId ? {...item, quantity: item.quantity + 1} : item,
      ),
    )
  }

  const decrementCartItemQuantity = dishId => {
    setCartList(prevCartList =>
      prevCartList
        .map(item =>
          item.dishId === dishId
            ? {...item, quantity: item.quantity - 1}
            : item,
        )
        .filter(item => item.quantity > 0),
    )
  }

  const contextValue = {
    cartList,
    addCartItem,
    removeCartItem,
    removeAllCartItems,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
    restaurantName,
    setRestaurantName,
  }

  return (
    <CartContext.Provider value={contextValue}>
      <Switch>
        <Route exact path="/login" component={Login} />

        <ProtectedRoute exact path="/" component={Home} />

        <ProtectedRoute exact path="/cart" component={Cart} />

        <Route exact path="/not-found" component={NotFound} />

        <Redirect to="/not-found" />
      </Switch>
    </CartContext.Provider>
  )
}

export default App
