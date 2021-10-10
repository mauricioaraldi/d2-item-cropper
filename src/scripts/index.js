import Noty from 'noty';

import { COLOR_THRESHOLD, SELECT_ITEM_BACKPACK_BG } from './constants';

import '../styles/index.css';

Noty.overrideDefaults({
  layout: 'center',
  theme: 'metroui',
  timeout: 3000,
});

const setLoading = state => {
  if (state) {
    document.querySelector('body').classList.add('loading');
  } else if (state === false) {
    document.querySelector('body').classList.remove('loading');
  } else {
    document.querySelector('body').classList.toggle('loading');
  }
};

const getLoading = () => document.querySelector('body').classList.contains('loading');

const findItemDescription = (ctx, image) => {
  let matchInitPos;
  let matchEndPos;

  for (let line = 0; line < image.height; line++) {
    for (let column = 0; column < image.width; column++) {
      const imageData = ctx.getImageData(column, line, 1, 1);

      if (
        (
          imageData.data[0] - COLOR_THRESHOLD < SELECT_ITEM_BACKPACK_BG[0]
          && imageData.data[0] + COLOR_THRESHOLD > SELECT_ITEM_BACKPACK_BG[0]
        )
        && (
          imageData.data[1] - COLOR_THRESHOLD < SELECT_ITEM_BACKPACK_BG[1]
          && imageData.data[1] + COLOR_THRESHOLD > SELECT_ITEM_BACKPACK_BG[1]
        )
        && (
          imageData.data[2] - COLOR_THRESHOLD < SELECT_ITEM_BACKPACK_BG[2]
          && imageData.data[2] + COLOR_THRESHOLD > SELECT_ITEM_BACKPACK_BG[2]
        )
      ) {
        if (!matchInitPos) {
          matchInitPos = [column, line];
        } else {
          matchEndPos = [column, line];
        }
      }
    }
  }

  setLoading(false);

  return ctx.getImageData(
    matchInitPos[0], 
    matchInitPos[1], 
    matchEndPos[0] - matchInitPos[0], 
    matchEndPos[1] - matchInitPos[1],
  );
};

document.addEventListener('paste', event => {
  event.preventDefault();

  if (getLoading()) {
    return;
  }

  try {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const virtualCanvas = document.createElement('canvas');
    const virtualCtx = virtualCanvas.getContext('2d');

    setLoading(true);

    const { items } = event.clipboardData;
    const blob = Array.from(items).find(item => item.type.includes('image'))?.getAsFile();
    const reader = new FileReader();
    const image = new Image();

    reader.onload = event => {
      image.src = event.target.result;
    };

    image.onload = event => {
      virtualCanvas.height = image.height;
      virtualCanvas.width = image.width;
      virtualCtx.drawImage(image, 0, 0);

      const imageData = findItemDescription(virtualCtx, image);

      canvas.height = imageData.height;
      canvas.width = imageData.width;

      ctx.putImageData(imageData, 0, 0);
    };

    reader.readAsDataURL(blob);
  } catch (e) {
    setLoading(false);
  }
});