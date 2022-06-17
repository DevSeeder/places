export const mockModelMongoose = {
  find: () => {
    return {
      exec: jest.fn(() => null)
    };
  },
  findAll: () => {
    return { exec: jest.fn(() => null) };
  },
  create: jest.fn(() => null),
  findByIdAndUpdate: () => {
    return { exec: jest.fn(() => null) };
  }
};

export function mockMongooseConnection() {
  jest.mock('mongoose', () => {
    return {
      createConnection: jest.fn(() => {
        return {
          asPromise: jest.fn(() => {
            return {
              model: jest.fn(),
              close: jest.fn()
            };
          })
        };
      }),
      Schema: jest.fn()
    };
  });
}
