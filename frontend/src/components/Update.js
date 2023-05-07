import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "../services/productService";
import SalesUpdateForm from "./DashboardUtils/SalesUpdateForm";
import ProductUpdateForm from "./DashboardUtils/UpdateForm";
import CartProduct from "./CartUtils/CartProduct";

const UpdateForm = () => {
    const params = useParams();
    const [data, setData] = useState(null);
    const [user, setUser] = useState(1);

    useEffect(() => {
        productService
            .getProduct(params.id)
            .then((response) => {
                if (response.status) {
                    setData(response.product);
                }
            });
    }, [params.id]);

    useEffect(() => {
        const logged = window.localStorage.getItem("logged");
        if (logged) {
            setUser(JSON.parse(logged).userType);
        }
    }, []);

    const ProductInfo = () => {
        if (data) {
            return <CartProduct product={data} showButton={false} />;
        }
        return <p>Loading</p>;
    };


    return (
        <div>
            <ProductInfo />
            <h3>Update Product</h3>
            {user === 1 && data && <SalesUpdateForm data={data} />}
            {user === 2 && data && <ProductUpdateForm data={data} />}
        </div>
    );
};

export default UpdateForm;
