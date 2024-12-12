// src/services/searchService.js
const { Client } = require("@elastic/elasticsearch");
const mongoose = require("mongoose");
const ErrorModel = require("../models/Error");
require("dotenv").config();

// Initialize Elasticsearch client
const client = new Client({ node: process.env.ELASTICSEARCH_URI });

/**
 * Search errors in MongoDB as a fallback when Elasticsearch is unavailable
 * @param {string} query - The search term
 * @returns {Array} - List of matching documents
 */
async function searchErrorsFallback(query) {
  try {
    const results = await ErrorModel.find({
      $or: [
        { language: { $regex: query, $options: "i" } },
        { framework: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
        { error: { $regex: query, $options: "i" } },
        { severity: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { cause: { $regex: query, $options: "i" } },
        { solution: { $regex: query, $options: "i" } },
        { "examples.code": { $regex: query, $options: "i" } },
        { "examples.output": { $regex: query, $options: "i" } },
        { "resources.videos": { $regex: query, $options: "i" } },
        { "resources.tutorials": { $regex: query, $options: "i" } },
        { links: { $regex: query, $options: "i" } },
        { "meta.added_by": { $regex: query, $options: "i" } },
      ],
    }).exec();

    return results;
  } catch (err) {
    console.error("Error searching MongoDB:", err);
    throw err;
  }
}

/**
 * Search errors using Elasticsearch with MongoDB fallback
 * @param {string} query - The search term
 * @returns {Array} - List of matching documents
 */
async function searchErrors(query) {
  try {
    // Attempt to search with Elasticsearch
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
    console.error(
      "Elasticsearch failed. Falling back to MongoDB:",
      err.message
    );
    // Fallback to MongoDB
    return await searchErrorsFallback(query);
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
