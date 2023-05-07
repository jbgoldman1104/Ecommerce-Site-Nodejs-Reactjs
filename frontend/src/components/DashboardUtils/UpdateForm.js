import React from 'react'
import { useHistory } from 'react-router-dom'
import { useFormik } from 'formik'
import Button from '@material-ui/core/Button'
import productService from '../../services/productService'
import TextField from '@material-ui/core/TextField'
import SaveIcon from '@material-ui/icons/Save';


const ProductUpdateForm = ({ data }) => {

	const history = useHistory()
	const formik = useFormik({
		initialValues: {
			productName: data?.productName,
			description: data?.description,
			unitPrice: data?.unitPrice,
			categoryID: data?.categoryID,
			stock: data?.stock,
			warranty: data?.warranty,
			rate: data?.rateCount,
			imagePath: data?.imagePath
		},
		onSubmit: values => {
			productService
				.updateProduct(data, values)
				.then((response) => {
					history.push('/dashboard')
				})

		},
		validateOnChange: false,
		validateOnBlur: false
	})

	return (



		<form onSubmit={formik.handleSubmit} className="detail_form">
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
				{...formik.getFieldProps('categoryID')}
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
				<SaveIcon />
				Save
			</Button>

		</form>

	)

}

export default ProductUpdateForm