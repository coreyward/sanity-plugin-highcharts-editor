module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      "@babel/preset-react",
      [
        "@babel/preset-env",
        {
          useBuiltIns: "entry",
          targets: ["last 1 version", "> 1%"]
        }
      ]
    ],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "react-hot-loader/babel"
    ]
  };
};
