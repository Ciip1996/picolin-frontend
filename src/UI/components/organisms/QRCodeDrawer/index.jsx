// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import { generateTagQR } from 'UI/utils/tagGenerator';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import TextBox from 'UI/components/atoms/TextBox';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import InputContainer from 'UI/components/atoms/InputContainer';
import { useStyles } from './styles';
import Contents from './strings';

type QRCodeDrawerProps = {
  selectedProduct: Object,
  handleClose: any => any,
  onShowAlert: any => any
};

const QRCodeDrawer = (props: QRCodeDrawerProps) => {
  const { selectedProduct, handleClose, onShowAlert } = props;

  const { productCode, name, material, color, gender, size } = selectedProduct;

  const productInformation = `${name} ${material} ${color} ${gender} ${
    size === 'UNITALLA' ? '' : 'talla'
  } ${size}`;

  const language = localStorage.getItem('language');

  const form = useForm({
    defaultValues: { tagFontSize: 6 }
  });

  const { handleSubmit, errors, setValue, getValues, register } = form;

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

  useEffect(() => {
    register(
      { name: 'tagFontSize' },
      { required: `${Contents[language]?.TagFontSizeRequired}` }
    );
  }, [language, register]);

  const classes = useStyles();

  const onSubmit = async () => {
    try {
      const qrCodeDiv: any = document.getElementById('QRCodeContainer');
      await html2canvas(qrCodeDiv).then(canvas =>
        generateTagQR(
          canvas,
          productCode,
          productInformation,
          getValues('tagFontSize')
        )
      );
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
  const handleTextChange = (inputName: string, value: any) => {
    setValue(inputName, value, true);
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
          initialText={
            productCode
              ? Contents[language]?.Download
              : Contents[language]?.Close
          }
          isCancelButtonNeeded={!!productCode}
        >
          {productCode ? (
            <>
              <Text
                variant="body1"
                text={Contents[language]?.Subtitle}
                fontSize={14}
              />
              <Box
                height="calc(90% - 88px)"
                flexDirection="column"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <div id="QRCodeContainer">
                  <QRCode
                    size={300}
                    renderAs="svg"
                    value={productCode}
                    level="H"
                  />
                </div>
                <strong>{`Código de Producto: ${productCode}`}</strong>
              </Box>
              <InputContainer>
                <TextBox
                  name="tagFontSize"
                  inputType="number"
                  label={Contents[language]?.TagFontSizeLabel}
                  error={!!errors.tagFontSize}
                  errorText={errors.tagFontSize && errors.tagFontSize.message}
                  onChange={handleTextChange}
                  value={getValues('tagFontSize')}
                  helperText={Contents[language]?.TagFontSize}
                  defaultValue="6"
                />
              </InputContainer>
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
