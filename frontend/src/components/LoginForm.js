import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./styles/LoginForm.css";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const LoginForm = ({ handleLogin }) => {
	const [notification, setNotification] = useState(null);
	const history = useHistory();

	useEffect(() => {
		if (window.localStorage.getItem("logged")) {
			history.push("/");
		}
	}, [history]);

	const formik = useFormik({
		initialValues: {
			userEmail: "",
			password: "",
		},
		validationSchema: Yup.object({
			userEmail: Yup.string()
				.email("Invalid email address")
				.required("Email is required"),
			password: Yup.string().required("Password is required"),
		}),

		onSubmit: async (values) => {
			const result = await handleLogin(values);
			if (result) {
				history.push("/");
			} else {
				setNotification("Wrong Credentials. Please try again");
				setTimeout(() => setNotification(null), 3000);
			}
		},
		validateOnChange: false,
		validateOnBlur: false,
	});

	return (
		<div>
			{notification && <Alert severity="error">{notification}</Alert>}
			<div className="form-div">
				<div className="login-card">
					<p className="loginform_h2">Login to Shop</p>
					<p className="loginform_p">
						Login to shop basketball accessories and products,
						including NBA jerseys and indoor and outdoor basketball
						systems.
					</p>
				</div>
				<form
					onSubmit={formik.handleSubmit}
					className="detail_form"
					data-testid="form"
				>

					<TextField
						variant="outlined"
						type="email"
						id="email"
						label="Email"
						{...formik.getFieldProps("userEmail")}
					/>

					{formik.touched.userEmail && formik.errors.userEmail ? (
						<div className="form-error">
							{formik.errors.userEmail}
						</div>
					) : null}

					<TextField
						variant="outlined"
						type="password"
						id="password"
						label="Password"
						{...formik.getFieldProps("password")}
					/>

					{formik.touched.password && formik.errors.password ? (
						<div className="form-error">
							{formik.errors.password}
						</div>
					) : null}

					<Button type="submit" variant="contained" color="primary">
						Login
					</Button>

					<p>
						If you do not have an account, you can
						<Link to="/signup"> sign-up</Link> from here
					</p>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
