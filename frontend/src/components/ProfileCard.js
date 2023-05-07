import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { Link } from 'react-router-dom'

export default function ProfileCard({ profile, user, setUser }) {
	const [notification, setNotification] = useState(undefined);

	const handleNotification = (message, severity) => {
		setNotification({ message, severity });
		setTimeout(() => setNotification(null), 3000);
	};

	const formik = useFormik({
		initialValues: {
			username: profile.username,
			userEmail: profile.userEmail,
			password: "",
			passwordValidation: "",
		},
		validationSchema: Yup.object({
			username: Yup.string().required("Name is required"),
			userEmail: Yup.string()
				.email("Invalid email address")
				.required("Email is required"),
			password: Yup.string().required("Password is required"),
			passwordValidation: Yup.string().oneOf(
				[Yup.ref("password"), null],
				"Passwords must match"
			),
		}),

		onSubmit: async (values) => {
			try {
				const result = await axios.put(`/api/user/${profile._id}`, values);
				if (!result.data || !result.data.user) {
					throw new Error(`cannot get updated user`);
				}
				window.localStorage.setItem("logged", JSON.stringify(result.data.user));
				setUser(result.data.user)
				handleNotification("User updated!", "success");
			} catch (error) {
				handleNotification("Cannot update user!", "error");
			}
		},
		validateOnChange: false,
		validateOnBlur: false,
	});

	if (user) {
		return (
			<div>
				<div className="form-div">
					<div className="login-card">
						<Typography variant="h2" component="h2" gutterBottom>
							Update your profile
						</Typography>
						<Typography variant="h4" component="h4" gutterBottom>
							<MailOutlineOutlinedIcon fontSize="large" />
							{user.userEmail}
						</Typography>
						<Typography variant="h4" component="h4" gutterBottom>
							<AccountCircleOutlinedIcon fontSize="large" />
							{user.username}
						</Typography>
					</div>

					<form
						onSubmit={formik.handleSubmit}
						className="detail_form"
						data-testid="form"
					>
						<TextField
							variant="outlined"
							type="text"
							id="standard-error"
							label="Username"
							{...formik.getFieldProps("username")}
						/>

						{formik.touched.username && formik.errors.username ? (
							<div className="form-error">{formik.errors.username}</div>
						) : null}

						<TextField
							variant="outlined"
							type="email"
							id="standard-error"
							label="Email"
							{...formik.getFieldProps("userEmail")}
						/>

						{formik.touched.userEmail && formik.errors.userEmail ? (
							<div className="form-error">{formik.errors.userEmail}</div>
						) : null}

						<TextField
							variant="outlined"
							type="password"
							id="standard-error"
							label="Password"
							{...formik.getFieldProps("password")}
						/>

						{formik.touched.password && formik.errors.password ? (
							<div className="form-error">{formik.errors.password}</div>
						) : null}

						<TextField
							variant="outlined"
							type="password"
							id="standard-error"
							label="Password Again"
							{...formik.getFieldProps("passwordValidation")}
						/>

						{formik.touched.passwordValidation &&
							formik.errors.passwordValidation ? (
							<div className="form-error">{formik.errors.passwordValidation}</div>
						) : null}

						<Button type="submit" color="primary" variant="contained">
							Update
						</Button>
						{notification && (
							<Alert severity={notification.severity}>
								{notification.message}
							</Alert>
						)}
					</form>
				</div>
			</div>
		);

	}
	else {
		return (
			<Alert severity="info">
				There is no user. First you need to <Link to="/login">login</Link>.
			</Alert>
		)
	}
}
