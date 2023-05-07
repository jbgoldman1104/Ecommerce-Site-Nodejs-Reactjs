import axios from 'axios'

const getToken = () => {
    const logged = window.localStorage.getItem('logged')
    return JSON.parse(logged).token
}

const createOrder = async (address) => {
    let token = getToken()
    let body = {
        address,
        token
    }
    const url = "/api/order"

    const response = await axios.post(url, body)
    return response.data
}


const getAllOrders = async () => {
    const url = "/api/orders"
    const response = await axios.get(url)
    return response.data
}

const updateOrderStatus = async (id, value) => {
    const url = `/api/order/${id}`
    const response = await axios.put(url, {
        status: value
    })
    return response.data
}

const getUserOrders = async (id) => {
    const url = `/api/orders/${id}`
    const response = await axios.get(url)
    return response.data
}


const cancelOrder = async id => {
    const url = `/api/order/${id}`
    let token = getToken()
    console.log("delete token", token)

    const response = await axios.post(url, { token })

    return response.data
}

const refundOrder = async (id, num) => {
    const url = `api/refund/${id}`
    const response = await axios.put(url, { refund: num })
    return response.data
}

const getAllRefund = async () => {
    const url = "/api/refunds"
    const response = await axios.get(url)
    return response.data
}

const getOrdersDateRange = async (start, end) => {
    console.log("Send request")
    const url = "/api/range"
    const body = { start, end }
    const response = await axios.post(url, body)
    return response.data
}

const getPdf = async id => {
    const url = `/api/pdf/${id}`
    const response = await axios.get(url)
    return response.data
}

const orderService = { createOrder, getAllOrders, updateOrderStatus, getUserOrders, cancelOrder, refundOrder, getAllRefund, getOrdersDateRange, getPdf }

export default orderService