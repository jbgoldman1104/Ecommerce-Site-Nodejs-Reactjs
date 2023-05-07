import axios from "axios";

const baseUrl = "/api/product";
let token = null;

const setToken = (newToken) => {
    token = newToken;
};

const getAllProduct = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const getProduct = async (id) => {
    const url = `${baseUrl}/${id}`;
    const response = await axios.get(url);
    return response.data;
};

const addProduct = async (values) => {
    const response = await axios.post(baseUrl, values);
    console.log("response", response.data);
    return response.data;
};

const deleteProduct = async (id) => {
    const path = `${baseUrl}/${id}`;
    const response = await axios.delete(path, { id });
    return response.data;
};

const updateProduct = async (oldObject, newObject) => {
    const toSend = { rate: oldObject.rateCount, token, ...newObject };
    const url = `/admin/pm/product/${oldObject._id}`;
    try {
        const response = await axios.put(url, toSend);
        return response.data;
    } catch {
        console.log("error");
    }
};

const addComment = async (commentObj) => {
    const bodyToSend = {
        token,
        ...commentObj,
    };

    console.log("body", bodyToSend);
    const url = "/api/comment";
    const response = await axios.post(url, bodyToSend);
    return response.data;
};

const changePrice = async (basePrice, previousPrice, product) => {
    console.log(basePrice, previousPrice, product);
    const url = `/admin/sm/product/${product._id}`;
    const toSend = {
        ...product,
        unitPrice: basePrice,
        previousPrice: previousPrice,
        token,
    };
    console.log(toSend);
    const response = await axios.put(url, toSend);
    return response.data;
};

const rateProduct = async (id, rate) => {
    const url = "/api/rate/product";
    const toSend = { id, input_rate: rate };
    const response = await axios.post(url, toSend);
    return response.data;
};

const getProductsByCategory = async (id) => {
    try {
        const url = `/api/category/product/${id}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log("cannot get products", error.message);
    }
};


const registerProduct = async (id) => {
    const url = "/api/register"
    const bodyToSend = {
        token,
        productID: id
    }
    const response = await axios.post(url, bodyToSend)
    return response.data
}

const productService = {
    getAllProduct,
    getProduct,
    addProduct,
    deleteProduct,
    updateProduct,
    setToken,
    addComment,
    changePrice,
    rateProduct,
    getProductsByCategory,
    registerProduct
};
export default productService;
