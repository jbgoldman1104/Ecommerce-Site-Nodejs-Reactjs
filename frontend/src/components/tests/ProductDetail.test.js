import React from 'react'
import axios from 'axios'
import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router, useHistory } from 'react-router-dom'
import ProductDetail from '../ProductDetail'

const renderWithRouter = (ui, { route = '/' } = {}) => {
    //window.history.pushState({}, 'Test page', route)

    return render(ui, { wrapper: Router })
}
jest.mock('axios');

describe("<ProductDetail />", () => {
    test('<ProductDetail /> if there is no product in the given url', () => {
        const route = "/product/hasan"


        const component = renderWithRouter(<ProductDetail />, { route })

        expect(component.container).toHaveTextContent("Product is Loading")

    })

    test('<ProductDetail /> if there is a product, then it prints the information', async () => {
        const data = {
            data: {
                status: true,
                product: {
                    productName: "productname1",
                    unitPrice: 100,
                    stock: 20,
                    warranty: 10,
                    comments: [],
                    rateCount: 0,
                    rateTotal: 0
                }
            },
        };
        const route = "/product/newid"
        window.history.pushState({}, 'Test page', route)

        axios.get.mockImplementationOnce(() => Promise.resolve(data));

        await act(async () => renderWithRouter(<ProductDetail />))
        expect(screen.getByText("productname1")).toBeInTheDocument();
        expect(screen.getByText("There is no comment. Be the first one!")).toBeInTheDocument();

    })

    test('<ProductDetail /> if there is a problem loading the product, then it gives the error', async () => {
        const data = {
            data: {
                status: false,
                product: {
                    productName: "productname1",
                    unitPrice: 100,
                    stock: 20,
                    warranty: 10,
                    comments: [],
                    rateCount: 0,
                    rateTotal: 0
                }
            },
        };
        const route = "/product/newid"
        window.history.pushState({}, 'Test page', route)

        axios.get.mockImplementationOnce(() => Promise.resolve(data));

        await act(async () => renderWithRouter(<ProductDetail />))
        expect(screen.getByText("There is no product like this! Or we have a problem.")).toBeInTheDocument();

    })
})