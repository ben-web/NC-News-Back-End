const mongoose = require('mongoose');
const { Schema } = mongoose;
const { randomImageUrl } = require('../utils/randomImage');

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: () => randomImageUrl(600, 400)
  },
  votes: {
    type: Number,
    default: () => Math.floor(Math.random() * 64)
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  belongs_to: {
    type: String,
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
});

module.exports = mongoose.model('articles', ArticleSchema);
