import {
	Typography,
	Button,
	Paper,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	InputLabel,
	MenuItem,
	FormControl,
	Select
} from "@material-ui/core";


import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import DeleteIcon from "@material-ui/icons/Delete";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import LoopIcon from '@material-ui/icons/Loop';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AddBoxIcon from '@material-ui/icons/AddBox'


import Alert from "@material-ui/lab/Alert";

import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Refunds from '../components/DashboardUtils/Refunds'
import commentService from "../services/commentService";
import productService from "../services/productService";
import orderService from "../services/orderService";


const Dashboard = () => {
	const [productData, setProductData] = useState([]);
	const [commentData, setCommentData] = useState([]);
	const [orderData, setOrderData] = useState([]);
	const [allowed, setAllowed] = useState(0);
	const [notification, setNotification] = useState(null);
	const [success, setSuccess] = useState(false);
	const [change, setChange] = useState([]); //for the order change
	const history = useHistory();

	const handleNotification = (message, isSuccess) => {
		setNotification(message);
		setSuccess(isSuccess);
		setTimeout(() => setNotification(null), 3000);
	};

	useEffect(() => {
		async function fetchData() {
			const logged = JSON.parse(window.localStorage.getItem("logged"));

			if (!logged) {
				history.push("/login");
			} else if (logged.userType === 0) {
				handleNotification("You are not allowed for the admin panel", false);
			} else {
				setAllowed(logged.userType);
				try {
					const response = await productService.getAllProduct();
					if (response.status) {
						setProductData(response.products);
					} else {
						handleNotification("Product did not fetched. There is a problem", false);
					}
				} catch (exception) {
					handleNotification("Product did not fetched. There is a problem", false);
				}
			}
		}
		fetchData();
	}, [history]);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await commentService.getAllComments();
				if (response.status) {
					setCommentData(response.comments);
				} else {
					handleNotification("Comments did not fetched. There is a problem", false
					);
				}
			} catch (exception) {
				handleNotification("Comments did not fetched. There is a problem", false);
			}
		}
		fetchData();
	}, []);


	useEffect(() => {
		async function fetchData() {
			try {
				const response = await orderService.getAllOrders();
				if (response.status) {
					setOrderData(response.orders);
					setChange(response.orders)
				} else {
					handleNotification("Orders did not fetched. There is a problem", false
					);
				}
			} catch (exception) {
				handleNotification("Orders did not fetched. There is a problem", false);
			}
		}
		fetchData();
	}, []);

	const handleDelete = async (e, id) => {
		e.preventDefault();
		var result = window.confirm("You sure about deleting?");
		if (result) {
			try {
				const response = await productService.deleteProduct(id);
				if (response.status) {
					handleNotification(`Product ${id} is deleted`, true);
					setProductData(
						productData.filter((product) => product._id !== response.id)
					);
				} else {
					handleNotification(`Product ${id} is not deleted`, false);
				}
			} catch (exception) {
				handleNotification(`Product ${id} is not deleted`, false);
			}
		}
	};

	const approveComment = async (comment) => {
		try {
			const response = await commentService.approveComment(comment);
			if (response.status) {
				handleNotification(`Operation successful`, true);
				setCommentData(
					commentData.map((com) =>
						com._id === comment._id
							? { ...comment, approval: !comment.approval }
							: com
					)
				);
			} else {
				handleNotification(`Approval did not happen`, false);
			}
		} catch (exception) {
			handleNotification(`Approval did not happen`, false);
		}
	};

	const handleDeliveryStatus = async (id, value) => {
		try {
			const response = await orderService.updateOrderStatus(id, value)
			if (response.status) {
				handleNotification(`Operation successful`, true);
				setOrderData(
					orderData.map(order => order._id === id ? { ...order, status: value } : order)
				)
			} else {
				handleNotification(`Approval did not happen`, false);
			}
		} catch (exception) {
			handleNotification(`Approval did not happen`, false);
		}
	}

	function getStatus(id) {
		if (id === 0) {
			return <div className><LoopIcon />Processing</div>
		} else if (id === 1) {
			return <p className="order"><MotorcycleIcon /> In Transit</p>
		} else {
			return <p className="order"><CheckCircleIcon />Delivered</p>
		}
	}

	function changeDelivery(idx, value) {

		let newArr = JSON.stringify(change);
		newArr = JSON.parse(newArr)
		newArr[idx]['status'] = value
		setChange(newArr)
	}

	const Orders = () => {
		if (orderData) {
			return (
				<TableContainer component={Paper}>
					<Typography variant="h4" component="h2" gutterBottom>
						Orders
					</Typography>
					<Table size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell align="right">Customer Id</TableCell>
								<TableCell align="right">Products Detail</TableCell>
								<TableCell align="right">Status</TableCell>
								<TableCell align="right">Change</TableCell>
								<TableCell align="right">Update</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orderData.map((order, i) => (
								<TableRow key={i}>
									<TableCell component="th" scope="row" align="right">
										{order.customer[0]}
									</TableCell>
									<TableCell component="th" scope="row" align="right">
										<Link to={"/" + order._id}>{order._id}</Link>
									</TableCell>

									<TableCell component="th" scope="row" align="right">
										{getStatus(order.status)}
									</TableCell>

									<TableCell component="th" scope="row" align="right">
										<FormControl>
											<InputLabel id="demo-simple-select-label">Status</InputLabel>
											<Select
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={change[i]['status'] ? change[i]['status'] : 0}
												onChange={(e) => changeDelivery(i, e.target.value)}
											>
												<MenuItem value={0}>Processing</MenuItem>
												<MenuItem value={1}>In Transit</MenuItem>
												<MenuItem value={2}>Delivered</MenuItem>
											</Select>
										</FormControl>
									</TableCell>

									<TableCell component="th" scope="row" align="right">
										<Button variant="contained" color="primary" onClick={() => handleDeliveryStatus(order._id, change[i]['status'])}>Update</Button>
									</TableCell>

								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)
		}
	}

	const Comments = () => {
		if (commentData) {
			return (
				<TableContainer component={Paper}>
					<Typography variant="h4" component="h2" gutterBottom>
						Comments
					</Typography>
					<Table size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell>Comment</TableCell>
								<TableCell align="right">Product</TableCell>
								<TableCell align="right">Owner</TableCell>
								<TableCell align="right">Date</TableCell>
								<TableCell align="right">Approve</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{commentData.map((comment) => (
								<TableRow key={comment._id}>
									<TableCell component="th" scope="row">
										{comment.content}
									</TableCell>
									<TableCell align="right">
										<Link to={"/product/" + comment.product}>
											{comment.product}
										</Link>
									</TableCell>
									<TableCell align="right">{comment.owner}</TableCell>
									<TableCell align="right">
										{new Date(comment.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell align="right">
										<Button
											variant="contained"
											color="primary"
											onClick={() => approveComment(comment)}
										>
											{comment.approval ? (
												<div className="approveIcon">
													<ThumbDownIcon /> Disapprove
												</div>
											) : (
												<div className="approveIcon">
													<ThumbUpIcon />
													Approve
												</div>
											)}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			);
		}
		return <p>Loading</p>;
	};

	const Products = () => (

		<TableContainer component={Paper}>
			<div className="title-add">
				<Typography variant="h4" component="h2" gutterBottom>
					Products
				</Typography>
				<Link to="/addproduct">
					<Button type="submit" variant="contained" color="primary">
						<AddBoxIcon />Add New Product
					</Button>
				</Link>
			</div>
			<Table size="small" aria-label="a dense table">
				<TableHead>
					<TableRow>
						<TableCell>Product</TableCell>
						<TableCell align="right">Description</TableCell>
						<TableCell align="right">Price</TableCell>
						{allowed === 2 ? (
							<TableCell align="right">Rate</TableCell>
						) : (
							<TableCell align="right">Previous Price</TableCell>
						)}
						<TableCell align="right">Category ID</TableCell>
						{allowed === 2 ? (
							<TableCell align="right">Delete</TableCell>
						) : (
							<TableCell align="right">Set Price</TableCell>
						)}

						{allowed === 2 ? <TableCell align="right">Update</TableCell> : null}
					</TableRow>
				</TableHead>
				<TableBody>
					{productData.map((product) => (
						<TableRow key={product._id}>
							<TableCell component="th" scope="row">
								{product.productName}
							</TableCell>
							<TableCell align="right">{product.description}</TableCell>
							<TableCell align="right">{product.unitPrice}</TableCell>
							{allowed === 2 ? (
								<TableCell align="right">{product.rate}</TableCell>
							) : (
								<TableCell align="right">{product.previousPrice}</TableCell>
							)}
							<TableCell align="right">{product.categoryID}</TableCell>
							{allowed === 2 ? (
								<TableCell align="right">
									<Button
										variant="contained"
										color="secondary"
										onClick={(e) => handleDelete(e, product._id)}
									>
										<DeleteIcon />
										Delete
									</Button>
								</TableCell>
							) : (
								<TableCell align="right">
									<Button
										variant="contained"
										color="primary"
										href={"/update/product/" + product._id}
									>
										<AttachMoneyIcon />
										Set Price
									</Button>
								</TableCell>
							)}

							{allowed === 2 ? (
								<TableCell align="right">
									<Button
										variant="contained"
										color="primary"
										href={"/update/product/" + product._id}
									>
										<SystemUpdateAltIcon />
										Update
									</Button>
								</TableCell>
							) : null}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);

	return (
		<div>
			{
				notification && (
					<Snackbar open={notification} autoHideDuration={6000}>
						<Alert severity={success ? "success" : "error"}>
							{notification}
						</Alert>
					</Snackbar>
				)
			}

			{allowed === 2 ? (
				<Tabs>
					<TabList>
						<Tab>Products</Tab>
						<Tab>Comments</Tab>
						<Tab>Orders</Tab>
					</TabList>

					<TabPanel>
						<Products />
						{/* <ProductForm addProduct={addProduct} /> */}
					</TabPanel>
					<TabPanel>
						<Comments />
					</TabPanel>
					<TabPanel>
						<Orders />
					</TabPanel>
				</Tabs>
			) : (
				<Tabs>
					<TabList>
						<Tab>Products</Tab>
						<Tab>Refunds</Tab>
					</TabList>
					<TabPanel>
						<Products />

					</TabPanel>

					<TabPanel>
						<Refunds />

					</TabPanel>

				</Tabs>
			)}
		</div>
	);
};

export default Dashboard;
