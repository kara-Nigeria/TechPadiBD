const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String },
    password: {type : String}
});


const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
