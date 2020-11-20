const BABEL_ENV = process.env.BABEL_ENV || process.env.NODE_ENV;

const defaultPlugins = [];

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        targets: {
          node: "current",
          browsers:
            process.env.NODE_ENV === "production"
              ? [">0.2%", "not dead", "not IE 11", "not op_mini all"]
              : [
                  "last 1 chrome version",
                  "last 1 firefox version",
                  "last 1 safari version",
                ],
        },
      },
    ],
    "@babel/preset-react",
  ],
  env: {
    es: {
      plugins: defaultPlugins,
      ignore: ["test/**/*.js"],
    },
    test: {
      plugins: defaultPlugins,
      ignore: [],
    },
  },
};
