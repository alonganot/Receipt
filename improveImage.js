import jimp from "jimp";

const RED_LUMINANCE = 0.2126;
const GREEN_LUMINANCE = 0.7153;
const BLUE_LUMINANCE = 0.0722;

const LUMINANCE_LIMIT = 65;

const BLACK = jimp.rgbaToInt(0, 0, 0, 255);
const WHITE = jimp.rgbaToInt(255, 255, 255, 255);

export const improveImage = async (name) => {
  jimp.read(`./receipts/${name}.png`, async (err, image) => {
    if (err) {
      throw err;
    } else {
      let grayscaleImage = image.grayscale();
      await image.writeAsync(`./receipts/grayscale/${name}GS.png`);

      grayscaleImage.scan(
        0,
        0,
        grayscaleImage.bitmap.width,
        grayscaleImage.bitmap.height,
        (x, y) => {
          const pixelColor = jimp.intToRGBA(grayscaleImage.getPixelColor(x, y));
          const luminance =
            pixelColor.r * RED_LUMINANCE +
            pixelColor.b * BLUE_LUMINANCE +
            pixelColor.g * GREEN_LUMINANCE;
          const newColor = luminance < LUMINANCE_LIMIT ? BLACK : WHITE;
          image.setPixelColor(newColor, x, y);
        }
      );

      await image.writeAsync(`./receipts/blackandwhite/${name}BW.png`);
    }
  });
};
