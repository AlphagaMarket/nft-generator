const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);

const namePrefix = "Example";
const description = "example description";
const baseUri = "https://arweave.net/replace_by_your_data_tx_id";

const layerConfigurations = [
  {
    growEditionSizeTo: 55,
    layersOrder: [
      { name: "Background" },
      { name: "Head" },
      { name: "Mouth" },
      { name: "Hand" },
      { name: "Eyes" },
      { name: "Glasses" },
      { name: "Hat" },
    ],
  },
];

const shuffleLayerConfigurations = false;

const debugLogs = false;

const format = {
  width: 500,
  height: 500,
  smoothing: false,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const background = {
  generate: true,
  brightness: "100%",
  static: false,
  default: "#000000",
};

const extraMetadata = {};

const rarityDelimiter = "#";

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 25,
  order: "ASC",
  repeat: 0,
  quality: 100,
  delay: 250,
  imageName: "preview.gif",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  namePrefix,
  gif,
  preview_gif,
};
