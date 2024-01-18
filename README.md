# Exercise Tracker Microservice API

This documentation provides details on the API endpoints and usage of the Exercise Tracker Microservice. The API allows users to track exercises, manage user information, and retrieve exercise logs.

## Table of Contents

- [Exercise Tracker Microservice API Documentation](#exercise-tracker-microservice-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
  - [Endpoints](#endpoints)
    - [1. Get All Users](#1-get-all-users)
    - [2. Create a New User](#2-create-a-new-user)
    - [3. Add Exercise for a User](#3-add-exercise-for-a-user)
    - [4. Get Exercise Log for a User](#4-get-exercise-log-for-a-user)
  - [Error Responses](#error-responses)
    - [User Schema](#user-schema)
    - [Exercise Schema](#exercise-schema)
  - [Technologies and Challenges Faced](#technologies-and-challenges-faced)
  - [Setup](#setup)
  - [Conclusion](#conclusion)

## Base URL

The base URL for the Exercise Tracker Microservice API is `http://your-base-url/`, where `your-base-url` should be replaced with the actual base URL where the API is hosted.

## Authentication

No authentication is currently required for accessing the endpoints.

## Endpoints

### 1. Get All Users

``` http
GET /api/users
```

**Description:** Retrieve a list of all users.

**Request:**

- No request parameters required.

**Response:**

``` json
[
  {
    "username": "user1",
    "id": "user_id1"
  },
  {
    "username": "user2",
    "id": "user_id2"
  },
  // ... (more users)
]
```

### 2. Create a New User

``` http
POST /api/users
```

**Description:** Create a new user.

**Request:**

- Method: `POST`
- Body:

``` json
{
  "username": "newUser"
}
```

**Response:**

``` json
{
  "username": "newUser",
  "_id": "new_user_id"
}
```

### 3. Add Exercise for a User

``` http
POST /api/users/:id/exercises
```

**Description:** Add a new exercise for a specific user.

**Request:**

- Method: `POST`
- URL Parameters: `id` (User ID)
- Body:

``` json
{
  "description": "Running",
  "duration": 30,
  "date": "2024-01-01" // Optional, default is the current date
}
```

**Response:**

``` json
{
  "username": "user1",
  "description": "Running",
  "duration": 30,
  "date": "2024-01-01",
  "_id": "user_id1"
}
```

### 4. Get Exercise Log for a User

``` http
GET /api/users/:id/logs
```

**Description:** Retrieve the exercise log for a specific user.

**Request:**

- Method: `GET`
- URL Parameters: `id` (User ID)
- Query Parameters (optional):
  - `from` (start date)
  - `to` (end date)
  - `limit` (maximum number of log entries)

**Response:**

``` json
{
  "_id": "user_id1",
  "username": "user1",
  "count": 3,
  "log": [
    {
      "description": "Running",
      "duration": 30,
      "date": "2024-01-01"
    },
    // ... (more log entries)
  ]
}
```

## Error Responses

**Status Code: `400 Bad Request`**

``` json
{
  "error": "Invalid Date"
}
```

**Status Code: `500 Internal Server Error`**

``` json
{
  "error": "Internal Server Error Message"
}
```

## Technologies and Challenges Faced

### Technologies Used

The Exercise Tracker Microservice API is built using the following technologies:

- **Node.js**: A JavaScript runtime used for server-side development.
- **Express**: A web application framework for Node.js, simplifying the development of robust APIs.
- **MongoDB**: A NoSQL database used to store user and exercise data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js, facilitating interaction with the database.
- **dotenv**: A module for loading environment variables from a `.env` file during development.

### Challenges Faced and Solutions

#### 1. Asynchronous Operations

**Challenge:** Dealing with asynchronous operations, particularly when interacting with the MongoDB database, led to complex code structures and potential callback hell.

**Solution:** Utilized `async/await` syntax to simplify asynchronous code, making it more readable and maintainable. Employed `try/catch` blocks to handle errors gracefully and provide meaningful error messages in the API responses.

#### 2. Date Handling

**Challenge:** Managing date inputs for exercises posed challenges, especially validating and converting them to the required format.

**Solution:** Implemented date validation using the `Date` object and provided a fallback to the current date if an invalid date is provided. Ensured consistent date formatting in the API responses for clarity.

#### 3. Database Connection Handling

**Challenge:** Managing the database connection and handling errors during the connection setup.

**Solution:** Implemented error handling for the MongoDB connection setup. Used the `mongoose.connection.on` event to log errors and success messages. Ensured that the server does not start if the database connection fails.

#### 4. Testing Environment

**Challenge:** Ensuring a smooth transition between development and production environments, including setting up a local development database.

**Solution:** Employed the `dotenv` module to manage environment variables, allowing easy configuration for development and production. Provided a default local database connection string to simplify setup for local development.

By addressing these challenges and utilizing the technologies mentioned, the Exercise Tracker Microservice API was successfully developed to provide a reliable and user-friendly interface for exercise tracking.

## Setup

Before using the API, ensure that Node.js, npm, and MongoDB are installed on your system. Additionally, create a `.env` file in the project root with the following content:

```env
NODE_ENV=development
PORT=3000
DB_URL=mongodb://127.0.0.1:27017/exercise-tracker
```

## Conclusion

The Exercise Tracker Microservice API provides a simple and effective way to track exercises for users. By leveraging Node.js, Express, and MongoDB, the API offers flexibility and scalability for managing user information and exercise logs. As you integrate and use this API, feel free to provide feedback and contribute to its improvement. Happy tracking!
