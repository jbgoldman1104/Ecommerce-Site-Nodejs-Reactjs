import {
	Button,
	Card,
	CardMedia,
	Divider,
	Typography,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import NotificationsIcon from '@material-ui/icons/Notifications';
import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";
import cartService from "../services/cartService";
import commentService from "../services/commentService";
import productService from "../services/productService";
import Comment from "./ProductUtils/Comment";
import Spinner from "./Spinner";
import "./styles/productDetail.css";

const ProductDetail = () => {
	const params = useParams();
	const [data, setData] = useState(null);
	const [commentData, setCommentData] = useState(null);
	const [comment, setComment] = useState("");
	const [notification, setNotification] = useState(null);
	const [loading, setLoading] = useState(true);
	const [success, setSuccess] = useState(false);
	const history = useHistory();

	const handleNotification = (message, isSuccess) => {
		setNotification(message);
		setSuccess(isSuccess);
		setTimeout(() => setNotification(null), 3000);
	};

	const handleComment = (e) => {
		e.preventDefault();
		if (!window.localStorage.getItem("logged")) {
			history.push("/login");
		} else {
			commentService
				.addComment({
					productID: data._id,
					content: comment,
				})
				.then((response) => {
					if (response.status) {
						setCommentData(response.comments);
						setNotification("Comment sent! Waiting for approval!");
						setSuccess(true);
						setTimeout(() => setNotification(null), 3000);
					} else {
						setNotification("Comment did not sent.");
						setSuccess(false);
						setTimeout(() => setNotification(null), 3000);
					}
				})
				.catch((_error) => {
					setNotification("Comment is not sent.");
					setSuccess(false);
					setTimeout(() => setNotification(null), 3000);
				});
		}
	};

	useEffect(() => {
		productService
			.getProduct(params.id)
			.then((response) => {
				if (response.status) {
					setData(response.product);
					setLoading(false);
					setCommentData(response.product.comments);
				} else {
					setLoading(false);
				}
			})
			.catch((_error) => {
				setLoading(false);
			});
	}, [params.id]);

	const handleRate = async (nextValue, prevValue, name) => {
		try {
			if (!window.localStorage.getItem("logged")) {
				history.push("/login");
			} else {
				const response = await productService.rateProduct(data._id, nextValue);
				if (response.status) {
					setData(response.product);
					handleNotification("Your rate is sent", true);
				} else {
					handleNotification("There is a problem", false);
				}
			}
		} catch (exception) {
			handleNotification("There is a problem", false);
		}
	};

	const addCart = (e) => {
		e.preventDefault();
		if (!window.localStorage.getItem("logged")) {
			if (!window.localStorage.getItem("cart_without_login")) {
				let currentCart = [data._id];
				window.localStorage.setItem(
					"cart_without_login",
					JSON.stringify(currentCart)
				);
			} else {
				let currentCart = JSON.parse(
					window.localStorage.getItem("cart_without_login")
				);
				window.localStorage.setItem(
					"cart_without_login",
					JSON.stringify(currentCart.concat(data._id))
				);
			}
			handleNotification("Product added to cart successfully", true);
		} else {
			cartService
				.addProductCard(data._id)
				.then((response) => {
					if (response.status) {
						handleNotification("Product added to cart successfully", true);
						window.localStorage.setItem(
							"logged",
							JSON.stringify(response.user)
						);
					} else {
						handleNotification("Operation unsuccessful", false);
					}
				})
				.catch((_error) => {
					handleNotification("Operation unsuccessful", false);
				});
		}
	};

	const registerProductHandler = async (e, product) => {
		const logged = window.localStorage.getItem("logged");
		if (!logged) {
			handleNotification("You need to login to register a product", false);
		} else {
			try {
				const response = await productService.registerProduct(product._id);
				if (response.status) {
					handleNotification("You are registered to product. If there is any discount, an email will be sent to you.", true);
				} else {
					handleNotification("Register operation unsuccessful", false);
				}
			} catch (exception) {
				handleNotification("Register operation unsuccessful", false);
			}
		}
	}

	if (data) {
		let priceBlock = null;
		if (data.previousPrice !== 0) {
			const salePercentage = Math.floor(
				((data.unitPrice - data.previousPrice) * 100) / data.unitPrice
			);
			priceBlock = (
				<div className="sale_prices">
					<div className="sale">
						<p>%{salePercentage}</p>
						<small>Discount</small>
					</div>
					<div className="prices">
						<p className="old_price">{data.unitPrice}</p>
						<p className="new_price">{data.previousPrice} TL</p>
					</div>
				</div>
			);
		} else {
			priceBlock = (
				<div className="sale_prices">
					<p className="new_price">{data.unitPrice} $</p>
				</div>
			);
		}

		return (
			<div>
				{notification && (
					<Snackbar open={notification} autoHideDuration={6000}>
						<Alert severity={success ? "success" : "error"}>
							{notification}
						</Alert>
					</Snackbar>
				)}
				<div className="product_detail">
					<Card style={{ width: 500, margin: 20, border: 0 }}>
						<CardMedia
							component="img"
							src={data.imagePath}
							image={data.imagePath}
							title={data.productName}
						/>
					</Card>

					<div className="details">
						<div className="details_header">
							<p className="product_name">{data.productName}</p>
							<p className="gray_color">{data.description}</p>
						</div>

						<div className="details_price">
							{priceBlock}
							<div className="product_rating">
								<div className="rate_div">
									{/* <p className="yellow_color">{data.rate}</p> */}
									<StarRatingComponent
										name={data._id}
										starCount={5}
										value={data.rate}
										onStarClick={handleRate}
									/>
								</div>
								<Typography variant="h6">{data.rateTotal} reviews</Typography>
							</div>
						</div>

						<p>Current Stock : {data.stock}</p>

						{data.stock ? (
							<div className="product_buy">
								<Button
									style={{ backgroundColor: "#ff7826", color: "white", marginRight: "1rem" }}
									onClick={addCart}
								>
									<ShoppingCartOutlinedIcon />
									Add to Cart
								</Button>
								<Button variant="outlined" color="primary" onClick={(e) => registerProductHandler(e, data)}>
									<NotificationsIcon />
									Register
								</Button>
							</div>
						) : (
							<Alert severity="info">Out of Stock</Alert>
						)}

						<div className="add_comment">
							<form onSubmit={handleComment} className="detail_form">
								<TextField
									id="standard-error"
									label="Comment"
									variant="outlined"
									onChange={(e) => setComment(e.target.value)}
									multiline
									rows={2}
								/>

								<Button
									variant="contained"
									style={{ backgroundColor: "#ff7826", color: "white" }}
									type="submit"
								>
									Send
								</Button>
							</form>
						</div>
					</div>
				</div>

				<div className="comments">
					<Typography variant="h4" component="h5" gutterBottom>
						<Divider style={{ margin: 10, marginTop: 20 }} />
						{commentData?.length === 0
							? <Alert severity="info">There is no comment. Be the first one!</Alert>
							: "Comments"}
					</Typography>
					{commentData &&
						commentData.map((comment) => (
							<div>
								{comment.approval ? <Comment comment={comment} /> : null}
							</div>
						))}
				</div>
			</div>
		);
	} else if (!data && !loading) {
		return (
			<div>
				<h3>There is no product like this! Or we have a problem.</h3>
				<p>
					You can go to homepage from <Link to="/">here</Link>
				</p>
			</div>
		);
	} else {
		return <Spinner />;
	}
};

export default ProductDetail;
