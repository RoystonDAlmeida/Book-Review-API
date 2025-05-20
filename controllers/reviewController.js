// controllers/revewController.js - File for review controller

const Review = require('../models/Review');
const Book = require('../models/Book');
const { validationResult } = require('express-validator');

// @desc    Submit a review for a book
// @route   POST /api/books/:bookId/reviews
// @access  Private
const addReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const bookId = req.params.bookId;
    const userId = req.user.id;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if user already reviewed this book
        const existingReview = await Review.findOne({ book: bookId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this book' });
        }

        const newReview = new Review({
            book: bookId,
            user: userId,
            rating,
            comment,
        });

        const review = await newReview.save();
        await review.populate('user', 'username'); // Populate user details for the response

        res.status(201).json(review);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) { // Duplicate key error (user already reviewed)
            return res.status(400).json({ message: 'You have already reviewed this book.' });
        }
        // Check for Mongoose CastError, which happens with invalid ObjectId format
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update your own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    const userId = req.user.id;

    try {
        let review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the review belongs to the logged-in user
        if (review.user.toString() !== userId) {
            return res.status(401).json({ message: 'User not authorized to update this review' });
        }

        review.rating = rating !== undefined ? rating : review.rating;
        review.comment = comment !== undefined ? comment : review.comment;
        review.updatedAt = Date.now();

        await review.save();
        await review.populate('user', 'username');
        await review.populate('book', 'title');


        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete your own review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    const userId = req.user.id;

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the review belongs to the logged-in user
        if (review.user.toString() !== userId) {
            return res.status(401).json({ message: 'User not authorized to delete this review' });
        }

        await Review.deleteOne({ _id: reviewId }); // Use deleteOne or findByIdAndDelete

        res.json({ message: 'Review removed successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(500).send('Server Error');
    }
};

module.exports = {
    addReview,
    updateReview,
    deleteReview,
};