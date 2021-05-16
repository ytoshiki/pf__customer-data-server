export const validateAuth = (id: string) => {
  if (id !== process.env.AUTH_ID) {
    return false;
  }

  return true;
};
