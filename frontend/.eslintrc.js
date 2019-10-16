module.exports = {
  "parser": "babel-eslint",
  "plugins": [
    "eslint-plugin-import",
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-react",
    "eslint-plugin-react-hooks",
    "flowtype",
  ],
  "env": {
    "browser": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb/hooks",
    "plugin:flowtype/recommended",
  ],
  "rules": {
    "max-len": [
      "warn",
      { 
        "code": 100,
        "comments": 100,
        "ignoreRegExpLiterals": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreUrls": true,
        "tabWidth": 2,
      }
    ],
    "react/prop-types": [0],
    "react/no-deprecated": 1,
  },
  "settings": {
    "react": {
      "createClass": "createReactClass", // Regex for Component Factory to use,
                                         // default to "createReactClass"
      "pragma": "React",  // Pragma to use, default to "React"
      "version": "detect",
      "flowVersion": "0.109.0",
    },
    "propWrapperFunctions": [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        "forbidExtraProps",
        {"property": "freeze", "object": "Object"},
        {"property": "myFavoriteWrapper"},
    ],
    "linkComponents": [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      {"name": "Link", "linkAttribute": "to"},
    ],
  },
};
