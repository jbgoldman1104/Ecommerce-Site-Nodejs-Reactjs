const { CommentModel } = require("../db");

const getCommentsFromID = async (commentIDs) => {
  const comments = [];
  for (cid of commentIDs) {
    const comment = await CommentModel.findById(cid);
    if (comment) {
      comments.push(comment);
    }
  }
  return comments;
};

module.exports = { getCommentsFromID };
