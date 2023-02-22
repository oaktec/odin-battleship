module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  overrides: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
      },
    ],
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {},
};
