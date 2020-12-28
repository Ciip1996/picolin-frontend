import jsPDF from 'jspdf';
import { MontserratRegular, MontserratBold } from 'UI/res/fonts';
import { currencyFormatter, getFeatureFlags } from 'UI/utils';
import { FeatureFlags } from 'UI/constants/featureFlags';

const featureFlags = getFeatureFlags();

const generateTicket = sale => {
  const leftMargin = 5;
  const rightMargin = 60;
  const textColor = 50;
  const baseHeight = 160;
  const productsHeight = sale?.detail?.length * 12;
  // eslint-disable-next-line new-cap
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, productsHeight + baseHeight]
  });

  let linePosition = 25;
  // add custom font
  doc.addFileToVFS('Montserrat-Regular-normal.ttf', MontserratRegular);
  doc.addFont('Montserrat-Regular-normal.ttf', 'Montserrat-Regular', 'normal');

  doc.addFileToVFS('Montserrat-Bold-bold.ttf', MontserratBold);
  doc.addFont('Montserrat-Bold-bold.ttf', 'Montserrat-Bold', 'bold');

  // For implementing an image does not work tho:
  // const myImage = new Image();
  // myImage.src = 'https://cdn.logo.com/hotlink-ok/logo-social.png';
  // myImage.onload = () => {
  //   doc.addImage(myImage, 'png', 2, 2, 4, 4);

  // doc.addImage('UI/res/images/picolin.png', 'PNG', 4, 4);
  // Set Header
  doc.setFont('Montserrat-Bold', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(textColor);
  doc.text('PICOLIN STORE®', leftMargin, linePosition);
  doc.setFontSize(8);
  doc.setFont('Montserrat-Regular', 'normal');

  // doc.setFont('times', 'italic');
  linePosition += 5;
  doc.text('wwww.picolin.com.mx', leftMargin, linePosition);
  linePosition += 5;
  doc.text('Sucursal: Centro', leftMargin, linePosition);
  linePosition += 5;
  doc.text('Pasaje Colón 115, Centro, 37000 León, Gto.', leftMargin, linePosition);
  linePosition += 5;
  doc.text(`Fecha: 11/05/1996`, leftMargin, linePosition);
  linePosition += 5;
  doc.setFont('Montserrat-Bold', 'bold');
  doc.text(`Folio de Venta: #12411`, leftMargin, linePosition);
  doc.setFont('Montserrat-Regular', 'normal');
  linePosition += 7;

  // Set Body
  doc.setFontSize(10);
  doc.text('---------------------------------------------------', leftMargin, linePosition);
  linePosition += 5;

  doc.setFont('Montserrat-Bold', 'bold');
  doc.text('PRODUCTOS:', leftMargin, linePosition);
  doc.setFont('Montserrat-Regular', 'normal');
  linePosition += 7;

  sale?.detail &&
    sale.detail.forEach((each, index) => {
      doc.text(`Art.#${index + 1}: ${each?.productCode}`, leftMargin, linePosition);
      doc.text(
        `${each?.type} ${each?.characteristic} ${each?.color}`,
        leftMargin,
        linePosition + 5
      );
      doc.text(`${currencyFormatter(each?.salePrice)}`, 60, linePosition);
      linePosition += 12;
    });

  doc.text('---------------------------------------------------', leftMargin, linePosition);
  linePosition += 5;

  doc.text(`Metodo de Pago: `, leftMargin, linePosition);
  doc.text(`${sale?.sale?.paymentMethod}`, rightMargin, linePosition);
  linePosition += 5;
  doc.text(`Subtotal: `, leftMargin, linePosition);
  doc.text(`${currencyFormatter(sale?.sale?.subtotal)}`, rightMargin, linePosition);
  linePosition += 5;
  if (featureFlags.includes(FeatureFlags.Taxes)) {
    doc.text(`IVA: `, leftMargin, linePosition);
    doc.text(`${currencyFormatter(sale?.sale?.iva)}`, rightMargin, linePosition);
    linePosition += 5;
  }
  doc.text(`Descuento: `, leftMargin, linePosition);
  doc.text(`-`, rightMargin - 1, linePosition);
  doc.text(`${currencyFormatter(sale?.sale?.discount)}`, rightMargin, linePosition);
  linePosition += 5;

  doc.setFont('Montserrat-Bold', 'bold');
  doc.text(`Total: `, leftMargin, linePosition);
  doc.text(`${currencyFormatter(sale?.sale?.total)}`, rightMargin, linePosition);
  doc.setFont('Montserrat-Regular', 'normal');
  linePosition += 10;

  doc.text(`Recibido: `, leftMargin, linePosition);
  doc.text(`${currencyFormatter(sale?.sale?.received)}`, rightMargin, linePosition);
  linePosition += 5;

  doc.text(`Cambio: `, leftMargin, linePosition);
  doc.text(
    `${currencyFormatter(sale?.sale?.received - sale?.sale?.total)}`,
    rightMargin,
    linePosition
  );

  // Set Footer
  linePosition += 10;
  doc.text('---------------------------------------------------', leftMargin, linePosition);
  linePosition += 5;
  doc.text(`Fecha de Impresión: 11/30/2020 12:44 `, leftMargin, linePosition);
  linePosition += 5;
  doc.setFont('Montserrat-Bold', 'bold');
  doc.text(`Número de Articulos Vendidos: ${sale.detail.length}`, leftMargin, linePosition);
  linePosition += 10;
  doc.setFontSize(9);
  doc.text(`¡Picolin agradece su compra, vuelva pronto!`, leftMargin, linePosition);
  doc.setFont('Montserrat-Regular', 'normal');

  linePosition += 5;
  doc.setFontSize(7);
  doc.text(`Una vez salida la mercancía de la tienda, `, leftMargin, linePosition);
  linePosition += 5;
  doc.text(`no se aceptarán devoluciones.`, leftMargin, linePosition);
  return doc;
};

export const downloadTicketPDF = (sale, ticketTitle) => {
  const doc = generateTicket(sale);
  doc.save(ticketTitle);
  return doc;
};

export const getTicketBlob = sale => {
  const doc = generateTicket(sale);
  const blob = new Blob([doc.output()], { type: 'application/pdf' });
  // create an object URL from the Blob
  const URL = window.URL || window.webkitURL;
  const downloadUrl = URL.createObjectURL(blob);
  return downloadUrl;
};
