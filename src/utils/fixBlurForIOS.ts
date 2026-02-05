// utils/lottieBlurFixer.js

const fixBlurForIOS = (lottieJson, targetBlurValue = 80) => {
  const jsonCopy = JSON.parse(JSON.stringify(lottieJson));

  const fixBlurInLayer = layer => {
    if (layer.ef) {
      layer.ef.forEach(effect => {
        if (effect.mn === 'ADBE Gaussian Blur 2') {
          effect.ef.forEach(prop => {
            if (
              prop.mn === 'ADBE Gaussian Blur 2-0001' &&
              prop.nm === 'Blurriness'
            ) {
              console.log(
                `Changing blur from ${prop.v.k} to ${targetBlurValue}`,
              );
              prop.v.k = targetBlurValue;
            }
          });
        }
      });
    }
  };

  if (jsonCopy.layers) {
    jsonCopy.layers.forEach(fixBlurInLayer);
  }

  return jsonCopy;
};

export default fixBlurForIOS;
