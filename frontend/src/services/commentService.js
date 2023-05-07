import axios from 'axios'

let token = null

const setToken = newToken => {
    token = newToken
}

const addComment = async commentObj => {
    const bodyToSend = {
        token,
        ...commentObj
    }
    const url = "/api/comment"
    const response = await axios.post(url, bodyToSend)
    return response.data
}


const getAllComments = async () => {
    const path = "/api/comments"
    const response = await axios.get(path)
    return response.data
}

const approveComment = async (comment) => {

    const path = `/api/comment/${comment._id}`
    const newComment = { ...comment, approval: !comment.approval }

    const response = await axios.put(path, newComment)
    return response.data
}

const commentService = { setToken, addComment, getAllComments, approveComment }

export default commentService
