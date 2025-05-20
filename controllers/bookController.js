const Book = require('../models/Book');
const Review = require('../models/Review');
const mongoose = require('mongoose'); // Import Mongoose
const { validationResult } = require('express-validator');

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
const addBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, genre, isbn, publicationYear } = req.body;

    try {
        const newBook = new Book({
            title,
            author,
            genre,
            isbn,
            publicationYear,
            addedBy: req.user.id, // From authMiddleware
        });

        let savedBook = await newBook.save();

        // Populate the addedBy field with specific user details for the response
        // Ensure the fields 'username', 'email', '_id', 'createdAt' match your User model and desired output
        const populatedBook = await Book.findById(savedBook._id).populate('addedBy', 'username email _id createdAt');
        res.status(201).json(populatedBook);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) { // Duplicate key error for ISBN
            return res.status(400).json({ message: 'Book with this ISBN already exists.' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Get all books with pagination and filters
// @route   GET /api/books
// @access  Public
const getAllBooks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { author, genre } = req.query;
    const query = {};

    if (author) {
        query.author = { $regex: author, $options: 'i' }; // Case-insensitive regex search
    }
    if (genre) {
        query.genre = { $regex: genre, $options: 'i' };
    }

    try {
        const books = await Book.find(query)
            .populate('addedBy', 'username email') // Populate user details
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments(query);

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalBooks / limit),
            totalBooks,
            books,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get book details by ID, including average rating and reviews
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('addedBy', 'username email');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Pagination for reviews
        const reviewPage = parseInt(req.query.reviewPage) || 1;
        const reviewLimit = parseInt(req.query.reviewLimit) || 5;
        const reviewSkip = (reviewPage - 1) * reviewLimit;

        const reviews = await Review.find({ book: req.params.id })
            .populate('user', 'username') // Populate username of reviewer
            .sort({ createdAt: -1 })
            .skip(reviewSkip)
            .limit(reviewLimit);

        const totalReviews = await Review.countDocuments({ book: req.params.id });

        // Calculate average rating
        const reviewStats = await Review.aggregate([
            { $match: { book: new mongoose.Types.ObjectId(req.params.id) } },
            {
                $group: {
                    _id: '$book',
                    averageRating: { $avg: '$rating' },
                },
            },
        ]);

        const averageRating = reviewStats.length > 0 ? parseFloat(reviewStats[0].averageRating.toFixed(1)) : 0;

        res.json({
            book,
            averageRating,
            reviews: {
                currentPage: reviewPage,
                totalPages: Math.ceil(totalReviews / reviewLimit),
                totalReviews,
                data: reviews,
            },
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(500).send('Server Error');
    }
};


// @desc    Search books by title or author
// @route   GET /api/books/search
// @access  Public
const searchBooks = async (req, res) => {
    const { query } = req.query; // e.g., /api/books/search?query=harry potter
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if query is provided
    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        // Using $text search (requires a text index on title and author fields in Book model)
        const searchCriteria = {
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive partial match
                { author: { $regex: query, $options: 'i' } }  // Case-insensitive partial match
            ]
        };

        const books = await Book.find(searchCriteria)
            .populate('addedBy', 'username')    // Populating user info
            .sort({ title: 1 }) // Sort alphabetically by title
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments(searchCriteria);

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found matching your query.' });
        }

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalBooks / limit),
            totalBooks,
            books,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    searchBooks,
};
