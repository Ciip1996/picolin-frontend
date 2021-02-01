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
  productCode: string | null
};

const QRCodeDrawer = (props: QRCodeDrawerProps) => {
  const { handleClose, onShowAlert, productCode } = props;
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
          format: [180, 120]
        });
        pdf.text(productCode, 120, 100);
        pdf.addImage(imgData, 'PNG', 15, 15);
        pdf.save('download.pdf');
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
