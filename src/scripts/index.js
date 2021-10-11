import Noty from 'noty';

import {
  ITEM_DESCRIPTION_BG,
  ITEM_DESCRIPTION_COLOR_THRESHOLD_MIN,
  ITEM_DESCRIPTION_COLOR_THRESHOLD_MAX,
  REQUIRED_ITEM_DESCRIPTION_MATCHES_IN_ROW,
  REQUIRED_SELECTED_ITEM_MATCHES_IN_ROW,
  SELECTED_ITEM_BACKPACK_BG_1,
  SELECTED_ITEM_BACKPACK_BG_2,
  SELECTED_ITEM_COLOR_THRESHOLD_MAX,
  SELECTED_ITEM_COLOR_THRESHOLD_MIN,
} from './constants';

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

const findItem = (ctx, image, curTry = 0) => {
  const possibleMatchColors = [SELECTED_ITEM_BACKPACK_BG_1, SELECTED_ITEM_BACKPACK_BG_2];
  const matchColor = possibleMatchColors[curTry];
  let matches = 0;
  let matchInitPos;
  let matchEndPos;

  for (let line = 0; line < image.height; line++) {
    for (let column = 0; column < image.width; column++) {
      const imageData = ctx.getImageData(column, line, 1, 1);

      if (
        (
          imageData.data[0] - SELECTED_ITEM_COLOR_THRESHOLD_MIN < matchColor[0]
          && imageData.data[0] + SELECTED_ITEM_COLOR_THRESHOLD_MAX > matchColor[0]
        )
        && (
          imageData.data[1] - SELECTED_ITEM_COLOR_THRESHOLD_MIN < matchColor[1]
          && imageData.data[1] + SELECTED_ITEM_COLOR_THRESHOLD_MAX > matchColor[1]
        )
        && (
          imageData.data[2] - SELECTED_ITEM_COLOR_THRESHOLD_MIN < matchColor[2]
          && imageData.data[2] + SELECTED_ITEM_COLOR_THRESHOLD_MAX > matchColor[2]
        )
      ) {
        if (!matchInitPos) {
          matchInitPos = [column, line];
        } else {
          matchEndPos = [column, line];
        }

        matches++;

        continue;
      }

      if (matches < REQUIRED_SELECTED_ITEM_MATCHES_IN_ROW) {
        matches = 0;
        matchInitPos = null;
        matchEndPos = null;
      }
    }
  }

  if (!matchInitPos) {
    if (++curTry < possibleMatchColors.length) {
      return findItem(ctx, image, curTry);
    }

    return null;
  }

  return {
    imageData: ctx.getImageData(
      matchInitPos[0],
      matchInitPos[1],
      matchEndPos[0] - matchInitPos[0],
      matchEndPos[1] - matchInitPos[1],
    ),
    initPos: matchInitPos,
    endPos: matchEndPos,
  };
};

const findItemDescription = (ctx, image, itemInitPos) => {
  let matches = 0;
  let initLine;
  let endLine;
  let initColumn;
  let endColumn;

  for (let line = itemInitPos[1]; line > 0; line--) {
    const imageData = ctx.getImageData(itemInitPos[0], line, 1, 1);

    if (
      (
        imageData.data[0] - ITEM_DESCRIPTION_COLOR_THRESHOLD_MIN < ITEM_DESCRIPTION_BG[0]
        && imageData.data[0] + ITEM_DESCRIPTION_COLOR_THRESHOLD_MAX > ITEM_DESCRIPTION_BG[0]
      )
      && (
        imageData.data[1] - ITEM_DESCRIPTION_COLOR_THRESHOLD_MIN < ITEM_DESCRIPTION_BG[1]
        && imageData.data[1] + ITEM_DESCRIPTION_COLOR_THRESHOLD_MAX > ITEM_DESCRIPTION_BG[1]
      )
      && (
        imageData.data[2] - ITEM_DESCRIPTION_COLOR_THRESHOLD_MIN < ITEM_DESCRIPTION_BG[2]
        && imageData.data[2] + ITEM_DESCRIPTION_COLOR_THRESHOLD_MAX > ITEM_DESCRIPTION_BG[2]
      )
    ) {
      if (!endLine) {
        endLine = line;
      } else {
        initLine = line;
      }

      matches++;

      continue;
    }

    if (matches < REQUIRED_ITEM_DESCRIPTION_MATCHES_IN_ROW) {
      matches = 0;
      initLine = null;
      endLine = null;
    }
  }

  if (!initLine) {
    return null;
  }

  for (let column = itemInitPos[0] - 250; column < image.width; column++) {
    const imageData = ctx.getImageData(column, initLine, 1, 1);

    if (
      (
        imageData.data[0] - ITEM_DESCRIPTION_COLOR_THRESHOLD_MIN < ITEM_DESCRIPTION_BG[0]
        && imageData.data[0] + ITEM_DESCRIPTION_COLOR_THRESHOLD_MAX > ITEM_DESCRIPTION_BG[0]
      )
      && (
        imageData.data[1] - ITEM_DESCRIPTION_COLOR_THRESHOLD_MIN < ITEM_DESCRIPTION_BG[1]
        && imageData.data[1] + ITEM_DESCRIPTION_COLOR_THRESHOLD_MAX > ITEM_DESCRIPTION_BG[1]
      )
      && (
        imageData.data[2] - ITEM_DESCRIPTION_COLOR_THRESHOLD_MIN < ITEM_DESCRIPTION_BG[2]
        && imageData.data[2] + ITEM_DESCRIPTION_COLOR_THRESHOLD_MAX > ITEM_DESCRIPTION_BG[2]
      )
    ) {
      if (!initColumn) {
        initColumn = column;
      } else {
        endColumn = column;
      }

      matches++;

      continue;
    }

    if (matches < REQUIRED_ITEM_DESCRIPTION_MATCHES_IN_ROW) {
      matches = 0;
      initColumn = null;
      endColumn = null;
    }
  }

  return {
    imageData: ctx.getImageData(
      initColumn,
      initLine,
      endColumn - initColumn,
      endLine - initLine
    ),
    initPos: [initColumn, initLine],
    endPos: [endColumn, endLine],
  };
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

      const { imageData: itemImageData, initPos: itemInitPos } = findItem(virtualCtx, image);

      if (!itemImageData) {
        setLoading(false);
        alert('Not possible to find item');
        return;
      }

      const { imageData: descriptionImageData } = findItemDescription(virtualCtx, image, itemInitPos);

      canvas.height = descriptionImageData.height + itemImageData.height;
      canvas.width = descriptionImageData.width + itemImageData.width;

      ctx.putImageData(descriptionImageData, 0, 0);
      ctx.putImageData(
        itemImageData,
        (descriptionImageData.width / 2) - (itemImageData.width / 2),
        descriptionImageData.height
      );

      setLoading(false);
    };

    reader.readAsDataURL(blob);
  } catch (e) {
    setLoading(false);
    console.error(e);
  }
});