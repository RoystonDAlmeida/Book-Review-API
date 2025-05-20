// routes/bookRoutes.js - Validation for book routes

const express = require('express');
const router = express.Router();
const { addBook, getAllBooks, getBookById, searchBooks } = require('../controllers/bookController');
const { addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management and retrieval
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Book added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request (e.g., validation error, duplicate ISBN)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Error'
 *                 - $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Get all books with pagination and filters
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of books per page
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *         description: Filter books by author (case-insensitive, partial match)
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *         description: Filter books by genre (case-insensitive, partial match)
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedBooks'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// @route   POST api/books
// @desc    Add a new book
// @access  Private
router.post(
    '/',
    [
        protect,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('author', 'Author is required').not().isEmpty(),
            check('genre', 'Genre is required').not().isEmpty(),
            check('isbn', 'ISBN is required').not().isEmpty(),
            check('publicationYear', 'Publication year is required and must be a number').notEmpty().isNumeric(),
        ],
    ],
    addBook
);

// @route   GET api/books
// @desc    Get all books (with pagination and optional filters)
// @access  Public
router.get('/', getAllBooks);

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search books by title or author
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema: { type: string }
 *         description: The search term for book title or author (case-insensitive, partial match)
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of books per page
 *     responses:
 *       200:
 *         description: A list of matching books
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedBooks'
 *       400:
 *         description: Search query is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No books found matching your query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @route   GET api/books/search
// @desc    Search books by title or author
// @access  Public
router.get('/search', searchBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book details by ID, including average rating and reviews
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: The book ID
 *       - in: query
 *         name: reviewPage
 *         schema: { type: integer, default: 1 }
 *         description: Page number for reviews pagination
 *       - in: query
 *         name: reviewLimit
 *         schema: { type: integer, default: 5 }
 *         description: Number of reviews per page
 *     responses:
 *       200:
 *         description: Detailed information about the book and its reviews
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookWithDetails'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @route   GET api/books/:id
// @desc    Get book details by ID
// @access  Public
router.get('/:id', getBookById);

/**
 * @swagger
 * /books/{bookId}/reviews:
 *   post: # Submit a review for a specific book
 *     summary: Submit a review for a specific book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema: { type: string }
 *         description: The ID of the book to review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: # Define the schema inline for clarity
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 format: float
 *                 minimum: 1
 *                 maximum: 5
 *                 description: The rating for the book (1-5)
 *               comment:
 *                 type: string
 *                 description: Optional comment for the review
 *                 example: "This book was a fantastic read, highly recommended!"
 *             required:
 *               - rating # Explicitly mark rating as required
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *             example:
 *               _id: "682c8bead1d34899178d26ff"
 *               book: "682b7f81caa77a6dfac230d6"
 *               user:
 *                 _id: "682b720faab5e3b913a21ef1"
 *                 username: "Royston"
 *               rating: 5
 *               comment: "This book was a fantastic read, highly recommended!"
 *               createdAt: "2025-05-20T14:04:26.999Z"
 *               updatedAt: "2025-05-20T14:04:27.010Z"
 *               __v: 0
 *       400:
 *         description: Bad request (e.g., validation error, already reviewed)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/Error'
 *             example:
 *               message: "You have already reviewed this book"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Not authorized, no token"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @route   POST api/books/:bookId/reviews
// @desc    Submit a review for a book
// @access  Private
router.post(
    '/:bookId/reviews',
    [
        protect,
        [
            check('rating', 'Rating is required and must be a number between 1 and 5').isFloat({ min: 1, max: 5 }),
            check('comment', 'Comment is optional but must be a string if provided').optional().isString(),
        ],
    ],
    addReview
);


module.exports = router;