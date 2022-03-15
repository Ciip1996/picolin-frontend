import jsPDF from 'jspdf';
import { RobotoMonoRegular, RobotoMonoBold } from 'UI/res/fonts';
import { currencyFormatter } from 'UI/utils';

const MAX_FONT_SIZE_PERMITTED = 14;

const getMaxFontSize = fontSize => {
  return parseInt(fontSize, 10) > MAX_FONT_SIZE_PERMITTED
    ? MAX_FONT_SIZE_PERMITTED
    : fontSize;
};

function resizeImage(base64Str, maxWidth = 500, maxHeight = 500) {
  // TODO: resize with better resolution
  return new Promise(resolve => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = maxWidth;
      const MAX_HEIGHT = maxHeight;
      let { width } = img;
      let { height } = img;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL());
    };
  });
}

export const generateTagQR = (
  canvas,
  productCode,
  productDescription,
  productPrize = '--',
  customFontSize
) => {
  const imgData = canvas.toDataURL('image/png');
  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [65, 45]
  });

  pdfDoc.addFileToVFS('RobotoMono-Regular-normal.ttf', RobotoMonoRegular);
  pdfDoc.addFileToVFS('RobotoMono-Bold-normal.ttf', RobotoMonoBold);
  pdfDoc.addFont(
    'RobotoMono-Regular-normal.ttf',
    'RobotoMono-Regular',
    'normal'
  );
  pdfDoc.addFont('RobotoMono-Bold-normal.ttf', 'RobotoMono-Bold', 'normal');

  const QRCodeImageSize = 86;

  const leftMargin = 5;
  const baseTopMargin = 5;

  const textleftMargin = 32;

  let bodyTopMargin = baseTopMargin + 5;

  const headerTextWrappingWidth = 56;
  const bodyTextWrappingWidth = 32;

  resizeImage(imgData, QRCodeImageSize, QRCodeImageSize).then(resizedImage => {
    pdfDoc.setFont('RobotoMono-Regular', 'normal');
    pdfDoc.setFontSize(getMaxFontSize(customFontSize));
    const splittedProductCode = pdfDoc.splitTextToSize(
      `CÓDIGO: ${productCode}`,
      headerTextWrappingWidth
    );
    pdfDoc.text(leftMargin, baseTopMargin, splittedProductCode);

    pdfDoc.setFontSize(getMaxFontSize(parseInt(customFontSize, 10) + 4)); // add 4 size points to price
    pdfDoc.setFont('RobotoMono-Bold', 'normal'); // set bold font weight
    pdfDoc.text(
      `${currencyFormatter(productPrize)}`,
      textleftMargin,
      (bodyTopMargin += 3)
    );
    pdfDoc.setFontSize(getMaxFontSize(customFontSize)); // restore regular size
    pdfDoc.setFont('RobotoMono-Regular', 'normal'); // restore regular font weight

    const splittedDescription = pdfDoc.splitTextToSize(
      productDescription.toUpperCase(),
      bodyTextWrappingWidth
    );
    pdfDoc.text(textleftMargin, (bodyTopMargin += 5), splittedDescription);

    pdfDoc.addImage(resizedImage, 'PNG', leftMargin, baseTopMargin + 5);
    pdfDoc.save(`${productCode}.pdf`);
  });
};
