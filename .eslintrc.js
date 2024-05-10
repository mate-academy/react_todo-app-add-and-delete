module.exports = {
  extends: [
    '@mate-academy/eslint-config-react-typescript',
    'plugin:cypress/recommended',
  ],
  rules: {
    'prettier/prettier': 0,
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/label-has-for":"off",
  },
};
