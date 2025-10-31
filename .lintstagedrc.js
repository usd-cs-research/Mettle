module.exports = {
  // For server files - run tests only (no lint script available)
  'server/**/*.ts': [
    (filenames) => {
      const files = filenames.map((f) => f.replace(/\\/g, '/')).join(' ');
      return `npm test --prefix server -- --bail --findRelatedTests --passWithNoTests ${files}`;
    },
  ],
  // For client files - run tests only (CRA handles linting internally)
  'client/src/**/*.{js,jsx,ts,tsx}': [
    (filenames) => {
      const files = filenames.map((f) => f.replace(/\\/g, '/')).join(' ');
      return `npm test --prefix client -- --watchAll=false --bail --findRelatedTests --passWithNoTests ${files}`;
    },
  ],
  // For formatting any file
  '*.{js,ts,jsx,tsx,json,md,yml,yaml}': ['prettier --write'],
};
