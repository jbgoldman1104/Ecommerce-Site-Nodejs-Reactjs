import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: "auto",
        maxWidth: 500,
    },
    image: {
        width: 128,
        height: 128,
    },
    img: {
        margin: "auto",
        display: "block",
        maxWidth: "100%",
        maxHeight: "100%",
    },
}));

export default function CartProdut({ product, handleDelete, showButton }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                    <Grid item>
                        <ButtonBase className={classes.image}>
                            <img
                                className={classes.img}
                                alt="complex"
                                src={
                                    product.imagePath ||
                                    process.env.PUBLIC_URL + "/glass.jpg"
                                }
                            />
                        </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1">
                                    {product.productName}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {product.description}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    ID:{" "}
                                    <Link to={"/product/" + product._id}>
                                        {product._id}
                                    </Link>
                                </Typography>
                            </Grid>
                            {showButton ? (
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        onClick={() =>
                                            handleDelete(product._id)
                                        }
                                    >
                                        Remove
                                    </Button>
                                </Grid>
                            ) : null}
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1">
                                $
                                {product.previousPrice
                                    ? product.previousPrice
                                    : product.unitPrice}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
