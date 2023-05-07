import React from 'react'
import axios from 'axios'
import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router, useHistory } from 'react-router-dom'
import Dashboard from '../Dashboard'

jest.mock('axios');
describe("<ProductDetail />", () => {


    test('If there is no user currently then we are redirected to login', () => {
        const component = render(
            <Router>
                <Dashboard />
            </Router>
        )
        expect(window.location.pathname).toBe('/login')
    })

    test('If the current user is a normal customer, then we are not allowed', () => {
        const normalUser = {
            username: 'user',
            userEmail: 'user@gmail.com',
            userType: 0,
            token: 'token'
        }
        window.localStorage.setItem('logged', JSON.stringify(normalUser))
        const { getByText } = render(
            <Router>
                <Dashboard />
            </Router>
        )

        expect(getByText("You are not allowed for the admin panel")).toBeInTheDocument()

    })

    test('If the current user is a sale manager, we are allowed', async () => {
        const user = {
            username: 'productmanager',
            userEmail: 'productmanager@gmail.com',
            userType: 1,
            token: 'token'
        }

        const data = {
            data: {
                status: true,
                products: [
                    {
                        productName: "productname1",
                        unitPrice: 100,
                        stock: 20,
                        warranty: 10,
                        comments: [],
                        rateCount: 0,
                        rateTotal: 0,
                        rate: 0
                    },
                    {
                        productName: "productname2",
                        unitPrice: 200,
                        stock: 40,
                        warranty: 20,
                        comments: [],
                        rateCount: 0,
                        rateTotal: 0,
                        rate: 0
                    }

                ]
            },
        };
        window.localStorage.setItem('logged', JSON.stringify(user))
        axios.get.mockImplementationOnce(() => Promise.resolve(data));
        await act(async () => render(
            <Router>
                <Dashboard />
            </Router>))

        expect(screen.getByText("productname1")).toBeInTheDocument();
        expect(screen.getByText("productname2")).toBeInTheDocument();
    })

    test('If the current user is a product  manager, we can see the comments tab', async () => {
        const user = {
            username: 'productmanager',
            userEmail: 'productmanager@gmail.com',
            userType: 2,
            token: 'token'
        }
        const data = {
            data: {
                status: true,
                products: [
                    {
                        productName: "productname1",
                        unitPrice: 100,
                        stock: 20,
                        warranty: 10,
                        comments: [],
                        rateCount: 0,
                        rateTotal: 0,
                        rate: 0
                    },
                    {
                        productName: "productname2",
                        unitPrice: 200,
                        stock: 40,
                        warranty: 20,
                        comments: [],
                        rateCount: 0,
                        rateTotal: 0,
                        rate: 0
                    }

                ]
            },
        };
        window.localStorage.setItem('logged', JSON.stringify(user))
        axios.get.mockImplementationOnce(() => Promise.resolve(data));
        await act(async () => render(
            <Router>
                <Dashboard />
            </Router>))

        expect(screen.getByText("Comments")).toBeInTheDocument();

    })

    /* test('If the current user is a product  manager, we can see the comments', async () => {
        const user = {
            username: 'productmanager',
            userEmail: 'productmanager@gmail.com',
            userType: 2,
            token: 'token'
        }
        const data = {
            data: {
                status: true,
                comments: [
                    {
                        content: "comment 1",
                        owner: 'ocakhasan',
                        _id: 'assakjfsajfgsafa',
                        createdAt: new Date(),
                        approval: true,
                        product: 'asdalskfgajsfsa'

                    },
                    {
                        content: "comment 1",
                        owner: 'ocakhasan',
                        _id: 'assakjfsajfgsafa',
                        createdAt: new Date(),
                        approval: true,
                        product: 'asdalskfgajsfsa'

                    }

                ]
            },
        };
        window.localStorage.setItem('logged', JSON.stringify(user))
        axios.get.mockImplementationOnce(() => Promise.resolve(data));

        const component = render(
            <Router>
                <Dashboard />
            </Router>
        )
        await act(async () => component)

        const comment_tab = component.getByText('Comments')
        await act(async() => fireEvent.click(comment_tab))

        expect(screen.getByText("Approve")).toBeInTheDocument();

    }) */
})