// models/Book.js - File for Book schema model

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
    isbn: { // Good to have since each book has a unique ISBN code
        type: String,
        unique: true,
        required: true,
        sparse: true, // Allows null/undefined values for unique index
        trim: true,
    },
    publicationYear: {
        type: Number,
        required: true,
    },
    addedBy: { // User who added the book
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // We will calculate averageRating dynamically or store it and update
});

// Create a text index for searching books by title or author
BookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', BookSchema);