const mongoose = require("mongoose");
// Validates request body
// Returns false if any field of req.body is empty
const validateReqBody = (...req) => {
  for (r of req) {
    if (typeof r === "number" && r < 0) {
      return false;
    } else {
      if (r === undefined) {
        return false;
      }
      if (typeof r === "string" && (!r || r.trim().length == 0)) {
        return false;
      }
    }
  }
  return true;
};

// Checks errors returning from DB
// If mongoose.Error.ValidationError exists, it returns all validation errors.
// Otherwise, returns message of the error.
const getErrors = (error) => {
  if (error instanceof mongoose.Error.ValidationError) {
    let validationErr = "";
    for (field in error.errors) {
      validationErr += `${field} `;
    }
    return validationErr.substring(0, validationErr.length - 1);
  }
  return error.message;
};

module.exports = { validateReqBody, getErrors };
