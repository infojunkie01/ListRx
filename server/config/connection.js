const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0/listrx', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection; 
