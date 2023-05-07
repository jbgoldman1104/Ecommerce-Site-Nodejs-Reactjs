import React from 'react'
import { useFormik } from 'formik'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import AddBoxIcon from '@material-ui/icons/AddBox';
import productService from '../services/productService';
import { useHistory } from 'react-router-dom';

const ProductForm = () => {

	const history = useHistory()

	const formik = useFormik({
		initialValues: {
			productName: '',
			description: '',
			imagePath: '',
			unitPrice: 0,
			categoryID: 0,
			stock: 0,
			warranty: 0,
			rate: 0
		},

		onSubmit: async values => {
			try {
				const response = await productService.addProduct({ userType: 2, ...values })
				if (response.status) {
					history.push("/dashboard")
				}
			} catch (exception) {
			}

		},
		validateOnChange: false,
		validateOnBlur: false
	})

	return (
		<form onSubmit={formik.handleSubmit} className="detail_form">

			<h2>Add New Product</h2>

			<TextField variant="outlined" id="standard-error" label="Product Name"
				{...formik.getFieldProps('productName')} />

			<TextField variant="outlined" id="standard-error" label="Product Description"

				{...formik.getFieldProps('description')} />

			<TextField variant="outlined" id="standard-error" label="Image path"

				{...formik.getFieldProps('imagePath')} />


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
				label="Category"
				type="number"
				InputLabelProps={{
					shrink: true,
				}}
				{...formik.getFieldProps('category')}
			/>

			<TextField
				variant="outlined"
				id="standard-number"
				label="Stock"
				type="number"
				InputLabelProps={{
					shrink: true,
				}}
				{...formik.getFieldProps('stock')}
			/>

			<TextField
				variant="outlined"
				id="standard-number"
				label="Warranty"
				type="number"
				InputLabelProps={{
					shrink: true,
				}}
				{...formik.getFieldProps('warranty')}
			/>


			<Button type="submit" variant="contained" color="primary">
				<AddBoxIcon />Add Product
			</Button>

		</form>
	)
}

export default ProductForm