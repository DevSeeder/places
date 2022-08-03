export const mockAmqpConnection = {
  publish() {
    return;
  },
  createSubscriber() {
    return;
  }
};

export const mockAmqpConnectionManager = {
  addConnection() {
    return;
  },
  getConnection() {
    return mockAmqpConnection;
  },
  getConnections() {
    return [];
  }
};
