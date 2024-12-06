const { Client } = require("@elastic/elasticsearch");
const mongoose = require("mongoose");
require("dotenv").config();

// Initialize Elasticsearch client
const client = new Client({ node: process.env.ELASTICSEARCH_URI });

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

    // Safely access the hits
    const hits = response?.hits?.hits || [];
    return hits.map((hit) => hit._source);
  } catch (err) {
    if (err.meta?.body?.error?.type === "index_not_found_exception") {
      throw new Error("The 'errors' index does not exist. Please create it.");
    }
    console.error("Error searching Elasticsearch:", err);
    throw err;
  }
}

/**
 * Indexes a single document in Elasticsearch
 * @param {Object} error - The error document to be indexed
 */
async function indexError(error) {
  try {
    const { _id, ...body } = error; // Extract _id
    await client.index({
      index: "errors",
      id: _id.toString(), // Use _id as the document ID
      body,
    });
    console.log("Error indexed successfully");
  } catch (err) {
    console.error("Error indexing document:", err);
    throw err;
  }
}

/**
 * Bulk indexes all errors in Elasticsearch
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
    console.error("Error during bulk indexing:", err);
    throw err;
  }
}

module.exports = {
  searchErrors,
  indexError,
  bulkIndexErrors,
};
