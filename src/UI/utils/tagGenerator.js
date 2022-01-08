import jsPDF from 'jspdf';
import { SourceSansPro } from 'UI/res/fonts';

function resizeImage(base64Str, maxWidth = 300, maxHeight = 300) {
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
  customFontSize
) => {
  const imgData = canvas.toDataURL('image/png');
  // eslint-disable-next-line new-cap
  const pdfDoc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [65, 45]
  });

  pdfDoc.addFileToVFS('SourceSansPro-Regular-normal.ttf', SourceSansPro);
  pdfDoc.addFont(
    'SourceSansPro-Regular-normal.ttf',
    'SourceSansPro-Regular',
    'normal'
  );

  const QRCodeImageSize = 110;
  const textleftMargin = 35;
  const qrCodeLeftMargin = 3;
  const topMargin = 5;
  const textWrappingWidth = 25;

  resizeImage(imgData, QRCodeImageSize, QRCodeImageSize).then(resizedImage => {
    pdfDoc.setFont('SourceSansPro-Regular', 'normal');
    pdfDoc.setFontSize(customFontSize);
    pdfDoc.text(`@&^* Código de Producto:`, textleftMargin, topMargin + 3);
    pdfDoc.text(`${productCode}`, textleftMargin, topMargin + 6);

    const splitTitle = pdfDoc.splitTextToSize(
      productDescription,
      textWrappingWidth
    );
    pdfDoc.text(textleftMargin, topMargin + 14, splitTitle);
    pdfDoc.addImage(resizedImage, 'PNG', qrCodeLeftMargin, topMargin);
    pdfDoc.save(`${productCode}.pdf`);
  });
};
