import { CircularProgress, Grid, Typography } from "@material-ui/core";
import React from 'react'

const Spinner = () => {
  return (
    <Grid
    style={{ height: "100%", marginTop: 20 }}
    container
    direction="column"
    justify="center"
    alignItems="center"
  >
    <Typography variant="h4">Products Loading</Typography>
    <CircularProgress style={{ marginTop: 20, marginBottom: 20, color: "#fab674" }} />
  </Grid>
  )
}

export default Spinner;