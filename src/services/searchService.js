// src/services/searchService.js
const { Client } = require("@elastic/elasticsearch");
const ErrorModel = require("../models/Error");
const logger = require("../utils/logger");
require("dotenv").config();

// Initialize Elasticsearch client
const client = new Client({ node: process.env.ELASTICSEARCH_URI });
let stopElasticsearch = true;

/**
 * Parse query string to extract stack trace, error type, and additional details.
 * @param {string} query - Raw query string
 * @returns {Object} - Parsed query details
 */
function parseQuery(query) {
  const stackTraceMatch = query.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
  const errorTypeMatch = query.match(/^(\w+Error):/);

  return {
    stackTrace: stackTraceMatch ? stackTraceMatch[0] : null,
    errorType: errorTypeMatch ? errorTypeMatch[1] : null,
    rawQuery: query,
  };
}

/**
 * Format search results with detailed information.
 * @param {Array} results - Raw search results
 * @param {string} query - Original query string
 * @returns {Object} - Formatted response
 */
function formatResponse(results, query) {
  return {
    results: Array.isArray(results) ? [results[0]] : results,
  };
}

/**
 * Search errors in MongoDB as a fallback when Elasticsearch is unavailable
 * @param {string} query - The search term
 * @returns {Array} - List of matching documents
 */
async function searchErrorsFallback(query) {
  try {
    if (query === "" || query === undefined || query === null) return [];
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
    // console.log(results, "ffffffffffffffff results");
    return results;
  } catch (err) {
    logger.error("Error searching MongoDB:", err);
    throw err;
  }
}

/**
 * Search errors using Elasticsearch with MongoDB fallback
 * @param {string} query - The search term
 * @returns {Object} - Formatted response
 */
async function searchErrors(query) {
  if (stopElasticsearch) {
    logger.info("Elasticsearch disabled. Using MongoDB fallback.");
    const fallbackResults = await searchErrorsFallback(query);
    // console.log(fallbackResults, "ffffffffffffffff fallbackResults");
    return formatResponse(fallbackResults, query);
  }

  const parsedQuery = parseQuery(query);
  try {
    const response = await client.search({
      index: "errors",
      body: {
        query: {
          multi_match: {
            query: parsedQuery.errorType || parsedQuery.rawQuery,
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
    const results = hits.map((hit) => ({ ...hit._source, _score: hit._score }));
    // console.log(results, "ffffffffffffff results");
    return formatResponse(results, query);
  } catch (err) {
    logger.error("Elasticsearch failed. Falling back to MongoDB:", err.message);
    const fallbackResults = await searchErrorsFallback(query);
    return formatResponse(fallbackResults, query);
  }
}

/**
 * Indexes a single document in Elasticsearch, skipping if unavailable.
 * @param {Object} error - The error document to be indexed
 */
async function indexError(error) {
  if (stopElasticsearch) {
    logger.info("Elasticsearch indexing skipped. Elasticsearch disabled.");
    return;
  }

  try {
    const { _id, ...body } = error;
    await client.index({
      index: "errors",
      id: _id.toString(),
      body,
    });
    logger.log("Error indexed successfully");
  } catch (err) {
    logger.warn("Skipping indexing due to Elasticsearch issue:", err.message);
  }
}

/**
 * Bulk indexes all errors in Elasticsearch, skipping if unavailable.
 * @param {Array} errors - List of error documents to index
 */
async function bulkIndexErrors(errors) {
  if (stopElasticsearch) {
    logger.info("Bulk indexing skipped. Elasticsearch disabled.");
    return;
  }

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
      logger.error("Errors in bulk indexing:", erroredDocuments);
    } else {
      logger.log("Bulk indexing completed successfully");
    }
  } catch (err) {
    logger.warn(
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
