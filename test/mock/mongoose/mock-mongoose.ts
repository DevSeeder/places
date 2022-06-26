export const mockModelMongoose = {
  find: () => {
    return {
      exec: jest.fn(() => null)
    };
  },
  aggregate: () => {
    return {
      exec: jest.fn(() => null)
    };
  },
  findAll: () => {
    return { exec: jest.fn(() => null) };
  },
  create: jest.fn(
    () =>
      new Promise(async (resolve) => {
        resolve({});
      })
  ),
  findByIdAndUpdate: () => {
    return { exec: jest.fn(() => null) };
  }
};

export const mockMongooseConnection = () => {
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
    Schema: jest.fn(() => {
      return {
        index: jest.fn()
      };
    })
  };
};
