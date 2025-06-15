module.exports = {
  getDocument: () => ({ promise: Promise.resolve({ getPage: async () => ({ getTextContent: async () => ({ items: [] }) }) }) }),
  GlobalWorkerOptions: { workerSrc: '' }
};
