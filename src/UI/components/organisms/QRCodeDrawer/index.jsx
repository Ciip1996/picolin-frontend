// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
// import TextBox from 'UI/components/atoms/TextBox';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';

// import { MontserratRegular } from 'UI/res/fonts';
import { useStyles } from './styles';
import Contents from './strings';

type QRCodeDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  productCode: string,
  productDescription: string,
  idProduct: string
};

const QRCodeDrawer = (props: QRCodeDrawerProps) => {
  const { handleClose, onShowAlert, productCode, productDescription, idProduct } = props;
  const language = localStorage.getItem('language');

  // const [copies, setCopies] = useState(null);

  const form = useForm({
    defaultValues: {}
  });

  const {
    handleSubmit
    // register
    //  errors,
    //  setValue
  } = form;

  const [uiState, setUiState] = useState({
    isSaving: false,
    isSuccess: false,
    isReadOnly: false,
    isFormDisabled: false,
    isLoading: true
  });

  useEffect(() => {
    setUiState(prevState => ({
      ...prevState
    }));
  }, []);

  // useEffect(() => {
  //   register({ name: 'copies' }, { required: `${Contents[language]?.CopiesRequired}` });
  // }, [language, register]);

  const classes = useStyles();

  // const handleTextChange = (name?: string, value: any) => {
  //   setValue(name, value, true);
  // };

  function resizeImage(base64Str, maxWidth = 300, maxHeight = 300) {
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
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
    });
  }

  const onSubmit = async () => {
    try {
      // TODO: SEND TO PRINT THE QR CODE
      // const { copies } = formData;
      const qrCodeDiv: any = document.getElementById('QRCodeContainer');
      await html2canvas(qrCodeDiv).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        // eslint-disable-next-line new-cap
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [65, 45]
        });
        const QRCodeImageSize = 110;
        const textleftMargin = 35;
        const qrCodeLeftMargin = 3;
        const topMargin = 5;
        const textWrappingWidth = 25;

        resizeImage(imgData, QRCodeImageSize, QRCodeImageSize).then(resizedImage => {
          pdf.setFontSize(7);
          pdf.setFont(undefined, 'bold');
          pdf.text(`ID: ${idProduct}`, textleftMargin, topMargin + 3);
          pdf.text(`${productCode}`, textleftMargin, topMargin + 7);
          pdf.setFont(undefined, 'normal');
          const splitTitle = pdf.splitTextToSize(productDescription, textWrappingWidth);
          pdf.text(textleftMargin, topMargin + 12, splitTitle);
          pdf.addImage(resizedImage, 'PNG', qrCodeLeftMargin, topMargin);
          pdf.save(`${productCode}.pdf`);
        });
      });
      onShowAlert({
        severity: 'success',
        title: `Descargando etiqueta QR`,
        autoHideDuration: 8000,
        body: 'Se descargo correctamente'
      });
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: 'Error de Impresión',
        autoHideDuration: 8000,
        body: 'Ocurrió un problema al mandar a Imprimir'
      });
      throw err;
    }
  };

  return (
    <>
      <FormContext {...form}>
        <DrawerFormLayout
          title={Contents[language]?.Title}
          onSubmit={productCode ? handleSubmit(onSubmit) : handleClose}
          onClose={handleClose}
          onSecondaryButtonClick={handleClose}
          variant="borderless"
          uiState={uiState}
          cancelText={Contents[language]?.Skip}
          initialText={productCode ? Contents[language]?.Download : Contents[language]?.Close}
          isCancelButtonNeeded={!!productCode}
        >
          {productCode ? (
            <>
              <Text variant="body1" text={Contents[language]?.Subtitle} fontSize={14} />
              <Box
                height="calc(90% - 88px)"
                flexDirection="column"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <div id="QRCodeContainer">
                  <QRCode size={300} renderAs="svg" value={productCode} level="H" />
                </div>
                <strong>{`Código de Producto: ${productCode}`}</strong>
              </Box>
              {/* <TextBox
                name="copies"
                inputType="number"
                label={Contents[language]?.Copies}
                error={!!errors.copies}
                errorText={errors.copies && errors.copies.message}
                onChange={handleTextChange}
              /> */}
            </>
          ) : (
            <Box
              height="calc(90% - 88px)"
              flexDirection="column"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <EmptyPlaceholder
                title={Contents[language]?.QRCodeErrorTitle}
                subtitle={Contents[language]?.QRCodeErrorMessage}
              >
                <SentimentVeryDissatisfiedIcon
                  color="error"
                  style={{ width: '100px', height: '100px' }}
                />
              </EmptyPlaceholder>
            </Box>
          )}
        </DrawerFormLayout>
        <form className={classes.root} noValidate autoComplete="off" />
      </FormContext>
    </>
  );
};

QRCodeDrawer.defaultProps = {};

export default QRCodeDrawer;
