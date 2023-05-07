const express = require("express");
const { Product, CommentModel } = require("../db/");
const { getErrors, getCommentsFromID } = require("../helpers");
const auth = require("./middlewares/auth");
const commentsRouter = express.Router();

// GET all comments
commentsRouter.get("/api/comments", async (req, res) => {
  try {
    const comments = await CommentModel.find({});
    return res.send({ status: true, comments });
  } catch (error) {
    const validationErr = getErrors(error);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// GET all comments of a product
commentsRouter.get("/api/comment/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      throw new Error(`cannot find product ${pid}`);
    }

    const commentIDs = product.comments;
    const comments = await getCommentsFromID(commentIDs);
    return res.send({ status: true, comments });
  } catch (error) {
    const validationErr = getErrors(error);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// POST to create new comment
commentsRouter.post("/api/comment", auth, async (req, res) => {
  try {
    const user = req.user;
    const { productID, content } = req.body;

    // Create new comment and save it
    const comment = new CommentModel({
      content,
      owner: user.username,
      product: productID,
    });

    // Check the existence of the product
    const product = await Product.findById(productID);
    if (!product) {
      throw new Error("No product found with " + productID);
    }

    // Add comment into the product's comments array and save it
    product.comments.push(comment);
    await comment.save();
    await product.save();
    const commentIDs = product.comments;
    const comments = await getCommentsFromID(commentIDs);
    return res.send({ status: true, comments });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log("ERROR", validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Update comment specified with 'id'.
// It can be used to approve/disapprove.
commentsRouter.put("/api/comment/:id", async (req, res) => {
  try {
    const { content, owner, approval } = req.body;
    const { id } = req.params;
    if (!id) {
      throw new Error(`invalid id ${id}`);
    }

    let prevComment = await CommentModel.findById(id);
    if (!prevComment) {
      throw new Error(`cannot find comment ${id}`);
    }
    prevComment = prevComment.toObject();

    const newComment = { content, owner, approval };
    for (let i in newComment) {
      if (newComment[i] != undefined) {
        prevComment[i] = newComment[i];
      }
    }
    const updated = await CommentModel.findByIdAndUpdate(id, prevComment, {
      new: true,
    });

    return res.status(201).send({ status: true, comment: updated });
  } catch (error) {
    const validationErr = getErrors(error);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// DELETE comment specified with 'id' via params
// Takes 'token' and 'productID' from request body
commentsRouter.delete("/api/comment/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    // if (user.userType != 2) {
    //   throw new Error(`Invalid user type ${user.userType}`);
    // }

    const commentModel = await CommentModel.findById(id);
    const productID = commentModel.product;

    let product = await Product.findById(productID);
    if (!product) {
      throw new Error(`cannot find product ${productID}`);
    }
    product = product.toObject();
    let comments = product.comments;
    const updatedComments = comments.filter((comment) => {
      return comment._id != id;
    });
    // Check if order is deleted successfully.
    if (comments.length == updatedComments) {
      throw new Error(`cannot find comment with ${id}`);
    }
    product.comments = updatedComments;
    const updated = await Product.findByIdAndUpdate(productID, product, {
      new: true,
    });
    await CommentModel.findByIdAndDelete(id);

    res.send({ status: true, comments: updated.comments });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log("ERROR", validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { commentsRouter };
