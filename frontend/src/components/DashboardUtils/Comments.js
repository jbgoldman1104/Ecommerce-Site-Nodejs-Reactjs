import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';


const Comments = ({commentData}) => {
    if (commentData) {
        return (
            <TableContainer style={{ maxWidth: 900, margin: "auto" }} component={Paper}>

                <h1>Comments</h1>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Comment</TableCell>
                            <TableCell align="right">Owner</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">Approve</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {commentData.map(comment => (
                            <TableRow key={comment._id}>
                                <TableCell component="th" scope="row">
                                    {comment.content}
                                </TableCell>
                                <TableCell align="right">{comment.owner}</TableCell>
                                <TableCell align="right">{new Date(comment.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" color="primary"
                                        onClick={() => approveComment(comment)}>{comment.approval ? 
                                                                                <div className="approveIcon"><ThumbDownIcon /> Disapprove</div> : 
                                                                                <div className="approveIcon"><ThumbUpIcon />Approve</div>}
                                    </Button>
                                </TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    } return <p>Loading</p>
}