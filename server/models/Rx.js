const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedRx` array in User.js
const rxSchema = new Schema({
  genericName: [
    {
      type: String,
      required: true,
    },
  ],
  brandName: {
    type: String,
    required: true,
  },
  // saved number from openFda
  rxId: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
  },
});

module.exports = rxSchema;
