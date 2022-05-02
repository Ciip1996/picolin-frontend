import jsPDF from 'jspdf';
import {
  SourceSansProRegular,
  SourceSansProBold,
  MontserratRegular,
  MontserratBold,
  RobotoMonoRegular,
  RobotoMonoBold
} from 'UI/res/fonts';
import { currencyFormatter, getFeatureFlags } from 'UI/utils';
import { FeatureFlags } from 'UI/constants/featureFlags';
import moment from 'moment-timezone';
import { DateFormats } from 'UI/constants/defaults';

const initialLinePositionAfterHeader = 57;

const leftMargin = 5;
const rightMargin = 45;
const textColor = 50;
const baseHeight = 180;
const smallTextSize = 7;
const textSize = 9;
const headerTextSize = 20;
const separator = '---------------------------------';

const featureFlags = getFeatureFlags();

const generateBaseDocumentWithHeader = (height, ticketNumber, date, idSale) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, height + baseHeight]
  });
  // add custom font

  doc.addFileToVFS('RobotoMono-Regular-normal.ttf', RobotoMonoRegular);
  doc.addFileToVFS('RobotoMono-Bold-normal.ttf', RobotoMonoBold);
  doc.addFont('RobotoMono-Regular-normal.ttf', 'RobotoMono-Regular', 'normal');
  doc.addFont('RobotoMono-Bold-normal.ttf', 'RobotoMono-Bold', 'normal');

  doc.addFileToVFS('SourceSansPro-Regular-normal.ttf', SourceSansProRegular);
  doc.addFont(
    'SourceSansPro-Regular-normal.ttf',
    'SourceSansPro-Regular',
    'normal'
  );

  doc.addFileToVFS('SourceSansPro-Bold-normal.ttf', SourceSansProBold);
  doc.addFont('SourceSansPro-Bold-normal.ttf', 'SourceSansPro-Bold', 'normal');

  doc.addFileToVFS('Montserrat-Regular-normal.ttf', MontserratRegular);
  doc.addFont('Montserrat-Regular-normal.ttf', 'Montserrat-Regular', 'normal');

  doc.addFileToVFS('Montserrat-Bold-bold.ttf', MontserratBold);
  doc.addFont('Montserrat-Bold-bold.ttf', 'Montserrat-Bold', 'normal');

  let linePosition = 20;

  doc.setFont('Montserrat-Bold', 'normal');
  doc.setFontSize(headerTextSize);
  doc.setTextColor(textColor);
  doc.text('PICOLIN STORE®', leftMargin, linePosition);
  doc.setFontSize(smallTextSize);
  doc.setFont('RobotoMono-Regular', 'normal');

  linePosition += 5;
  doc.text('wwww.picolin.com.mx', leftMargin, linePosition);
  linePosition += 5;
  doc.text('Sucursal: Centro', leftMargin, linePosition);
  linePosition += 5;
  doc.text(
    'Pasaje Colón 115, Centro, 37000 León, Gto.',
    leftMargin,
    linePosition
  );
  linePosition += 5;

  doc.setFont('SourceSansPro-Bold', 'normal'); // change to SourceSansPro
  doc.text(`Ticket Nº: ${ticketNumber}`, leftMargin, linePosition);
  doc.setFont('RobotoMono-Regular', 'normal');

  linePosition += 5;
  doc.text(
    `Fecha: ${moment(date).format(DateFormats.International.DetailDateTime)}`,
    leftMargin,
    linePosition
  );
  linePosition += 5;
  doc.text(`ID: ${idSale}`, leftMargin, linePosition);
  linePosition += 7;

  return doc;
};

const getDocumentWithFooter = (doc, line, amountOfProducts) => {
  let linePosition = line;
  // Set Footer
  linePosition += 10;
  doc.text(separator, leftMargin, linePosition);
  linePosition += 5;

  doc.text(
    `Fecha de Impresión: ${moment().format(
      DateFormats.International.SimpleDateTime
    )} `,
    leftMargin,
    linePosition
  );
  if (amountOfProducts) {
    linePosition += 5;
    doc.setFont('RobotoMono-Bold', 'normal');
    doc.text(
      `Articulos Vendidos: ${amountOfProducts}`,
      leftMargin,
      linePosition
    );
  }
  linePosition += 10;
  doc.setFontSize(smallTextSize);
  doc.text(
    `¡Picolin agradece su compra, vuelva pronto!`,
    leftMargin,
    linePosition
  );
  doc.setFont('RobotoMono-Regular', 'normal');

  linePosition += 5;
  doc.text(
    `Una vez salida la mercancía de la tienda, `,
    leftMargin,
    linePosition
  );
  linePosition += 5;
  doc.text(`no se aceptarán devoluciones.`, leftMargin, linePosition);
  return doc;
};

export const generateCloseCashierTicket = data => {
  // Set Header
  const extraHeight = data?.cashierInformation?.length * 12;

  const doc = generateBaseDocumentWithHeader(
    extraHeight,
    data?.ticket,
    data?.date,
    data?.idSale
  );
  let linePosition = initialLinePositionAfterHeader;

  // Set Body
  doc.setFontSize(textSize);
  doc.text(separator, leftMargin, linePosition);
  linePosition += 5;

  doc.setFont('RobotoMono-Bold', 'normal');
  doc.text('DETALLE DE CORTE DE CAJA:', leftMargin, linePosition);
  doc.setFont('RobotoMono-Regular', 'normal');
  linePosition += 7;
  data?.cashierInformation &&
    data.cashierInformation.forEach(each => {
      doc.text(`${each?.title}`, leftMargin, linePosition);
      doc.text(
        each?.cost ? `${currencyFormatter(each?.cost)}` : '--',
        rightMargin,
        linePosition
      );
      linePosition += 12;
    });
  // Differency
  doc.setFont('RobotoMono-Bold', 'normal');
  doc.text(`Diferencia: `, leftMargin, linePosition);
  doc.text(`${currencyFormatter(data?.difference)}`, rightMargin, linePosition);
  doc.setFont('RobotoMono-Regular', 'normal');
  linePosition += 10;
  return getDocumentWithFooter(doc, linePosition, null);
};

const generateTicket = data => {
  const extraHeight = data?.detail?.length * 12;

  // Set Header
  const doc = generateBaseDocumentWithHeader(
    extraHeight,
    data?.sale?.ticket,
    data?.sale?.date,
    data?.sale?.idSale
  );

  let linePosition = initialLinePositionAfterHeader;

  // Set Body
  doc.setFontSize(textSize);
  doc.text(separator, leftMargin, linePosition);
  linePosition += 5;

  doc.setFont('RobotoMono-Bold', 'normal');
  doc.text('PRODUCTOS:', leftMargin, linePosition);
  doc.setFont('RobotoMono-Regular', 'normal');
  linePosition += 7;

  data?.detail &&
    data.detail.forEach((each, index) => {
      doc.text(
        `Art.#${index + 1}: ${each?.productCode}`,
        leftMargin,
        linePosition
      );
      doc.text(
        `${each?.type} ${each?.material} ${each?.color}`,
        leftMargin,
        linePosition + 5
      );
      doc.text(
        !each.combo ? `${currencyFormatter(each?.salePrice)}` : 'paquete',
        rightMargin,
        linePosition + 10
      );
      linePosition += 14;
    });
  // print the combos n times with the default price
  for (let i = 0; i < data?.sale?.combos; i += 1) {
    doc.text(`Paquete Bauticen: `, leftMargin, linePosition);
    doc.text(`${currencyFormatter(800)}`, rightMargin, linePosition);
    linePosition += 7;
  }

  doc.text(separator, leftMargin, linePosition);
  linePosition += 5;

  doc.text(`Metodo de Pago: `, leftMargin, linePosition);
  doc.text(`${data?.sale?.paymentMethod}`, rightMargin, linePosition);
  linePosition += 5;
  doc.text(`Subtotal: `, leftMargin, linePosition);
  doc.text(
    `${currencyFormatter(data?.sale?.subtotal)}`,
    rightMargin,
    linePosition
  );
  linePosition += 5;
  if (featureFlags.includes(FeatureFlags.Taxes)) {
    doc.text(`IVA: `, leftMargin, linePosition);
    doc.text(
      `${currencyFormatter(data?.sale?.iva)}`,
      rightMargin,
      linePosition
    );
    linePosition += 5;
  }
  doc.text(`Descuento: `, leftMargin, linePosition);
  doc.text(`-`, rightMargin - 1, linePosition);
  doc.text(
    `${currencyFormatter(data?.sale?.discount)}`,
    rightMargin,
    linePosition
  );
  linePosition += 5;

  doc.setFont('RobotoMono-Bold', 'normal');
  doc.text(`Total: `, leftMargin, linePosition);
  doc.text(
    `${currencyFormatter(data?.sale?.total)}`,
    rightMargin,
    linePosition
  );
  doc.setFont('RobotoMono-Regular', 'normal');
  linePosition += 10;

  doc.text(`Recibido: `, leftMargin, linePosition);
  doc.text(
    `${currencyFormatter(data?.sale?.received)}`,
    rightMargin,
    linePosition
  );
  linePosition += 5;

  doc.text(`Cambio: `, leftMargin, linePosition);
  doc.text(
    `${currencyFormatter(
      data?.sale?.paymentMethod === 'Tarjeta'
        ? 0.0
        : data?.sale?.received - data?.sale?.total
    )}`,
    rightMargin,
    linePosition
  );
  return getDocumentWithFooter(doc, linePosition, data?.detail?.length);
};

export const downloadSaleTicketPDF = (data, ticketTitle) => {
  const doc = generateTicket(data);
  doc.save(ticketTitle);
  return doc;
};

export const sendToPrintSaleTicket = data => {
  const doc = generateTicket(data);
  doc.autoPrint();
  doc.output('dataurlnewwindow');
  return doc;
};

export const downloadCloseCashierTicketPDF = (data, ticketTitle) => {
  const doc = generateCloseCashierTicket(data);
  doc.save(ticketTitle);
  return doc;
};

export const sendToPrintCloseCashierTicket = data => {
  const doc = generateCloseCashierTicket(data);
  doc.autoPrint();
  doc.output('dataurlnewwindow');
  return doc;
};

export const sendToPrintAndDownloadCashierTicket = (data, ticketTitle) => {
  const doc = generateCloseCashierTicket(data);
  doc.autoPrint();
  doc.output('dataurlnewwindow');
  doc.save(ticketTitle);
  return doc;
};

export const getTicketBlob = data => {
  const doc = generateTicket(data);
  const bloburl = doc.output('bloburl');
  return bloburl;
};
