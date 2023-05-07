import { Avatar, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
    backgroundColor: "#eee",
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    transform: "scale(1.5, 1.5)",
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  title: {
    color: "#484848",
    fontWeight: "bold",
  },
}));

const Comment = ({ comment }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3}  alignItems="center" justify="center">
      <Grid item>
        <Avatar alt="Remy Sharp" className={classes.orange}>
          {comment.owner.slice(0, 1)}
        </Avatar>
      </Grid>
      <Grid item xs zeroMinWidth style={{ margin: "2em 10em 2em 0" }}>
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <Typography variant="h5" style={{ marginBottom: "0.3em" }} component="h2" className={classes.title}>
              {comment.owner}
            </Typography>
            <Typography variant="body2" component="p">
              {comment.content}
            </Typography>
            <Typography style={{margin: "1em 0 0 0"}} color="textSecondary">
              {new Date(comment.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Comment;
