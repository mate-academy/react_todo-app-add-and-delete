module.exports = {
  extends: [
    '@mate-academy/eslint-config-react-typescript',
    'plugin:cypress/recommended',
  ],
  rules: {
    "prettier/prettier": [
      "error",
      { endOfLine: "auto" }
    ],
    "jsx-a11y/label-has-for": [2, {
      "required": {
        "some": ["nesting", "id"]
      }
    }],
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
  },
};
