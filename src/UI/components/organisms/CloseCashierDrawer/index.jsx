// @flow
import React, { useState, useEffect } from 'react';
import { FormContext, useFormContext } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import DrawerFormLayout from 'UI/components/templates/DrawerFormLayout';
import Text from 'UI/components/atoms/Text';
import InputContainer from 'UI/components/atoms/InputContainer';
import TextBox from 'UI/components/atoms/TextBox';
import { DEFAULT_STORE } from 'UI/constants/defaults';

import type { MapType } from 'types';
import { globalStyles } from 'GlobalStyles';
import { useLanguage } from 'UI/utils';
import { useStyles } from './styles';
import Contents from './strings';

type CloseCashierDrawerProps = {
  handleClose: any => any,
  onShowAlert: any => any,
  onContinue: Object => any
};

const CloseCashierDrawer = (props: CloseCashierDrawerProps) => {
  const { handleClose, onShowAlert, onContinue } = props;
  const [comboValues, setComboValues] = useState<MapType>({});
  const language = useLanguage();

  const classes = useStyles();

  const form = useFormContext();

  const { register, errors, handleSubmit, setValue } = form;

  const onSubmit = async (formData: Object) => {
    try {
      const { cash, card } = formData;
      onContinue({
        cash,
        card,
        idStore: DEFAULT_STORE?.id
      });
    } catch (err) {
      onShowAlert({
        severity: 'error',
        title: 'Error al registrar el pago',
        autoHideDuration: 3000,
        body: 'Ocurrió un problema'
      });
      throw err;
    }
  };

  const handleTextChange = (name?: string, value: any) => {
    setValue(name, value, true);
    setComboValues({ ...comboValues });
  };

  const registerFormField = () => {
    register(
      { name: 'card' },
      {
        required: `${Contents[language]?.requiredField}`
      }
    );

    register(
      { name: 'cash' },
      {
        required: `${Contents[language]?.requiredField}`
      }
    );
  };
  useEffect(() => {
    registerFormField();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  return (
    <>
      <DrawerFormLayout
        title={Contents[language]?.Title}
        onSubmit={handleSubmit(onSubmit)}
        onClose={handleClose}
        onSecondaryButtonClick={handleClose}
        variant="borderless"
        initialText="Continuar"
      >
        <FormContext {...form}>
          <div className={classes.root}>
            <Box>
              <div style={globalStyles.feeDrawerslabel}>
                <Text
                  variant="body2"
                  text={Contents[language]?.CashSubtitle}
                  fontSize={13}
                />
                <InputContainer>
                  <TextBox
                    inputType="currency"
                    name="cash"
                    selectedValue={comboValues.cash}
                    label={Contents[language]?.Cash}
                    error={!!errors?.cash}
                    errorText={errors?.cash && errors?.cash.message}
                    onChange={handleTextChange}
                  />
                </InputContainer>
                <br />
                <Text
                  variant="body2"
                  text={Contents[language]?.CardSubtitle}
                  fontSize={13}
                />
                <InputContainer>
                  <TextBox
                    inputType="currency"
                    name="card"
                    selectedValue={comboValues.card}
                    label={Contents[language]?.Terminal}
                    error={!!errors?.card}
                    errorText={errors?.card && errors?.card.message}
                    onChange={handleTextChange}
                  />
                </InputContainer>
                {}
              </div>
            </Box>
          </div>
        </FormContext>
      </DrawerFormLayout>
    </>
  );
};

CloseCashierDrawer.defaultProps = {};

export default CloseCashierDrawer;
