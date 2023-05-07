import React from 'react'
import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SignupForm from '../SignupForm'
import { BrowserRouter as Router } from 'react-router-dom'

describe('<SignupForm />', () => {

    test('renders the signup page', () => {
        const component = render(
            <Router>
                <SignupForm />
            </Router>
        )
        expect(component.container).toHaveTextContent("Signup to Shop")
    })

    test('it renders four input components', () => {
        const { getByLabelText } = render(
            <Router>
                <SignupForm />
            </Router>
        )

        expect(getByLabelText("Username")).toBeInTheDocument();
        expect(getByLabelText("Email")).toBeInTheDocument();
        expect(getByLabelText("Password")).toBeInTheDocument();
        expect(getByLabelText("Password Again")).toBeInTheDocument();

    })

    test('validate user inputs, and provides error messages', async () => {
        const { getByTestId, getByText } = render(
            <Router>
                <SignupForm />
            </Router>
        )

        await act(async () => {

            fireEvent.change(screen.getByLabelText("Username"), {
                target: { value: '' },
            });

            fireEvent.change(screen.getByLabelText("Email"), {
                target: { value: '' },
            });

            fireEvent.change(screen.getByLabelText("Password"), {
                target: { value: '' },
            });

            fireEvent.change(screen.getByLabelText("Password Again"), {
                target: { value: '' },
            })
        });

        await act(async () => {
            fireEvent.submit(getByTestId('form'))
        });

        expect(getByText("Name is required")).toBeInTheDocument();
        expect(getByText("Email is required")).toBeInTheDocument();
        expect(getByText("Password is required")).toBeInTheDocument();
    })

    /* test('when passwords do not match, it provides an error message', async () => {
        const { getByTestId, getByText } = render(
            <Router>
                <SignupForm />
            </Router>
        )

        await act(async () => {

            let username = screen.getByLabelText("Username")
            let email = screen.getByLabelText("Email")
            let password = screen.getByLabelText("Password")
            let passwordAgain = screen.getByLabelText("Password Again")

            fireEvent.change(username, {
                target: { value: 'ocakhasan' },
            });

            fireEvent.change(email, {
                target: { value: 'ocakhasan@gmail.com' },
            });

            fireEvent.change(password, {
                target: { value: '123' },
            });

            fireEvent.change(passwordAgain, {
                target: { value: 'abc' },
            })
        });

        await act(async () => {
            fireEvent.submit(getByTestId('form'))
        });

        expect(getByText("Passwords must match")).toBeInTheDocument();

    }) */


})
