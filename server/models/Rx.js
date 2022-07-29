const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedRx` array in User.js
const rxSchema = new Schema({
  brandName: {
    type: String,
    required: true,
  },
  rxId: {
    type: String,
    required: true,
  },
  dosageForm: {
    type: String,
  },
  route: {
    type: String,
  },
  active: [
    {
      type: String,
    },
  ]
});

module.exports = rxSchema;
