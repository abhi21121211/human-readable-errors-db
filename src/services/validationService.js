const validateErrorPayload = (payload) => {
  if (!payload.title || typeof payload.title !== "string") {
    throw new Error("Title is required and must be a string.");
  }
  if (!payload.description || typeof payload.description !== "string") {
    throw new Error("Description is required and must be a string.");
  }
  return true;
};

module.exports = {
  validateErrorPayload,
};
