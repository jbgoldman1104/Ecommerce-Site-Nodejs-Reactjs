import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { Link } from "react-router-dom";
import "./styles/home.css";
import "./styles/Products.css";

const Home = ({ data }) => {
  const len = data ? (data.length % 3) + 1 : 0;
  return (
    <>
      <div className="home">
        <div className="home-header">
          <Typography variant="h3" component="h3">
            Shop from the Best
          </Typography>
          <Typography variant="h5" component="h3">
            Explore hundreds of products within seconds with perfect user
            experience
          </Typography>

          {len > 0 && (
            <Carousel
              timeout={250}
              navButtonsAlwaysInvisible
              animation="slide"
              className="product_container"
            >
              {data?.slice(0, 3).map((product, i) => (
                <Link
                  to={"/product/" + product._id}
                  style={{ textDecoration: "none" }}
                  key={product._id}
                >
                  <Card style={{ margin: "0 15 0 15", padding:0 }}>
                    <CardActionArea>
                      <CardMedia
                        style={{ objectFit: "contain" }}
                        component="img"
                        height="200"
                        src={product.imagePath}
                        image={product.imagePath}
                        title={product.productName}
                      />
                    </CardActionArea>
                    <CardContent>
                      <Typography
                        style={{ textAlign: "center", marginTop: 14 }}
                        gutterBottom
                        variant="h5"
                        component="h2"
                      >
                        {product.productName}
                      </Typography>
                    </CardContent>

                    <Grid
                      container
                      style={{marginTop: 0, marginBottom: 5}}
                      direction="column"
                      justify="center"
                      alignItems="center"
                    >
                      {product.previousPrice > 0 ? (
                        <>
                          <Typography
                            variant="h6"
                            style={{ textDecoration: "line-through" }}
                          >
                            {product.previousPrice}$
                          </Typography>
                          <Typography variant="h6">
                            {product.unitPrice}$
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="h6">
                          {product.unitPrice}$
                        </Typography>
                      )}
                    </Grid>
                  </Card>
                </Link>
              ))}
            </Carousel>
          )}
        </div>
        <img
          src={process.env.PUBLIC_URL + "/basketball.jpg"}
          alt="product"
          className="home-img"
        ></img>
      </div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Divider style={{ width: "50%", margin: 10, marginTop: 20 }} />
      </Grid>
    </>
  );
};

export default Home;
