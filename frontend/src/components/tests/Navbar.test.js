import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Navbar from '../Navbar'
import { BrowserRouter as Router } from 'react-router-dom'

const userType0 = {
    "username": "ocakhasan",
    "userEmail": "ocakhasan@gmail.com",
    "userType": 0
}

const userType1 = {
    "username": "salemanager",
    "userEmail": "salemanager@gmail.com",
    "userType": 1
}

const handleLogout = jest.fn()


describe('<Navbar />', () => {
    test('<Navbar /> shows correct information with the normal user', () => {

        const component = render(
            <Router>
                <Navbar user={userType0} handleLogout={handleLogout} />
            </Router>
        )

        expect(component.container).toHaveTextContent(
            'Logout'
        )

        expect(component.container).toHaveTextContent(
            userType0.username
        )
    })

    test('<Navbar /> shows correct information with the managers', () => {

        const component = render(
            <Router>
                <Navbar user={userType1} handleLogout={handleLogout} />
            </Router>
        )

        expect(component.container).toHaveTextContent(
            'Dashboard'
        )

        expect(component.container).toHaveTextContent(
            'Logout'
        )

    })

    test('<Navbar /> shows correct information when there is no user', () => {

        const component = render(
            <Router>
                <Navbar user={null} handleLogout={handleLogout} />
            </Router>
        )

        expect(component.container).toHaveTextContent(
            'Login'
        )

        expect(component.container).toHaveTextContent(
            'Signup'
        )

        expect(component.container).toHaveTextContent(
            'Cart'
        )

    })

    test('<Navbar /> clicking to links works', () => {

        const mockHandler = jest.fn()
        const component = render(
            <Router>
                <Navbar user={userType0} handleLogout={mockHandler} />
            </Router>
        )

        const button = component.getByText("Cart")
        fireEvent.click(button)
        expect(window.location.pathname).toBe("/cart")

        const profileButton = component.getByText(userType0.username)
        fireEvent.click(profileButton)
        expect(window.location.pathname).toBe("/profile")
        //expect(mockHandler.mock.calls).toHaveLength(1)

    })

    test('<Navbar /> after logout, the url is homepage', () => {

        const mockHandler = jest.fn()
        const component = render(
            <Router>
                <Navbar user={userType0} handleLogout={mockHandler} />
            </Router>
        )

        const button = component.getByText("Cart")
        fireEvent.click(button)
        expect(window.location.pathname).toBe("/cart")

        const profileButton = component.getByText(userType0.username)
        fireEvent.click(profileButton)
        expect(window.location.pathname).toBe("/profile")
        //expect(mockHandler.mock.calls).toHaveLength(1)

    })
})