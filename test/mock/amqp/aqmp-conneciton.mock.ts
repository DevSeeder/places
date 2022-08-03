export const mockAmqpConnection = {
  publish() {
    return;
  },
  createSubscriber() {
    return;
  },
  setupSubscriberChannel() {
    return;
  },
  init() {
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
