import { Grid, Link as Link2, TextField, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import SportsBasketballIcon from "@material-ui/icons/SportsBasketball";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import handleChange from "../services/searchHelper";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import "./styles/Navbar.css";

const Navbar = ({ user, handleLogout, data, setSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState(undefined);

    const history = useHistory();
    const dashboard =
        user?.userType !== 0 ? (
            <Link to="/dashboard">
                <Button>
                    <DashboardIcon />
                    Dashboard
                </Button>
            </Link>
        ) : null;

    const navbarLogout = () => {
        handleLogout();
        history.push("/login");
    };

    return (
        <ul className="nav__ul">
            <Link to="" style={{ textDecoration: "none" }}>
                <Button style={{ borderRadius: 5 }}>
                    <SportsBasketballIcon />
                    <Typography>BasketStore</Typography>
                </Button>
            </Link>

            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                style={{ maxWidth: 280, marginLeft: 0 }}
            >
                <TextField
                    fullWidth
                    size="small"
                    id="outlined-helperText"
                    placeholder="Search Products"
                    variant="outlined"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <Button
                                style={{ margin: 0, padding: 0 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleChange(searchTerm, data, setSearchResults);
                                }}
                            >
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            </Button>
                        ),
                    }}
                />
            </Grid>

            <Grid item direction="row" justify="space-evenly" alignItems="center">
                <Typography style={{ margin: 3 }}>
                    <Link2 href="/products/all" color="inherit">
                        All Products
                    </Link2>
                </Typography>
            </Grid>
            <Grid item direction="row" justify="space-evenly" alignItems="center">
                <Typography style={{ margin: 3 }}>
                    <Link2 href="/products/0" color="inherit">
                        Jerseys
                    </Link2>
                </Typography>
            </Grid>
            <Grid item direction="row" justify="space-evenly" alignItems="center">
                <Typography style={{ margin: 3 }}>
                    <Link2 href="/products/1" color="inherit">
                        Shoes
                    </Link2>
                </Typography>
            </Grid>
            <Grid item direction="row" justify="space-evenly" alignItems="center">
                <Typography style={{ margin: 3 }}>
                    <Link2 href="/products/2" color="inherit">
                        Accessories
                    </Link2>
                </Typography>
            </Grid>
            <Grid item direction="row" justify="space-evenly" alignItems="center">
                <Typography style={{ margin: 3 }}>
                    <Link2 href="/products/3" color="inherit">
                        Games
                    </Link2>
                </Typography>
            </Grid>

            <div className="right-links">
                {!user || user.userType === 0 ? (
                    <Link to="/cart" style={{ textDecoration: "none" }}>
                        <Button>
                            <ShoppingCartIcon />
                            Cart
                        </Button>
                    </Link>
                ) : null}

                {user && (
                    <div className="nav__links">
                        {dashboard}
                        <Link to="/profile" style={{ textDecoration: "none" }}>
                            <Button>
                                <PersonOutlineIcon /> {user.username}
                            </Button>
                        </Link>
                        <Button type="submit" onClick={navbarLogout}>
                            <ExitToAppIcon />Logout
                        </Button>
                    </div>
                )}

                {!user && (
                    <div className="nav__links">
                        <Link to="/signup" style={{ textDecoration: "none" }}>
                            <Button>Signup</Button>
                        </Link>
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <Button>Login</Button>
                        </Link>
                    </div>
                )}
            </div>
        </ul>
    );
};

export default Navbar;
