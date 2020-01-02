const path = require("path");

module.exports = {
	root: true,
	parserOptions: {
		parser: "babel-eslint",
		sourceType: "module"
	},
	extends: ["airbnb-base", "plugin:vue/recommended"],
	rules: {
		"linebreak-style": "off",
		"vue/max-attributes-per-line": "off",
		"max-len": [
			"error",
			{
				ignoreComments: true,
				code: 120,
				ignorePattern: "^\\s{2,}[\\w-]+: .+\\/\\/.*$" // ignore comments in sass
			}
		],
		"no-plusplus": "off",
		"object-curly-newline": "off",
		"vue/singleline-html-element-content-newline": "off",
		"no-use-before-define": ["error", { functions: false, classes: false }],
		"no-param-reassign": "off",
		"no-restricted-syntax": [
			"error",
			"ForInStatement",
			"LabeledStatement",
			"WithStatement"
		],
		"no-nested-ternary": "off",
		indent: ["error", 2, { SwitchCase: 1, flatTernaryExpressions: true }],
		radix: "off"
	},
	settings: {
		"import/resolver": {
			alias: [
				// the following are from the alias section in webpack.config.js
				["src", path.resolve(__dirname, "src")], // allows you to reference src directly from anywhere (e.g. import {} from 'src/js/file')
				["common", path.resolve(__dirname, "src/components/common")] // easy access to common components
			]
		}
	}
};
