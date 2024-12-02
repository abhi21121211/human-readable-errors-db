const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

const client = new Client({ node: process.env.ELASTICSEARCH_URI });

// Search errors with fuzzy matching
exports.searchErrors = async (query) => {
  try {
    const { body } = await client.search({
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
    return body.hits.hits.map((hit) => hit._source);
  } catch (err) {
    console.error("Error searching Elasticsearch:", err);
    throw err;
  }
};

// Index new error in ElasticSearch
exports.indexError = async (error) => {
  try {
    await client.index({
      index: "errors",
      _id: error._id,
      body: error,
    });
  } catch (err) {
    console.error("Error indexing data in Elasticsearch:", err);
    throw err;
  }
};
