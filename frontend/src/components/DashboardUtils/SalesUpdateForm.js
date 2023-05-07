import React from 'react'
import { useHistory } from 'react-router-dom'
import { useFormik } from 'formik'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import productService from '../../services/productService'

const SalesUpdateForm = ({ data }) => {
	const history = useHistory()
	const formik = useFormik({
		initialValues: {
			unitPrice: data?.unitPrice,
			previousPrice: data?.previousPrice
		},

		onSubmit: values => {
			productService
				.changePrice(values.unitPrice, values.previousPrice, data)
				.then((response) => {
					history.push('/dashboard')
				})

		},
		validateOnChange: false,
		validateOnBlur: false
	})

	return (
		<form onSubmit={formik.handleSubmit} className="detail_form">
			<TextField
				variant="outlined"
				id="standard-number"
				label="Price"
				type="number"
				InputLabelProps={{
					shrink: true,
				}}
				{...formik.getFieldProps('unitPrice')}
			/>
			<TextField
				variant="outlined"
				id="standard-number"
				label="Price"
				type="number"
				InputLabelProps={{
					shrink: true,
				}}
				{...formik.getFieldProps('previousPrice')}
			/>
			<Button variant="contained" color="primary" type="submit">
				Set the Price
			</Button>

		</form>

	)
}

export default SalesUpdateForm