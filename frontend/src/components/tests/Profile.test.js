import React from 'react'
import axios from 'axios'
import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router, useHistory } from 'react-router-dom'
import Profile from '../Profile'

jest.mock('axios');
describe("<Profile />", () => {

    const dummyUser = { "address": "", "taxID": "", "userType": 0, "cart": [], "rates": ["609aaa2d6214482f68dac1de", "609aaa566214482f68dac1df"], "orders": ["609a8b61f0f0204070f67147", "609a8bdf165c301a7861af8f", "609a8d2ec611d7012846f103", "609a8d846d6a903d18f1e541", "609a8dc8e127691bf4c41e6f", "60a144ac4ba6de4bdc49a02d", "60a8e543ac486f3b90803ebe", "60a8e6140584fb1f60cbf6c6", "60a8e65f7599f6451835cb27", "60a8e6b314712714a0d32c4f", "60a8e9b4dd38622bfc3020cb", "60a8ea649cbe8c2e905b2d40", "60a8ea9e05dc58123c6ef621", "60a8eaf02b5da323c00e86f7", "60a8eb061110b121547591e8", "60a8eb79edd4b03b04b35270", "60a8eba6822a0a2dbc12094f", "60a8ebbba54cb21628ac3681", "60a8ebe15c3954429886c6a2", "60a8ec22eab5af33c4e0067c", "60a8ed6e7208742e38981ca2", "60a8f1cd357c4f3f0869c6c7", "60aa867d0f5e293e647be520", "60af9bd2c5481905f09d28e2", "60afa2c4c5481905f09d28e4", "60afa58910b43608b8a6723c"], "_id": "6084626fb74b4b14f45cfcb9", "userEmail": "ocakhasan99@gmail.com", "username": "nikolasantesla", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwODQ2MjZmYjc0YjRiMTRmNDVjZmNiOSIsImlhdCI6MTYyMzE2NzIzNiwiZXhwIjoxNjU0NzAzMjM2fQ.R9LjPfM17EkX6VLHHDSzbeFFiscTseV9TE3sdAoS98Q" }


    test('renders the Profile page', () => {

        window.localStorage.setItem("logged", JSON.stringify(dummyUser))
        const component = render(
            <Router>
                <Profile />
            </Router>
        )
        expect(component.container).toHaveTextContent("Orders")
    })

    test('if there is no user, then it says you can login', () => {
        window.localStorage.removeItem("logged")
        const component = render(
            <Router>
                <Profile />
            </Router>
        )
        expect(component.container).toHaveTextContent("First you need to login to have a profile page. You can login from")
    })

    test('it renders 2 input components', () => {
        window.localStorage.setItem("logged", JSON.stringify(dummyUser))
        const { getByLabelText } = render(
            <Router>
                <Profile />
            </Router>
        )

        expect(getByLabelText("Start Date")).toBeInTheDocument();
        expect(getByLabelText("End Date")).toBeInTheDocument();
    })

    test('it renders orders, processing products can be canceled', async () => {
        window.localStorage.setItem("logged", JSON.stringify(dummyUser))
        const data = {
            data: {
                status: true,
                orders: [
                    {
                        date: "2021-06-06",
                        products: [
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
                        ],
                        refund: 0,
                        status: 0,
                    }
                ]
            },
        };
        axios.get.mockImplementationOnce(() => Promise.resolve(data));
        await act(async () => render(
            <Router>
                <Profile />
            </Router>
        ))

        expect(screen.getByText("A nice basketball")).toBeInTheDocument();
        expect(screen.getByText("Processing")).toBeInTheDocument();
        expect(screen.getByText("Cancel Order")).toBeInTheDocument();


    })

    test('it renders orders, in transit products can not canceled and refunded products is shown', async () => {
        window.localStorage.setItem("logged", JSON.stringify(dummyUser))
        const data = {
            data: {
                status: true,
                orders: [
                    {
                        date: "2021-06-06",
                        products: [
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
                        ],
                        refund: 0,
                        status: 0,
                    },
                    {
                        date: "2021-06-06",
                        products: [
                            {
                                categoryID: 2,
                                comments: (8)["60804e219e852143348d6585", "6080679d9e852143348d6587", "60806a439e852143348d6588", "60816e41601688475479582c", "60818f2224e73f410cda730c", "6081cfd66201481ac027826c", "608a937aa817fc3be0ae09e8", "608ab38d35a1a73c74dc553a"],
                                description: "Number 7 basketball. You can play nice games.",
                                imagePath: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png",
                                previousPrice: 150,
                                productName: "A class basketball2 ",
                                rate: 9,
                                rateCount: 9,
                                rateTotal: 3,

                            }
                        ],
                        refund: 2,
                        status: 1,
                    },
                    {
                        date: "2021-06-06",
                        products: [
                            {
                                categoryID: 2,
                                comments: (8)["60804e219e852143348d6585", "6080679d9e852143348d6587", "60806a439e852143348d6588", "60816e41601688475479582c", "60818f2224e73f410cda730c", "6081cfd66201481ac027826c", "608a937aa817fc3be0ae09e8", "608ab38d35a1a73c74dc553a"],
                                description: "Number 7 basketball. You can play nice games.",
                                imagePath: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png",
                                previousPrice: 150,
                                productName: "A asdsadas basketball2 ",
                                rate: 9,
                                rateCount: 9,
                                rateTotal: 3,

                            }
                        ],
                        refund: 3,
                        status: 2,
                    }
                ]
            },
        };
        axios.get.mockImplementationOnce(() => Promise.resolve(data));
        await act(async () => render(
            <Router>
                <Profile />
            </Router>
        ))

        expect(screen.getByText("A nice basketball")).toBeInTheDocument();
        expect(screen.getByText("Processing")).toBeInTheDocument();
        expect(screen.getByText("Cancel Order")).toBeInTheDocument();

        expect(screen.getByText("Refund Approved")).toBeInTheDocument();
        expect(screen.getByText("In Transit")).toBeInTheDocument();




    })

    test('it renders orders, delivered products with rejected refund is shown', async () => {
        window.localStorage.setItem("logged", JSON.stringify(dummyUser))
        const data = {
            data: {
                status: true,
                orders: [
                    {
                        date: "2021-06-06",
                        products: [
                            {
                                categoryID: 2,
                                comments: (8)["60804e219e852143348d6585", "6080679d9e852143348d6587", "60806a439e852143348d6588", "60816e41601688475479582c", "60818f2224e73f410cda730c", "6081cfd66201481ac027826c", "608a937aa817fc3be0ae09e8", "608ab38d35a1a73c74dc553a"],
                                description: "Number 7 basketball. You can play nice games.",
                                imagePath: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png",
                                previousPrice: 150,
                                productName: "Product Name",
                                rate: 9,
                                rateCount: 9,
                                rateTotal: 3,

                            }
                        ],
                        refund: 3,
                        status: 2,
                    }
                ]
            },
        };
        axios.get.mockImplementationOnce(() => Promise.resolve(data));
        await act(async () => render(
            <Router>
                <Profile />
            </Router>
        ))

        expect(screen.getByText("Product Name")).toBeInTheDocument();
        expect(screen.getByText("Delivered")).toBeInTheDocument();

        expect(screen.getByText("Refund Rejected")).toBeInTheDocument();
    })

    /* test('validate user inputs, and provides error messages', async () => {
        window.localStorage.setItem("logged", JSON.stringify(dummyUser))
        const { getByTestId, getByText } = render(
            <Router>
                <Profile />
            </Router>
        )

        const startDate = '2020-06-07'
        const endDate = '2020-06-10'
        const result = `You can check order between`

        await act(async () => {
            fireEvent.change(screen.getByLabelText("Start Date"), {
                target: { value: startDate },
            });


        })

        await act(async () => {
            fireEvent.change(screen.getByLabelText("End Date"), {
                target: { value: endDate },
            });
        })


        await act(async () => {
            fireEvent.submit(getByTestId('form'))
        });

        screen.debug()
        expect(getByText(result)).toBeInTheDocument();
    }) */
})