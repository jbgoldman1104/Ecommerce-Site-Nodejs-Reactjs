import React, { useState, useEffect } from 'react'
import cartService from '../services/cartService'
import CartProduct from "./CartUtils/CartProduct";
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Alert from "@material-ui/lab/Alert";
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField'
import { useFormik } from "formik"
import orderService from '../services/orderService'
import HomeIcon from '@material-ui/icons/Home';
import TodayIcon from '@material-ui/icons/Today';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import PowerInputIcon from '@material-ui/icons/PowerInput';
import InputMask from 'react-input-mask'

const Order = () => {
	const [user, setUser] = useState(null)
	const [data, setData] = useState([])
	const [totalPrice, setTotalPrice] = useState(0);
	const [notification, setNotification] = useState(null);
	const [success, setSuccess] = useState(false)
	const history = useHistory()

	const getTotalPrice = () => {
		let total = 0;
		if (data) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].previousPrice) {
					total += data[i].previousPrice;
				} else {
					total += data[i].unitPrice;
				}
			}
		}
		return total;
	};

	useEffect(() => {
		// eslint-disable-line react-hooks/exhaustive-deps
		let value = getTotalPrice()
		setTotalPrice(value);
	}, [data])

	const handleNotification = (message, success) => {
		setNotification(message);
		setSuccess(success)
		setTimeout(() => setNotification(null), 3000);
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}


	const OrderForm = () => {
		const formik = useFormik({
			initialValues: {
				address: "",
				creditCartNumber: "",
				expirationDate: "",
				cvcNumber: ""
			},

			onSubmit: async (values) => {
				try {
					const response = await orderService.createOrder(values['address'])
					if (response.status) {
						handleNotification("Order is created", true);
						await sleep(3000);
						history.push("/")
					} else {
						handleNotification("Wrong Credentials. Please try again", false);
					}
				} catch (exception) {
					handleNotification("Something is wrong", false);
				}
			},
			validateOnChange: false,
			validateOnBlur: false,
		});

		return (
			<div>
				<form
					onSubmit={formik.handleSubmit}
					className="orderForm"
					data-testid="form"
				>

					<TextField
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<HomeIcon />
								</InputAdornment>
							),
						}}
						variant="outlined"
						type="text"
						id="text"
						label="Address for Order"
						{...formik.getFieldProps("address")}
					/>

					<Divider />

					<TextField
						variant="outlined"
						type="text"
						id="creditCartNumber"
						label="Credit Cart Number"
						{...formik.getFieldProps("creditCartNumber")}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<CreditCardIcon />
								</InputAdornment>
							),
						}}
					/>

					<TextField
						variant="outlined"
						type="text"
						id="expirationDate"
						label="Expiration Date"
						{...formik.getFieldProps("expirationDate")}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<TodayIcon />
								</InputAdornment>
							),
						}}
					>
						<InputMask mask="(12)/(21)" maskChar=" " />
					</TextField>

					<TextField
						variant="outlined"
						type="text"
						id="cvcNumber"
						label="CVC Number"
						{...formik.getFieldProps("cvcNumber")}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<PowerInputIcon />
								</InputAdornment>
							),
						}}
					/>


					<Button type="submit" variant="contained" color="primary">
						Buy
					</Button>
				</form>
			</div>
		);
	}

	useEffect(() => {
		let user = window.localStorage.getItem("logged")
		if (!user) {
			history.push("/login")
		} else {
			setUser(JSON.parse(user))
			cartService.getCartProducts().then((response) => {
				if (response.status) {
					setData(response.cart);
				}
			});
			setTotalPrice(getTotalPrice())
		}
	}, [])

	if (user) {
		return (
			<div>
				{notification && <Alert severity={success ? "info" : "error"}>{notification}</Alert>}
				{data?.length !== 0 ? (
					<div className="cart_div_order">
						<div className="border_solid">
							<Grid direction="column" spacing={5}>
								{data?.map((product) => (
									<CartProduct
										product={product}
										showButton={false}
									/>
								))}
								<p className="totalPrice">
									Total Price : <span className="totalPrice_price">{totalPrice}$</span>
								</p>
							</Grid>

						</div>

						<OrderForm />
					</div>
				) : (
					<Alert severity="info">
						There is no item in the cart
					</Alert>
				)}
			</div>
		)
	} else {
		return (
			<p>Loading user</p>
		)
	}

}

export default Order