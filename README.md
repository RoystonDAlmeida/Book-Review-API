# 📖 Book Review API

Welcome to the Book Review API! This robust RESTful service empowers users to seamlessly register, log in, discover and manage books, and share their valuable reviews. Secure access to protected resources is ensured via JWT authentication.

## 📜 Contents

- [📖 Book Review API](#-book-review-api)
  - [📜 Contents](#-contents)
  - [✨ Features](#-features)
  - [🛠️ Prerequisites](#️-prerequisites)
  - [🚀 Project Setup](#-project-setup)
  - [⚙️ Environment Variables Setup](#️-environment-variables-setup)
  - [🚀 How to Run Locally](#-how-to-run-locally)
  - [API Documentation (Swagger UI)](#api-documentation-swagger-ui)
  - [📬 Using Postman](#-using-postman)
  - [📬 Using Postman (Desktop App or VS Code Extension)](#-using-postman-desktop-app-or-vs-code-extension)
  - [💾 Database Schema](#-database-schema)
    - [Relationships](#relationships)
  - [🧠 Design Decisions \& Assumptions](#-design-decisions--assumptions)


## ✨ Features

*   🔑 **Secure User Authentication:** Signup & Login with JSON Web Tokens (JWT).
*   📚 **Comprehensive Book Management:** Full CRUD operations (Add, Get All, Get by ID, Search).
*   ✍️ **User-Specific Reviews:** Add, Update, and Delete your own reviews.
*   📄 **Efficient Pagination:** Smoothly browse through lists of books and reviews.
*   🔍 **Powerful Search:** Quickly find books by title or author.
*   ⭐ **Dynamic Ratings:** Automatic calculation of average book ratings.
*   **Interactive API Docs:** Explore endpoints with Swagger UI.
 
## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v14.x or later recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js)
*   [MongoDB](https://www.mongodb.com/) (a local instance or a cloud service like MongoDB Atlas)

## 🚀 Project Setup

1.  **Clone the Repository:**
    Open your terminal and clone the project to your local machine:
    ```bash
    git clone git@github.com:RoystonDAlmeida/Book-Review-API.git
    ```

2.  **Navigate to Project Directory:**
    Change into the project's root directory:
    ```bash
    cd Book-Review-API/
    ```

## ⚙️ Environment Variables Setup

To run this project, you'll need to set up your environment variables.

1.  Create a file named `.env` in the root directory of the project.
2.  Add the following content to your `.env` file, replacing the placeholder values with your actual configuration:

    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string_here
    JWT_SECRET=your_super_secret_jwt_key_for_signing_tokens
    ```

    *   `PORT`: The port on which the server will run (e.g., 3000 or 5000).
    *   `MONGO_URI`: Your MongoDB connection string.
        *   For a local MongoDB instance, it might look like: `mongodb://localhost:27017/book_review_db`
        *   For MongoDB Atlas, it will be a longer string provided by Atlas.
    *   `JWT_SECRET`: A strong, unique secret key used for signing and verifying JSON Web Tokens. Make this a long, random string for security.

## 🚀 How to Run Locally

1.  **Ensure MongoDB is Running:**
    Ensure your MongoDB server (local instance or cloud service) is up and running. If running locally on Linux, you might need to start the service:
    ```bash
    sudo systemctl start mongod
    ```
2.  **Install Dependencies:**
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```
3.  **Launch the Application Server:**
    ```bash
    npm start
    ```
    The server will typically run on `http://localhost:3000` (or the port specified in your `.env` file). You should see a console message like `Server running on port 3000`.

## API Documentation (Swagger UI)

Once the server is running, you can access the interactive Swagger UI documentation in your browser:
*   **URL:** `http://localhost:3000/api-docs/`

With Swagger UI, you can effortlessly:
*   View all available API endpoints.
*   See request and response schemas for each endpoint.
*   Execute API requests directly from the browser.

**Authorizing Protected Routes in Swagger:**
1.  First, use the `/auth/login` or `/auth/signup` endpoint to obtain a JWT token.
2.  Click the "Authorize" button (usually a lock icon 🔒) at the top right of the Swagger UI page.
3.  In the "Value" field of the `bearerAuth` dialog, enter your JWT token(e.g., `eyJhbGciOiJIUzI1NiI...`).
4.  Click "Authorize" and then "Close". You can now test protected endpoints!

## 📬 Using Postman
## 📬 Using Postman (Desktop App or VS Code Extension)

To explore and test the API with pre-configured requests, use the official **Book Review API Postman Collection**. The general setup for using this collection is similar whether you're using the Postman Desktop App or the Postman VS Code Extension.

**1. Get the Collection:**
*   **Desktop App:** Click the "Run in Postman" button below to fork or import the collection into your workspace.
    <a href="https://www.postman.com/roystondalmeida/book-review-api/collection/xsbk00r/book-review-api" target="_blank"><img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;"></a>
    This will allow you to:
    *   **Fork the collection:** This creates a linked copy in your own Postman workspace. You'll get updates if the original collection changes, and you can make your own modifications to your fork.
    *   **Import the collection:** This brings a standalone copy into your workspace.
*   **VS Code Extension:**
    1.  Install the official "Postman" extension from the VS Code Marketplace.
    2.  Sign in to your Postman account.
    3.  Open the Postman sidebar in VS Code and navigate to your "Book Review API" workspace (or where you forked/imported the collection via the Desktop App/Web) to access it.

**2. Environment Setup (Highly Recommended):**
A Postman Environment helps manage variables like your base URL and authentication token.
*   **Create/Select an Environment:**
    *   **Desktop App:** Create a new environment (e.g., "Book Review API Dev").
    *   **VS Code Extension:** In the Postman sidebar's "Environments" section, create a new environment (e.g., "Book Review API Dev - VSCode") or select a synced one.
*   **Add `baseUrl` Variable:** Add a variable named `baseUrl` with the value `http://localhost:3000/api` (or your configured base URL if you changed the `PORT` in `.env`).
*   **Ensure Environment is Active:** Select this environment as active in your Postman client (Desktop or VS Code extension) for the request.

**3. Handling Authentication & `authToken`:**
To test protected endpoints, you'll need an `authToken`.
1.  **Login:** Select the `/auth/login` (or `/auth/signup`) request from the collection. Fill in the body with valid credentials and send the request.
2.  **Copy Token:** After a successful login, copy the `token` value from the response body.
3.  **Set `bearerToken` Variable:** Go to your active Postman Environment (in Desktop or VS Code extension) and add/update a variable named `bearerToken`. Paste the copied token as its current value.
    *   *Note: The collection's protected requests are pre-configured to use `{{bearerToken}}` as a Bearer Token in the Authorization header.*

**4. Explore & Test:**
You can now select any request from the collection, and it will use your configured `baseUrl` and `bearerToken`. Each request in the collection typically includes:
*   The correct HTTP method and URL.
*   Example request bodies (where applicable).
*   Saved example responses to show you what to expect.
View responses directly within your Postman client (Desktop or VS Code).

## 💾 Database Schema

The application uses MongoDB, with Mongoose as the ODM for schema modeling. The main collections are:

1.  **Users (`users`)**
    *   `_id`: ObjectId (Primary Key)
    *   `username`: String, unique, required
    *   `email`: String, unique, required
    *   `password`: String, required (hashed)
    *   `createdAt`: Date, default: `Date.now`

2.  **Books (`books`)**
    *   `_id`: ObjectId (Primary Key)
    *   `title`: String, required
    *   `author`: String, required
    *   `genre`: String, required
    *   `isbn`: String, unique, required
    *   `publicationYear`: Number, required
    *   `addedBy`: ObjectId, ref: 'User', required
    *   `createdAt`: Date, default: `Date.now`
    *   `updatedAt`: Date, default: `Date.now`
    *   *Indexes:* `isbn` (unique), text index on `title` and `author` (for search functionality).

3.  **Reviews (`reviews`)**
    *   `_id`: ObjectId (Primary Key)
    *   `book`: ObjectId, ref: 'Book', required
    *   `user`: ObjectId, ref: 'User', required
    *   `rating`: Number, required, min: 1, max: 5
    *   `comment`: String(optional)
    *   `createdAt`: Date, default: `Date.now`
    *   `updatedAt`: Date, default: `Date.now`
    *   *Indexes:* Compound unique index on (`book`, `user`) to ensure a user can review a book only once.

### Relationships

*   One `User` can add many `Books`. (`Book.addedBy` -> `User._id`)
*   One `User` can write many `Reviews`. (`Review.user` -> `User._id`)
*   One `Book` can have many `Reviews`. (`Review.book` -> `Book._id`)

## 🧠 Design Decisions & Assumptions

*   **Authentication:** JWT (JSON Web Tokens) are used for securing private routes. Tokens are generated upon user login/signup and must be included in the `Authorization` header as a Bearer token.
*   **Database:** MongoDB is used as the NoSQL database, with Mongoose as the ODM for schema modeling, validation, and database interaction.
*   **API Design:** The API follows RESTful conventions.
*   **Input Validation:** `express-validator` is used for server-side validation of request payloads.
*   **Error Handling:**
    *   Consistent error responses are provided in JSON format.
    *   Standard HTTP status codes are used (e.g., `200`, `201`, `400`, `401`, `404`, `500`).
    *   Specific errors like `CastError` (for invalid MongoDB ObjectIds) are handled to return user-friendly `404 Not Found` messages.
    *   Duplicate key errors (e.g., for ISBN or user already reviewed) are handled with `400 Bad Request`.
*   **Pagination:** Implemented for endpoints returning lists of resources (e.g., books, reviews) using `page` and `limit` query parameters.
*   **Search & Filtering:**
    *   Books can be filtered by `author` and `genre` using case-insensitive regex matching.
    *   A dedicated search endpoint (`/api/books/search`) allows searching books by `title` or `author`.
*   **Environment Configuration:** Sensitive data (database URI, JWT secret) is managed through environment variables using the `dotenv` package.
*   **Code Structure:** The project is organized into `controllers`, `models`, `routes`, `middleware`, and `config` directories for modularity and maintainability.
*   **Swagger Documentation:** `swagger-jsdoc` and `swagger-ui-express` are used to generate and serve API documentation dynamically.