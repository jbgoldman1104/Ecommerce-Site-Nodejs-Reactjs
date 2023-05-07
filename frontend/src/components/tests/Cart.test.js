import React from 'react'
import axios from 'axios'
import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router, useHistory } from 'react-router-dom'
import Cart from '../Cart'

jest.mock('axios');
describe("<Cart />", () => {

    test('renders the Cart page', () => {
        const component = render(
            <Router>
                <Cart />
            </Router>
        )
        expect(component.container).toHaveTextContent("There is no product")
    })

    test('even though  user not logged in, it shows the products', async () => {
        var products = ["kajsfgjhasfa"]
        window.localStorage.removeItem("logged") //delete the current user
        window.localStorage.setItem("cart_without_login", JSON.stringify(products))

        const data = {
            data: {
                status: true,
                cart: [
                    {
                        categoryID: 2,
                        comments: (8)["60804e219e852143348d6585", "6080679d9e852143348d6587", "60806a439e852143348d6588", "60816e41601688475479582c", "60818f2224e73f410cda730c", "6081cfd66201481ac027826c", "608a937aa817fc3be0ae09e8", "608ab38d35a1a73c74dc553a"],
                        description: "Number 7 basketball. You can play nice games.",
                        imagePath: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png",
                        previousPrice: 150,
                        productName: "A nice basketball",
                        rate: 9,
                        rateCount: 9,
                        rateTotal: 3,
                    }
                ]
            },
        };
        axios.post.mockImplementationOnce(() => Promise.resolve(data));
        await act(async () => render(
            <Router>
                <Cart />
            </Router>
        ))
        expect(screen.getByText("A nice basketball")).toBeInTheDocument();
        expect(screen.getByText("Number 7 basketball. You can play nice games.")).toBeInTheDocument();
        expect(screen.getByText("Remove")).toBeInTheDocument();
        //expect(screen.getByText("Remove")).toBeInTheDocument();
    })


    test('if user logged in, it shows the cart', async () => {
        const user = {
            "username": "ocakhasan",
            "userEmail": "ocakhasan@gmail.com",
            "userType": 0
        }
        window.localStorage.setItem("logged", JSON.stringify(user)) //delete the current user
        window.localStorage.removeItem("cart_without_login")

        const data = {
            data: {
                status: true,
                cart: [
                    {
                        categoryID: 2,
                        comments: (8)["60804e219e852143348d6585", "6080679d9e852143348d6587", "60806a439e852143348d6588", "60816e41601688475479582c", "60818f2224e73f410cda730c", "6081cfd66201481ac027826c", "608a937aa817fc3be0ae09e8", "608ab38d35a1a73c74dc553a"],
                        description: "Number 7 basketball. You can play nice games.",
                        imagePath: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png",
                        previousPrice: 150,
                        productName: "A nice basketball",
                        rate: 9,
                        rateCount: 9,
                        rateTotal: 3,
                    }
                ]
            },
        };
        axios.post.mockImplementationOnce(() => Promise.resolve(data));
        await act(async () => render(
            <Router>
                <Cart />
            </Router>
        ))
        expect(screen.getByText("A nice basketball")).toBeInTheDocument();
        expect(screen.getByText("Number 7 basketball. You can play nice games.")).toBeInTheDocument();
        expect(screen.getByText("Remove")).toBeInTheDocument();
        //expect(screen.getByText("Remove")).toBeInTheDocument();
    })

    test('if user logged in, checkout process redirects to order', async () => {

        const user = {
            "username": "ocakhasan",
            "userEmail": "ocakhasan@gmail.com",
            "userType": 0
        }
        window.localStorage.setItem("logged", JSON.stringify(user)) //insert user to localstorage
        window.localStorage.removeItem("cart_without_login")
        const mockHandler = jest.fn()


        const data = {
            data: {
                status: true,
                cart: [
                    {
                        categoryID: 2,
                        comments: (8)["60804e219e852143348d6585", "6080679d9e852143348d6587", "60806a439e852143348d6588", "60816e41601688475479582c", "60818f2224e73f410cda730c", "6081cfd66201481ac027826c", "608a937aa817fc3be0ae09e8", "608ab38d35a1a73c74dc553a"],
                        description: "Number 7 basketball. You can play nice games.",
                        imagePath: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png",
                        previousPrice: 150,
                        productName: "A nice basketball",
                        rate: 9,
                        rateCount: 9,
                        rateTotal: 3,
                    }
                ]
            },
        };
        axios.post.mockImplementationOnce(() => Promise.resolve(data));
        await act(async () => render(
            <Router>
                <Cart />
            </Router>
        ))

        const button = screen.getByText("Checkout")
        fireEvent.click(button)
        expect(window.location.pathname).toBe("/order")
        /* expect(screen.getByText("A nice basketball")).toBeInTheDocument();
        expect(screen.getByText("Number 7 basketball. You can play nice games.")).toBeInTheDocument();
        expect(screen.getByText("Remove")).toBeInTheDocument();
        //expect(screen.getByText("Remove")).toBeInTheDocument(); */
    })
})

