import Noty from 'noty';

import {
  DESCRIPTION_BG_COLOR,
  DESCRIPTION_BG_THRESHOLD_MIN,
  DESCRIPTION_BG_THRESHOLD_MAX,
  DESCRIPTION_BG_PADDING,

  DESCRIPTION_FONT_COLOR,
  REQUIRED_BLACKBOX_MATCHES_COLUMN_IN_ROW,
  REQUIRED_BLACKBOX_MATCHES_LINE_IN_ROW,
  REQUIRED_DESCRIPTION_FONT_MATCHES_IN_ROW,
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

const matchColor = (pixel, expected, thresholdMin = 0, thresholdMax = 0) => 
    (pixel[0] - thresholdMin <= expected[0] && pixel[0] + thresholdMax >= expected[0])
    && (pixel[1] - thresholdMin <= expected[1] && pixel[1] + thresholdMax >= expected[1])
    && (pixel[2] - thresholdMin <= expected[2] && pixel[2] + thresholdMax >= expected[2]);

const findS = (ctx, image, curTry = 0) => {
  const matchFontColor = DESCRIPTION_FONT_COLOR[curTry];
  let matchInitPos;
  let matchEndPos;
  let matchPixel;

  for (let line = 0; line < image.height; line++) {
    for (let column = 0; column < image.width; column++) {
      for (let matches = 0; matches < REQUIRED_DESCRIPTION_FONT_MATCHES_IN_ROW; matches++) {
        const imageData = ctx.getImageData(column + matches, line + matches, 1, 1);

        // console.log(imageData.data);

        if (
          matchColor(
            imageData.data, 
            matchFontColor.color,
            matchFontColor.thresholdMin,
            matchFontColor.thresholdMax
          )
        ) {
          if (!matchPixel) {
            matchPixel = [column, line];  
          }
        } else {
          matchPixel = null;
          break;
        }
      }

      if (matchPixel) {
        const initialColumn = matchPixel[0] - 50;
        let gotCorrectLetter = true;

        for (let blackBoxLineMatches = 0; blackBoxLineMatches < REQUIRED_BLACKBOX_MATCHES_LINE_IN_ROW; blackBoxLineMatches++) {
          const line = matchPixel[1] + (blackBoxLineMatches * 20);

          for (let blackBoxColumnMatches = 0; blackBoxColumnMatches < REQUIRED_BLACKBOX_MATCHES_COLUMN_IN_ROW; blackBoxColumnMatches++) {
            const blackBoxPixel = ctx.getImageData(initialColumn + blackBoxColumnMatches, line, 1, 1);

            if (
              !matchColor(
                blackBoxPixel.data,
                DESCRIPTION_BG_COLOR[0],
                DESCRIPTION_BG_THRESHOLD_MIN,
                DESCRIPTION_BG_THRESHOLD_MAX
              )
            ) {
              gotCorrectLetter = false;
              break;
            }
          }
        }

        if (gotCorrectLetter) {
          break;
        } else {
          matchPixel = null;
        }
      }
    }

    if (matchPixel) {
      break;
    }
  }

  if (!matchPixel) {
    if (++curTry < DESCRIPTION_FONT_COLOR.length) {
      return findS(ctx, image, curTry);
    }

    return null;
  }

  return [matchPixel[0] - 5, matchPixel[1] - 5];
};

const findDescriptionBoundaries = (ctx, image, SPosition) => {
  let initLine;
  let endLine;
  let initColumn;
  let endColumn;

  const maxBoundaryInitColumn = (SPosition[0] - 250) >= 0 ? SPosition[0] - 250 : 0;
  const maxBoundaryInitLine = (SPosition[1] - 30) >= 0 ? SPosition[1] - 30 : 0;

  // console.log(SPosition);

  /* Init Column */
  for (let column = SPosition[0]; column >= maxBoundaryInitColumn; column--) {
    const imageData = ctx.getImageData(column, SPosition[1], 1, 1);

    // console.log(column, SPosition[1], imageData.data);

    if (
      matchColor(
        imageData.data,
        DESCRIPTION_BG_COLOR[0],
        DESCRIPTION_BG_THRESHOLD_MIN,
        DESCRIPTION_BG_THRESHOLD_MAX
      )
    ) {
      initColumn = column;
    } else {
      break;
    }
  }

  if (initColumn === undefined) {
    return null;
  }

  /* Init Line */
  for (let line = SPosition[1]; line >= maxBoundaryInitLine; line--) {
    const imageData = ctx.getImageData(initColumn, line, 1, 1);

    if (
      matchColor(
        imageData.data, 
        DESCRIPTION_BG_COLOR[0],
        DESCRIPTION_BG_THRESHOLD_MIN,
        DESCRIPTION_BG_THRESHOLD_MAX
      )
    ) {
      initLine = line;
    } else {
      break;
    }
  }

  if (initLine === undefined) {
    return null;
  }

  /* End Line */
  for (let line = SPosition[1]; line <= image.height; line++) {
    const imageData = ctx.getImageData(initColumn, line, 1, 1);

    if (
      matchColor(
        imageData.data, 
        DESCRIPTION_BG_COLOR[0],
        DESCRIPTION_BG_THRESHOLD_MIN,
        DESCRIPTION_BG_THRESHOLD_MAX
      )
    ) {
      endLine = line;
    } else {
      break;
    }
  }

  if (endLine === undefined) {
    return null;
  }

  /* End Column */
  for (let column = SPosition[0]; column < image.width; column++) {
    const imageData = ctx.getImageData(column, initLine, 1, 1);

    if (
      matchColor(
        imageData.data, 
        DESCRIPTION_BG_COLOR[0],
        DESCRIPTION_BG_THRESHOLD_MIN,
        DESCRIPTION_BG_THRESHOLD_MAX
      )
    ) {
      endColumn = column;
    } else {
      break;
    }
  }

  if (endColumn === undefined) {
    return null;
  }

  // console.log(initColumn, endColumn, initLine, endLine);

  return {
    imageData: ctx.getImageData(
      initColumn,
      initLine + DESCRIPTION_BG_PADDING,
      endColumn - initColumn,
      endLine - initLine - DESCRIPTION_BG_PADDING,
    ),
    initLine,
    endLine,
    initColumn,
    endColumn,
  };
};

const debugDrawAreas = (canvas, SPosition, image) => {
  const ctx = canvas.getContext('2d');

  canvas.height = image.height;
  canvas.width = image.width;      
  ctx.drawImage(image, 0, 0);

  ctx.fillStyle = 'blue';
  ctx.fillRect(SPosition[0] - 1, SPosition[1] - 1, 3, 3);
  ctx.fillStyle = 'yellow';
  ctx.fillRect(SPosition[0], SPosition[1], 1, 1);

  ctx.fillStyle = 'green';
  ctx.fillRect(SPosition[0] + 4, SPosition[1] + 4, 3, 3);
  ctx.fillStyle = 'yellow';
  ctx.fillRect(SPosition[0] + 5, SPosition[1] + 5, 1, 1);
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

      const SPosition = findS(virtualCtx, image);
      const { imageData: descriptionImageData } = findDescriptionBoundaries(virtualCtx, image, SPosition);

      // debugDrawAreas(canvas, SPosition, image);

      canvas.height = descriptionImageData.height;
      canvas.width = descriptionImageData.width;

      ctx.putImageData(descriptionImageData, 0, 0);

      setLoading(false);
    };

    reader.readAsDataURL(blob);
  } catch (e) {
    setLoading(false);
    console.error(e);
  }
});