export const mockModelMongoose = {
  find: () => {
    return { exec: jest.fn(() => null) };
  },
  findAll: () => {
    return { exec: jest.fn(() => null) };
  },
  create: jest.fn(() => null),
  findByIdAndUpdate: () => {
    return { exec: jest.fn(() => null) };
  }
};
