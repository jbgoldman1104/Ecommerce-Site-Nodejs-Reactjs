import axios from 'axios'

let token = null

const setToken = newToken => {
    token = newToken
}

const getToken = () => {
    const logged = window.localStorage.getItem('logged')
    return JSON.parse(logged).token
}

const addProductCard = async (id) => {
    const url = `/api/cart/${id}`
    const bodyToSend = { token }
    const response = await axios.post(url, bodyToSend)
    return response.data
}

const getCartProducts = async () => {
    const url = "/api/cart"
    const userToken = getToken()
    const bodyToSend = { token: userToken }
    console.log("token in cartService", bodyToSend)
    /* var data = JSON.stringify({ token })
    console.log(data)
    var config = {
        headers: {
        
            'Content-Type': 'application/json'
        },
        data: data
    }; */
    const response = await axios.post(url, bodyToSend)
    return response.data
}

const getProductWithoutUser = async (ids) => {
    const cartIds = JSON.stringify(ids)
    const url = "/api/userless/cart"
    const response = await axios.post(url, { cartIds })
    return response.data
}

const deleteProduct = async (id) => {
    const url = `/api/cart/${id}`
    const userToken = getToken()
    const bodyToSend = { token: userToken }
    console.log("delete cart ", bodyToSend)
    const response = await axios.delete(url, {
        data: {
            token: userToken
        }
    })
    return response.data
}

const cartService = { addProductCard, setToken, getCartProducts, getProductWithoutUser, deleteProduct }

export default cartService