export const mockModelMongoose = {
  find: () => {
    return {
      select: jest.fn(() => {
        return {
          lean: jest.fn(() => {
            return {
              exec: jest.fn(() => null)
            };
          })
        };
      })
    };
  },
  select: () => {
    return {
      lean: jest.fn(() => {
        return {
          exec: jest.fn(() => null)
        };
      })
    };
  },
  findById: () => {
    return {
      select: jest.fn(() => {
        return {
          lean: jest.fn(() => {
            return {
              exec: jest.fn(() => null)
            };
          })
        };
      })
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
  deleteOne: jest.fn(
    () =>
      new Promise(async (resolve) => {
        resolve({});
      })
  ),
  deleteOneById: jest.fn(
    () =>
      new Promise(async (resolve) => {
        resolve({});
      })
  ),
  findOneAndUpdate: jest.fn(
    () =>
      new Promise(async (resolve) => {
        resolve({});
      })
  ),
  updateById: jest.fn(
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
