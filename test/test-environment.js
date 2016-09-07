function isInstrumented() {
  if (global.__coverage__) { // eslint-disable-line no-underscore-dangle
    return true;
  }
  return false;
}

export default {
  isInstrumented,
};
