// See https://stackoverflow.com/questions/58603201/jest-cannot-load-svg-file
module.exports = {
  process() {
    return {
      code: `module.exports = () => null;`,
    }
  },
  getCacheKey() {
    // The output is always the same.
    return 'svgTransform2'
  },
}
