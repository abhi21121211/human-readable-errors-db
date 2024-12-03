const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

// Initialize Elasticsearch client
const client = new Client({ node: process.env.ELASTICSEARCH_URI });

/**
 * Indexes a single document in Elasticsearch
 * @param {Object} data - The document to be indexed
 */
async function indexDocument(data) {
  try {
    const { _id, ...body } = data; // Extract _id from the data
    const response = await client.index({
      index: "errors",
      id: _id, // Use _id as the document ID
      body: body, // Pass the rest of the data as the document body
    });
    console.log("Document indexed:", response);
  } catch (error) {
    console.error("Error indexing document:", error);
  }
}

/**
 * Searches errors in Elasticsearch with fuzzy matching
 * @param {string} query - The search query
 * @returns {Array} - List of matching documents
 */
async function searchErrors(query) {
  try {
    const response = await client.search({
      index: "errors",
      body: {
        query: {
          multi_match: {
            query,
            fields: ["code", "error", "description", "tags"],
            fuzziness: "AUTO", // Enables fuzzy search
          },
        },
      },
    });

    // Safely access the hits
    const hits = response?.body?.hits?.hits || []; // Avoid undefined access
    return hits.map((hit) => hit._source);
  } catch (err) {
    if (err.meta?.body?.error?.type === "index_not_found_exception") {
      throw new Error(
        "The 'errors' index does not exist. Please create it first."
      );
    }
    console.error("Error searching Elasticsearch:", err);
    throw err;
  }
}

/**
 * Indexes a new error document in Elasticsearch
 * @param {Object} error - The error document to be indexed
 */
async function indexError(error) {
  try {
    const response = await client.index({
      index: "errors",
      id: error._id,
      body: error,
    });
    console.log("Error indexed successfully:", response);
  } catch (err) {
    console.error("Error indexing data in Elasticsearch:", err);
    throw err;
  }
}

// Sample data for testing
const document = {
  _id: "674d80bcad8e79815dba478b",
  resources: {
    videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    tutorials: [
      "https://www.freecodecamp.org/news/understanding-typeerror-cannot-read-property-of-undefined/",
    ],
  },
  meta: {
    added_by: "john.doe",
    added_on: "2024-12-02T00:00:00.000Z",
    updated_on: "2024-12-02T00:00:00.000Z",
  },
  language: "JavaScript",
  framework: "React",
  type: "Error",
  code: "JS001",
  error: "Cannot read property 'foo' of undefined",
  severity: "High",
  description:
    "Occurs when attempting to access a property of an undefined object.",
  cause: [
    "Object is undefined or null.",
    "Variable is not initialized before usage.",
  ],
  solution: [
    "Ensure the object is defined before accessing properties.",
    "Add a null check before using the object.",
  ],
  tags: ["JavaScript", "React", "TypeError"],
  examples: [
    {
      code: "const foo = obj.foo;",
      output: "TypeError: Cannot read property 'foo' of undefined",
      _id: "674d795ee0338c35102811ab",
    },
    {
      code: "console.log(bar.baz);",
      output: "TypeError: Cannot read property 'baz' of undefined",
      _id: "674d795ee0338c35102811ac",
    },
  ],
  links: [
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Property_of_null_or_undefined",
  ],
  __v: 0,
};

// Index the sample document
indexDocument(document);

module.exports = {
  searchErrors,
  indexError,
};
