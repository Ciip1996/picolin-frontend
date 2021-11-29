module.exports = {
  env: {
    browser: true,
    es6: true
    // jest: true
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "prettier",
    "prettier/react",
    "plugin:flowtype/recommended",
    "prettier/flowtype",
    "eslint-config-prettier"
  ],
  parser: "babel-eslint",
  settings: {
    "import/resolver": {
      node: {
        moduleDirectory: ["node_modules", "src/"]
      }
    }
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    React: "readonly",
    localStorage: true,
    fetch: false
    // shallow: "readonly",
    // render: "readonly",
    // expect: "readonly",
    // sinon: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react", "prettier", "react-hooks"],
  rules: {
    "no-debugger": "warn",
    camelcase: "off",
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true }
    ],
    "no-use-before-define": "off",
    "react/prop-types": "off",
    "comma-dangle": "off",
    "import/prefer-default-export": "off",
    "global-require": "off",
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": [
      "error",
      { forbidDefaultForRequired: false, ignoreFunctionalComponents: false }
    ],
    "react/default-props-match-prop-types": [
      "error",
      { allowRequiredDefaults: true }
    ],
    "prettier/prettier": [
      "error",
      {},
      {
        usePrettierrc: true
      }
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "flowtype/no-types-missing-file-annotation": "warn"
  }
};
