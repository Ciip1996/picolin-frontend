module.exports = {
  extends: ["airbnb",
    "prettier",
    "prettier/react",
    "plugin:flowtype/recommended",
    "prettier/flowtype",
    "eslint-config-prettier"
  ],
  "settings": {
    "import/resolver": {
      "node": {
        "moduleDirectory": ["node_modules", "src/"]
      }
    }
  },
  parser: "babel-eslint",
  env: {
    jest: true,
    browser: true
  },
  rules: {
     "camelcase": "off",
    "linebreak-style": ["error","unix"],
    "no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true  }],
    "no-use-before-define": "off",
    "react/prop-types": "off",
    "comma-dangle": "off",
    "import/prefer-default-export": "off",
    "global-require": "off",
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": ["error", { forbidDefaultForRequired: false, ignoreFunctionalComponents: false }],
    "react/default-props-match-prop-types": ["error", { "allowRequiredDefaults": true }],
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "printWidth": 100,
        trailingComma: "none"
      }
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  plugins: [
    "prettier",
    "react-hooks"
  ],
  globals: {
    localStorage: true,
    fetch: false,
    React: "readonly",
    shallow: "readonly",
    render: "readonly",
    expect: "readonly",
    sinon: "readonly"
  }
};
