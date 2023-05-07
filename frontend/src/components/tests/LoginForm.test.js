import React from 'react'
import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import LoginForm from '../LoginForm'
import { BrowserRouter as Router } from 'react-router-dom'
import axios from 'axios'

describe('<LoginForm />', () => {

    test('renders the login page', () => {
        const handleLogin = jest.fn()
        const component = render(
            <Router>
                <LoginForm handleLogin={handleLogin} />
            </Router>
        )

        expect(component.container).toHaveTextContent("Login to Shop")
    })

    test('it renders two input components', () => {
        const handleLogin = jest.fn()
        const { getByLabelText } = render(
            <Router>
                <LoginForm handleLogin={handleLogin} />
            </Router>
        )

        expect(getByLabelText("Email")).toBeInTheDocument();
        expect(getByLabelText("Password")).toBeInTheDocument();
    })

    test('it renders a submit button', () => {
        const handleLogin = jest.fn()
        const { getByText } = render(
            <Router>
                <LoginForm handleLogin={handleLogin} />
            </Router>
        )

        expect(getByText("Login")).toBeInTheDocument();
    })

    test('validate user inputs, and provides error messages', async () => {
        const handleLogin = jest.fn()
        const { getByTestId, getByText } = render(
            <Router>
                <LoginForm handleLogin={handleLogin} />
            </Router>
        )

        await act(async () => {
            fireEvent.change(screen.getByLabelText("Email"), {
                target: { value: '' },
            });

            fireEvent.change(screen.getByLabelText("Password"), {
                target: { value: '' },
            })
        });

        await act(async () => {
            fireEvent.submit(getByTestId('form'))
        });

        expect(getByText("Email is required")).toBeInTheDocument();
        expect(getByText("Password is required")).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(screen.getByLabelText("Email"), {
                target: { value: 'ocakhasan' },
            });

            fireEvent.change(screen.getByLabelText("Password"), {
                target: { value: 'deneme' },
            })
        });

        await act(async () => {
            fireEvent.submit(getByTestId('form'))
        });

        expect(getByText("Invalid email address")).toBeInTheDocument();
    })

    /* test('should submit when form inputs are valid', () => {
        const handleLogin = jest.fn()
        const { getByTestId, queryByText } = render(
            <Router>
                <LoginForm handleLogin={handleLogin} />
            </Router>
        )

        await act(async () => {
            fireEvent.change(screen.getByLabelText("Email"), {
                target: { value: 'ocakhasan@gmail.com' },
            });

            fireEvent.change(screen.getByLabelText("Password"), {
                target: { value: 'deneme' },
            })
        });

        await act(async () => {
            fireEvent.submit(getByTestId('form'))
        });

        expect(queryByText("Email is required")).not.toBeInTheDocument();
        expect(queryByText("Password is required")).not.toBeInTheDocument();
    })
 */

    /* test('allows user to login successfully', async () => {
        jest.mock("axios");

        const UserResponse = {
            status: true,
            user: {
                username: 'ocakhasan',
                userEmail: 'ocakhasan@gmail.com',
                token: 'token'
            }
        }

        const { getByTestId } = render(
            <Router>
                <LoginForm handleLogin={handleLogin} />
            </Router>
        )
        axios.post.mockImplementation(() => Promise.resolve(UserResponse));

        await act(async () => {
            fireEvent.change(screen.getByLabelText("Email"), {
                target: { value: 'ocakhasan@gmail.com' },
            });

            fireEvent.change(screen.getByLabelText("Password"), {
                target: { value: 'deneme' },
            })
        });

        await act(async () => {
            fireEvent.submit(getByTestId('form'))
        });

        expect(window.localStorage.getItem('logged')).toEqual(UserResponse)






    }) */
})

