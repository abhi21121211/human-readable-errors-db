module.exports = {
  serve: jest.fn((req, res, next) => next()),
  setup: jest.fn(() => (req, res) => res.end()),
};
