# E-Commerce Basketball Store Frontend

This is the frontend part of the Sabanci University's 2020-2021 Spring Term CS 308 Project. You can reach the backend part of this code from [buraksekili/ecommerce-backend](https://github.com/buraksekili/ecommerce-backend). 

You can see the screenshots of the application from [screenshots](#screenshots) part. 

## What does this project include?
- User creation and authentication
- Sort products by comment count, price and rate. 
- Search and add the products to cart. 
- Comment and rate products
- Register products to be notified when there is a sale
- Email notification service
- Create orders
- Refund mechanism
- User Profile Page
- Add, delete, change products from admin panel
- Manage orders and comments from admin panel

In short terms, this project covers the basics of a e-commerce website. Since me and my co-workers love basketball, we wanted to make this website a basketball-shop. 


## How to run the project
1. First you need to clone the project with and go to directory
	```
	> git clone https://github.com/ocakhasan/e-commerce-frontend.git
	> cd e-commerce-frontend
	```
2. Then you need to go to [backend](https://github.com/buraksekili/ecommerce-backend) part and complete the steps explained in the [readme](https://github.com/buraksekili/ecommerce-backend/blob/master/README.md).
3. Then you need to install the dependencies with
	```
	> yarn install or npm install
	```
4. Then you need to start the server with 
	```
	> yarn start or npm start
	```

Then it will run the project at `localhost:3000` if `3000` is occupied, it will run in `localhost:3001`. If there is any errors when frontend tries to connect to backend (proxy errors), change the proxy to point to backend in `package.json`.


## Screenshots

![](screenshots/mainpage.png)
![](screenshots/products.png)
![](screenshots/product_detail.png)
![](screenshots/comments.png)
![](screenshots/card.png)
![](screenshots/order.png)
![](screenshots/profile.png)
![](screenshots/admin_product.png)
![](screenshots/admin_comments.png)
![](screenshots/admin_order.png)


