import { Button, Snackbar } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderService from '../services/orderService'
import LoopIcon from '@material-ui/icons/Loop';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DescriptionIcon from '@material-ui/icons/Description';
import TextField from '@material-ui/core/TextField';
import './styles/profile.css'

const Profile = () => {
	const [profileData, setProfileData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [userLocal, setUserLocal] = useState(false);
	const [orderData, setOrderData] = useState(null)
	const [notification, handleNotification] = useState(null)
	const [success, setSuccess] = useState(true)
	const [startDate, setStartDate] = useState(Date())
	const [endDate, setEndDate] = useState(Date())
	const [resultString, setResultString] = useState(null)
	const [_, setUser] = useState(null)


	const handleNotificationMessage = (message, success) => {
		handleNotification(message)
		setSuccess(success);
		setTimeout(() => handleNotification(null), 3000);
	}

	useEffect(() => {

		const logged = window.localStorage.getItem("logged");
		async function fetchData(id) {
			try {
				const response = await orderService.getUserOrders(id)
				if (response.status) {
					setOrderData(response.orders)
				} else {
					handleNotificationMessage("Orders are not fetched", false)
				}
			} catch (exception) {
				handleNotificationMessage("Orders are not fetched", false)
			}
		}
		if (logged) {
			setProfileData(JSON.parse(logged));
			setLoading(false);
			setUserLocal(true);
			setUser(JSON.parse(logged))
			fetchData(JSON.parse(logged)['_id'])

		} else {
			setUserLocal(false);
			setLoading(false);
		}
	}, []);

	function getStatus(id) {
		if (id === 0) {
			return <div className><LoopIcon />Processing</div>
		} else if (id === 1) {
			return <p className="order"><MotorcycleIcon /> In Transit</p>
		} else {
			return <p className="order"><CheckCircleIcon />Delivered</p>
		}
	}

	function getTotalPrice(order) {
		let totalPrice = 0

		let i
		for (i = 0; i < order.products.length; i++) {
			totalPrice += order.products[i].previousPrice ? order.products[i].previousPrice : order.products[i].unitPrice
		}
		return totalPrice
	}

	const handleRange = async (e, start, end) => {
		e.preventDefault()
		try {
			setResultString(`You can check order between ${startDate} and ${endDate}`)
			const start_date = new Date(start)
			setOrderData(orderData.filter(order => (start_date <= new Date(order.date))))
		} catch (exception) {
			handleNotificationMessage("Orders are not fetched", false)
		}
	}

	const handleRefund = async (order_id, num) => {
		try {
			const response = await orderService.refundOrder(order_id, num)
			if (response.status) {
				handleNotificationMessage("Request for refund is transmitted", true)
			} else {
				handleNotificationMessage("Refund is not successful", false)
			}
		} catch (exception) {
			handleNotificationMessage("Refund is not successful", false)
		}
	}

	const handleCancel = async (order) => {
		if (order.status === 0) {
			try {
				const response = await orderService.cancelOrder(order._id)
				if (response.status) {
					setOrderData(orderData.filter(o => o._id !== order._id))
					handleNotificationMessage("Order canceled", true)
				} else {
					handleNotificationMessage("Order is not cancelled", false)
				}
			} catch (exception) {
				handleNotificationMessage("Order is not cancelled", false)
			}
		} else {
			handleNotificationMessage("You can only cancel orders which is processing", false)
		}
	}

	const getRefundStatus = (refund) => {
		if (refund === 1) {
			return "Refund Requested"
		} else if (refund === 2) {
			return "Refund Approved"
		} else if (refund === 3) {
			return "Refund Rejected"
		}
	}

	const handlePdf = async (e, id) => {
		e.preventDefault()
		try {
			const response = await orderService.getPdf(id)
			if (response.status) {
				window.location.href = `http://localhost:3001${response.url}`;

			} else {
				handleNotificationMessage("Not successful", false)
			}
		} catch (exception) {
			handleNotificationMessage("Not successful", false)
		}
	}

	if (loading) {
		return (
			<div>
				<Alert severity="info">Loading Profile Page</Alert>
				<CircularProgress />
			</div>
		);
	} else if (!loading && !userLocal) {
		return (
			<div>
				<Alert severity="info">
					First you need to login to have a profile page. You can login from{" "}
					<Link to="/login">here</Link>
				</Alert>
			</div>
		);
	} else if (!loading && !profileData) {
		return <Alert severity="error">There is a problem</Alert>;
	} else {
		return (
			<div className="profile_card">
				{
					notification && (
						<Snackbar open={notification} autoHideDuration={6000}>
							<Alert severity={success ? "success" : "error"}>
								{notification}
							</Alert>
						</Snackbar>
					)

					//<Alert severity={success? "success": "error"}>{notification}</Alert>
				}
				<div className="sidebar">
					<p className="filter_p">Filter Orders By Date</p>
					<form className="detail_form" data-testid='form' onSubmit={(e) => handleRange(e, startDate, endDate)}>
						<TextField
							type="date"
							label="Start Date"
							InputLabelProps={{
								shrink: true,
							}}
							onChange={(e) => setStartDate(e.target.value)}
							id="standard-error"
						/>

						<TextField
							type="date"
							label="End Date"
							InputLabelProps={{
								shrink: true,
							}}
							onChange={(e) => setEndDate(e.target.value)}
							id="standard-error"
						/>

						<Button variant="outlined" color="primary" type="submit">Get Orders</Button>
					</form>

					<p className="result">{resultString}</p>


				</div>
				<div className="orders">
					<p className="filter_p">Orders</p>
					{orderData?.length === 0 ? <Alert severity="info">There is no product</Alert> : null}
					{orderData?.map((order, i) => (
						<div className="order">
							<div className="order_info">
								<div>
									<h4 className="mb-4">Order {i + 1}</h4>
									<p className="order_date">Date: {order.date}</p>
								</div>
								<div className="buttons">
									{order.refund ? <Button variant="outlined">{getRefundStatus(order.refund)}</Button> : <button className="order_refund_button" onClick={() => handleRefund(order._id, 1)}>Refund</button>}
									{(order.status === 0 && !order.refund) ? <button className="order_refund_button color-red" onClick={() => handleCancel(order)}>Cancel Order</button> : null}
								</div>
							</div>
							<div className="order_products">
								{order.products.map(product => (
									<div className="order_product">
										<img src={product.imagePath} alt={product.productName} className="order_product_image" />
										<div className="order_product_right">
											<div className="order_product_info">
												<p className="order_product_name">{product.productName}</p>
												<p className="order_product_price">{product.previousPrice ? product.previousPrice : product.unitPrice} $</p>
												<p className="order_address"><span className="address_span">Address</span>: {order.address}</p>
											</div>

											<div className="order_product_status">
												<p>{getStatus(order.status)}</p>
											</div>

										</div>

									</div>
								))}
							</div>
							<div className="pdf_flex">
								<p className="total_price"><span>Total Price</span>{getTotalPrice(order)} $</p>
								<Button variant="outlined" color="secondary" onClick={(e) => handlePdf(e, order._id)}><DescriptionIcon />Get PDF</Button>

							</div>
						</div>

					))}
				</div>
			</div >
		);
	}
};

export default Profile;
