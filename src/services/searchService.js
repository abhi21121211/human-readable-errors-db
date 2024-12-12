// src/services/searchService.js
const { Client } = require("@elastic/elasticsearch");
const mongoose = require("mongoose");
const ErrorModel = require("../models/Error");
require("dotenv").config();

// Initialize Elasticsearch client
const client = new Client({ node: process.env.ELASTICSEARCH_URI });

/**
 * Searches errors in Elasticsearch or MongoDB as a fallback.
 * @param {string} query - The search query
 * @returns {Array} - List of matching documents
 */
async function searchErrors(query) {
  try {
    // Elasticsearch search
    const response = await client.search({
      index: "errors",
      body: {
        query: {
          multi_match: {
            query,
            fields: [
              "code",
              "error",
              "description",
              "tags",
              "language",
              "framework",
            ],
            fuzziness: "AUTO",
          },
        },
      },
    });

    const hits = response?.hits?.hits || [];
    return hits.map((hit) => hit._source);
  } catch (err) {
    console.warn("Elasticsearch unavailable, falling back to MongoDB search");
    try {
      // MongoDB fallback search
      const errors = await ErrorModel.find({
        $text: { $search: query },
      }).lean();
      return errors;
    } catch (mongoErr) {
      console.error("MongoDB search failed:", mongoErr);
      throw new Error("Search service unavailable");
    }
  }
}

/**
 * Indexes a single document in Elasticsearch, skipping if unavailable.
 * @param {Object} error - The error document to be indexed
 */
async function indexError(error) {
  try {
    const { _id, ...body } = error; // Extract _id
    await client.index({
      index: "errors",
      id: _id.toString(),
      body,
    });
    console.log("Error indexed successfully");
  } catch (err) {
    console.warn("Skipping indexing due to Elasticsearch issue:", err.message);
  }
}

/**
 * Bulk indexes all errors in Elasticsearch, skipping if unavailable.
 * @param {Array} errors - List of error documents to index
 */
async function bulkIndexErrors(errors) {
  try {
    const body = errors.flatMap((error) => [
      { index: { _index: "errors", _id: error._id.toString() } },
      error,
    ]);

    const { body: bulkResponse } = await client.bulk({ body });
    if (bulkResponse.errors) {
      const erroredDocuments = bulkResponse.items.filter((item) =>
        item.index.error ? true : false
      );
      console.error("Errors in bulk indexing:", erroredDocuments);
    } else {
      console.log("Bulk indexing completed successfully");
    }
  } catch (err) {
    console.warn(
      "Skipping bulk indexing due to Elasticsearch issue:",
      err.message
    );
  }
}

module.exports = {
  searchErrors,
  indexError,
  bulkIndexErrors,
};
