export const mockJwtService = {
  verifyAsync: () => {
    return true;
  }
};

export const mockJwtGuard = {
  canActivate: () => {
    return true;
  }
};
