import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import './styles/SignupForm.css'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const SignupForm = () => {

	const history = useHistory()
	useEffect(() => {
		if (window.localStorage.getItem('logged')) {
			history.push("/")
		}
	}, [history])

	const formik = useFormik({
		initialValues: {
			username: '',
			userEmail: '',
			password: '',
			passwordValidation: ''
		},
		validationSchema: Yup.object({
			username: Yup.string().required('Name is required'),
			userEmail: Yup.string().email('Invalid email address').required('Email is required'),
			password: Yup.string().required('Password is required'),
			passwordValidation: Yup.string()
				.oneOf([Yup.ref('password'), null], 'Passwords must match')
		}),

		onSubmit: values => {
			axios
				.post('/api/signup', values)
				.then((response) => {
					if (response.data.status) {
						history.push('/login')
					} else {
					}
				})

		},
		validateOnChange: false,
		validateOnBlur: false
	})

	return (
		<div>
			<div className="form-div">
				<div className="login-card">
					<h2 className="loginform_h2">Signup to Shop</h2>
					<p className="loginform_p">Sign up to shop basketball accessories and products, including NBA
						jerseys and indoor and outdoor basketball systems.</p>
				</div>

				<form onSubmit={formik.handleSubmit} className="detail_form" data-testid='form'>
					<TextField variant="outlined" type="text" id="standard-error"
						label="Username"
						{...formik.getFieldProps('username')} />

					{formik.touched.username && formik.errors.username ? (
						<div className="form-error">{formik.errors.username}</div>
					) : null}

					<TextField variant="outlined" type="email" id="standard-error"
						label="Email"
						{...formik.getFieldProps('userEmail')} />

					{formik.touched.userEmail && formik.errors.userEmail ? (
						<div className="form-error">{formik.errors.userEmail}</div>
					) : null}

					<TextField variant="outlined" type="password" id="standard-error"
						label="Password"
						{...formik.getFieldProps('password')} />

					{formik.touched.password && formik.errors.password ? (
						<div className="form-error">{formik.errors.password}</div>
					) : null}

					<TextField variant="outlined" type="password" id="standard-error"
						label="Password Again"
						{...formik.getFieldProps('passwordValidation')} />

					{formik.touched.passwordValidation && formik.errors.passwordValidation ? (
						<div className="form-error">{formik.errors.passwordValidation}</div>
					) : null}

					<Button type="submit" color="primary" variant="contained">
						Sign Up
					</Button>

					<p>If you have an account, you can <Link to="/login">login</Link> from here</p>
				</form>
			</div>
		</div>
	)
}

export default SignupForm