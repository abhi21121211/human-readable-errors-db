﻿# Human-Readable Errors Server

The Human-Readable Errors Server is a backend service designed to complement the [human-readable-errors](https://www.npmjs.com/package/human-readable-errors) NPM package. This server provides a robust API for managing error data, storing raw errors, and making them human-readable and understandable.

---

## Overview

This server serves as the database and API layer for the `human-readable-errors` ecosystem. It allows developers to store, fetch, and manage both structured and unstructured error data efficiently. The server is built with **Node.js**, **Express**, and **MongoDB**, ensuring scalability and reliability.

### Features

- CRUD operations for structured errors.
- Storage and management of raw errors (`rowErrors`).
- Integration with the `human-readable-errors` NPM package.
- Full support for Elasticsearch indexing.

---

## Live API Endpoint

You can access the live server here: [https://human-readable-errors-db.onrender.com](https://human-readable-errors-db.onrender.com)

---

## Installation

To use the server locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/abhi21121211/human-readable-errors-db.git
   ```
2. Navigate to the project directory:
   ```bash
   cd human-readable-errors-db
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=5000
     MONGODB_URI=<your-mongodb-connection-string>
     ELASTICSEARCH_URL=<your-elasticsearch-url>
     ```
5. Start the server:
   ```bash
   npm start
   ```

The server will be running at `http://localhost:5000`.

---

## API Documentation

### Base URL

All endpoints are prefixed with the base URL:

```
https://human-readable-errors-db.onrender.com
```

### Endpoints

#### **Errors**

1. **Get all errors**

   ```http
   GET /errors
   ```

   **Response**:

   ```json
   [
     {
       "resources": {
         "videos": ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
         "tutorials": [
           "https://www.freecodecamp.org/news/understanding-typeerror-cannot-read-property-of-undefined/"
         ]
       },
       "meta": {
         "added_by": "john.doe",
         "added_on": "2024-12-02T00:00:00.000Z",
         "updated_on": "2024-12-02T00:00:00.000Z"
       },
       "_id": "674d80bcad8e79815dba478b",
       "language": "JavaScript",
       "framework": "React",
       "type": "Error",
       "code": "JS001",
       "error": "Cannot asda read property 'foo' of undefined",
       "severity": "High",
       "description": "Occurs when attempting to access a property of an undefined object.",
       "cause": [
         "Object is undefined or null.",
         "Variable is not initialized before usage."
       ],
       "solution": [
         "Ensure the object is defined before accessing properties.",
         "Add a null check before using the object."
       ],
       "tags": ["JavaScript", "React", "TypeError"],
       "examples": [
         {
           "code": "const foo = obj.foo;",
           "output": "TypeError: Cannot read property 'foo' of undefined",
           "_id": "674d795ee0338c35102811ab"
         },
         {
           "code": "console.log(bar.baz);",
           "output": "TypeError: Cannot read property 'baz' of undefined",
           "_id": "674d795ee0338c35102811ac"
         }
       ],
       "links": [
         "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Property_of_null_or_undefined"
       ],
       "__v": 0
     }
   ]
   ```

2. **Add a new error**

   ```http
   POST /errors
   ```

**Request Body**:

```json
{
  "language": "JavaScript",
  "framework": "React",
  "type": "Error",
  "code": "JSX100",
  "error": "Expected an assignment or function call.",
  "severity": "High",
  "description": "Occurs when you write invalid JSX syntax.",
  "cause": [
    "Missing parentheses in JSX.",
    "Incorrect return value in a functional component."
  ],
  "solution": [
    "Ensure JSX expressions are wrapped in parentheses.",
    "Return valid JSX or null in functional components."
  ],
  "tags": ["React", "JSX", "Error"],
  "examples": [
    {
      "code": "function App() { return <div> <h1> Hello </h1>; }",
      "output": "SyntaxError: Expected an assignment or function call."
    }
  ],
  "links": ["https://reactjs.org/docs/introducing-jsx.html"],
  "resources": {
    "videos": ["https://youtube.com/example-jsx-video"],
    "tutorials": [
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors"
    ]
  },
  "meta": {
    "added_by": "John Doe"
  }
}
```

**Response**:

```json
{
  "language": "JavaScript",
  "framework": "React",
  "type": "Error",
  "code": "JSX100",
  "error": "Expected an assignment or function call.",
  "severity": "High",
  "description": "Occurs when you write invalid JSX syntax.",
  "cause": [
    "Missing parentheses in JSX.",
    "Incorrect return value in a functional component."
  ],
  "solution": [
    "Ensure JSX expressions are wrapped in parentheses.",
    "Return valid JSX or null in functional components."
  ],
  "tags": ["React", "JSX", "Error"],
  "examples": [
    {
      "code": "function App() { return <div> <h1> Hello </h1>; }",
      "output": "SyntaxError: Expected an assignment or function call.",
      "_id": "6752c10de5908f195444cf62"
    }
  ],
  "resources": {
    "videos": ["https://youtube.com/example-jsx-video"],
    "tutorials": [
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors"
    ]
  },
  "links": ["https://reactjs.org/docs/introducing-jsx.html"],
  "meta": {
    "added_by": "John Doe"
  },
  "_id": "6752c10de5908f195444cf61",
  "createdAt": "2024-12-06T09:17:01.472Z",
  "updatedAt": "2024-12-06T09:17:01.472Z",
  "__v": 0
}
```

3. **Get an error by ID**

   ```http
   GET /errors/:id
   ```

4. **Update an error**

   ```http
   PUT /errors/:id
   ```

   **Request Body**:

   ```json
   {
     "message": "<updated message>",
     "details": "<updated details>"
   }
   ```

5. **Delete an error**
   ```http
   DELETE /errors/:id
   ```

#### **Row Errors**

1. **Get all raw errors**

   ```http
   GET /rowErrors
   ```

2. **Add a raw error**

   ```http
   POST /rowErrors
   ```

   **Request Body**:

   ```json
   {
     "errorData": { "key": "value" }
   }
   ```

3. **Add multiple raw errors**

   ```http
   POST /rowErrors/bulk
   ```

   **Request Body**:

   ```json
   [
     { "errorData": { "key1": "value1" } },
     { "errorData": { "key2": "value2" } }
   ]
   ```

4. **Get a raw error by ID**

   ```http
   GET /rowErrors/:id
   ```

5. **Update a raw error**

   ```http
   PUT /rowErrors/:id
   ```

6. **Delete a raw error**
   ```http
   DELETE /rowErrors/:id
   ```

---

## Usage with `human-readable-errors` NPM Package

To integrate this server with the NPM package, first install the package:

```bash
npm install human-readable-errors
```

Then, in your project:

```javascript
const { handelError } = require("human-readable-errors");

const hre = new handelError({
  serverUrl: "https://human-readable-errors-db.onrender.com",
});

// Example: Converting a raw error
const rawError = { errorData: { key: "value" } };
hre.processError(rawError).then((result) => {
  console.log(result); // Outputs a human-readable error
});
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

Special thanks to all contributors and users who support this project. Your feedback helps us improve!
