import jsPDF from 'jspdf';
import { MontserratRegular, MontserratBold, RobotoMonoRegular, RobotoMonoBold } from 'UI/res/fonts';
import { currencyFormatter, getFeatureFlags } from 'UI/utils';
import { FeatureFlags } from 'UI/constants/featureFlags';
import moment from 'moment';
import { DateFormats } from 'UI/constants/defaults';

const featureFlags = getFeatureFlags();

const generateTicket = sale => {
  const leftMargin = 5;
  const rightMargin = 60;
  const textColor = 50;
  const baseHeight = 180;
  const productsHeight = sale?.detail?.length * 12;
  const smallTextSize = 8;
  const textSize = 9;
  const headerTextSize = 20;
  const separator = '---------------------------------';
  // eslint-disable-next-line new-cap
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, productsHeight + baseHeight]
  });

  let linePosition = 20;
  // add custom font
  doc.addFileToVFS('Montserrat-Regular-normal.ttf', MontserratRegular);
  doc.addFont('Montserrat-Regular-normal.ttf', 'Montserrat-Regular', 'normal');

  doc.addFileToVFS('Montserrat-Bold-bold.ttf', MontserratBold);
  doc.addFont('Montserrat-Bold-bold.ttf', 'Montserrat-Bold', 'bold');

  doc.addFileToVFS('RobotoMono-VariableFont_wght-normal.ttf', RobotoMonoRegular);
  doc.addFont('RobotoMono-VariableFont_wght-normal.ttf', 'RobotoMono-VariableFont_wght', 'normal');

  doc.addFileToVFS('RobotoMono-Bold-bold.ttf', RobotoMonoBold);
  doc.addFont('RobotoMono-Bold-bold.ttf', 'RobotoMono-Bold', 'bold');

  // Set Header

  doc.setFont('Montserrat-Bold', 'bold');
  doc.setFontSize(headerTextSize);
  doc.setTextColor(textColor);
  doc.text('PICOLIN STORE®', leftMargin, linePosition);
  doc.setFontSize(smallTextSize);
  doc.setFont('RobotoMono-VariableFont_wght', 'normal');

  // doc.setFont('times', 'italic');
  linePosition += 5;
  doc.text('wwww.picolin.com.mx', leftMargin, linePosition);
  linePosition += 5;
  doc.text('Sucursal: Centro', leftMargin, linePosition);
  linePosition += 5;
  doc.text('Pasaje Colón 115, Centro, 37000 León, Gto.', leftMargin, linePosition);
  linePosition += 5;
  doc.setFont('RobotoMono-Bold', 'bold');
  doc.text(`Ticket Nº: ${sale?.sale?.ticket}`, leftMargin, linePosition);
  doc.setFont('RobotoMono-VariableFont_wght', 'normal');

  linePosition += 5;
  doc.text(
    `Fecha: ${moment(sale?.sale?.date).format(DateFormats.International.DetailDateTime)}`,
    leftMargin,
    linePosition
  );
  linePosition += 5;
  doc.text(`ID: ${sale?.sale?.idSale}`, leftMargin, linePosition);
  linePosition += 7;

  // Set Body
  doc.setFontSize(textSize);
  doc.text(separator, leftMargin, linePosition);
  linePosition += 5;

  doc.setFont('RobotoMono-Bold', 'bold');
  doc.text('PRODUCTOS:', leftMargin, linePosition);
  doc.setFont('RobotoMono-VariableFont_wght', 'normal');
  linePosition += 7;

  sale?.detail &&
    sale.detail.forEach((each, index) => {
      doc.text(`Art.#${index + 1}: ${each?.productCode}`, leftMargin, linePosition);
      doc.text(
        `${each?.type} ${each?.characteristic} ${each?.color}`,
        leftMargin,
        linePosition + 5
      );
      doc.text(
        !each.combo ? `${currencyFormatter(each?.salePrice)}` : 'paquete',
        rightMargin,
        linePosition
      );
      linePosition += 12;
    });
  // print the combos n times with the default price
  for (let i = 0; i < sale?.sale?.combos; i += 1) {
    doc.text(`Paquete Bauticen: `, leftMargin, linePosition);
    doc.text(`${currencyFormatter(800)}`, rightMargin, linePosition);
    linePosition += 7;
  }

  doc.text(separator, leftMargin, linePosition);
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

  doc.setFont('RobotoMono-Bold', 'bold');
  doc.text(`Total: `, leftMargin, linePosition);
  doc.text(`${currencyFormatter(sale?.sale?.total)}`, rightMargin, linePosition);
  doc.setFont('RobotoMono-VariableFont_wght', 'normal');
  linePosition += 10;

  doc.text(`Recibido: `, leftMargin, linePosition);
  doc.text(`${currencyFormatter(sale?.sale?.received)}`, rightMargin, linePosition);
  linePosition += 5;

  doc.text(`Cambio: `, leftMargin, linePosition);
  doc.text(
    `${currencyFormatter(
      sale?.sale?.paymentMethod === 'Tarjeta' ? 0.0 : sale?.sale?.received - sale?.sale?.total
    )}`,
    rightMargin,
    linePosition
  );

  // Set Footer
  linePosition += 10;
  doc.text(separator, leftMargin, linePosition);
  linePosition += 5;

  doc.text(
    `Fecha de Impresión: ${moment(Date.now()).format(DateFormats.International.SimpleDateTime)} `,
    leftMargin,
    linePosition
  );
  linePosition += 5;

  doc.setFont('RobotoMono-Bold', 'bold');
  doc.text(`Articulos Vendidos: ${sale.detail.length}`, leftMargin, linePosition);
  linePosition += 10;
  doc.setFontSize(smallTextSize);
  doc.text(`¡Picolin agradece su compra, vuelva pronto!`, leftMargin, linePosition);
  doc.setFont('RobotoMono-VariableFont_wght', 'normal');

  linePosition += 5;
  doc.text(`Una vez salida la mercancía de la tienda, `, leftMargin, linePosition);
  linePosition += 5;
  doc.text(`no se aceptarán devoluciones.`, leftMargin, linePosition);
  //   doc.autoPrint();
  //   doc.output('dataurlnewwindow');

  return doc;
};

export const downloadTicketPDF = (sale, ticketTitle) => {
  const doc = generateTicket(sale);
  doc.save(ticketTitle);
  return doc;
};

export const sendToPrintTicket = sale => {
  const doc = generateTicket(sale);
  doc.autoPrint();
  doc.output('dataurlnewwindow'); // Try to save PDF as a file (not works on ie before 10, and some mobile devices)
  return doc;
};

export const getTicketBlob = sale => {
  const doc = generateTicket(sale);
  const bloburl = doc.output('bloburl');
  return bloburl;
  //   const blob = new Blob([doc.output()], { type: 'application/pdf' });
  //   // create an object URL from the Blob
  //   const URL = window.URL || window.webkitURL;
  //   const downloadUrl = URL.createObjectURL(blob);
};
