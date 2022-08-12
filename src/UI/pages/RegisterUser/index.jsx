// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

// Material UI components:
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';

// Custom components and others
import { colors } from 'UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import TextBox from 'UI/components/atoms/TextBox';
import InputContainer from 'UI/components/atoms/InputContainer';
import { EntityRoutes } from 'routes/constants';
import { VALIDATION_REGEXS, useLanguage } from 'UI/utils';

import {
  showAlert as showAlertAction,
  confirm as confirmAction
} from 'actions/app';
import { useStyles } from './styles';
import Contents from './strings';

type RegisterProps = {
  showAlert: any => void
};

const RegisterUser = (props: RegisterProps) => {
  const [uiState, setUiState] = useState({
    isLoading: false,
    role: undefined
  });
  const { showAlert } = props;
  const language = useLanguage();

  const history = useHistory();

  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    setError
  } = useForm();

  useEffect(() => {
    register({ name: 'role' }, { required: Contents[language]?.requireRole });
  }, [language, register]);

  const onSubmit = async (formData: Object) => {
    try {
      setUiState(prevState => ({ ...prevState, isLoading: true }));
      const {
        password,
        confirmPwd,
        name,
        firstLastName,
        role,
        secondLastName,
        user
      } = formData;
      // react hook forms is doing this validation but we are double validating in order to prevent mistakes or code injection
      if (password === confirmPwd) {
        const params = {
          password,
          name,
          firstLastName,
          roleId: role,
          secondLastName,
          user
        };
        const response = await API.post(`${Endpoints.RegisterUser}`, params);
        if (response?.status === 200) {
          showAlert({
            severity: 'success',
            title: `Registrar Usuario`,
            autoHideDuration: 8000,
            body: `El usuario "${user}" ha sido registrado exitosamente.`
          });
          history.push(EntityRoutes.Home);
        }
      } else {
        // password mismatch
        showAlert({
          severity: 'warning',
          title: `Password confirmation`,
          autoHideDuration: 8000,
          body: `Your password don't match. Try again or contact IT support.`
        });
      }
    } catch (error) {
      const { response } = error;
      if (response?.status === 401) {
        setError('user', 'notMatch', Contents[language]?.userAlreadyExists);
        showAlert({
          severity: 'warning',
          title: response?.data?.title
            ? response?.data?.title
            : `Error ${response.status}`,
          code: response?.status || '500',
          autoHideDuration: 8000,
          body: `${response?.data?.message}`
        });
      } else {
        showAlert({
          severity: 'error',
          title: response?.data?.title
            ? response?.data?.title
            : `Error ${response.status}`,
          code: response?.status || '500',
          autoHideDuration: 8000,
          body: response?.data?.message || Contents[language]?.errServer
        });
      }
    } finally {
      setUiState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const onSelectChanged = (name: string, value: Object) => {
    setValue(name, value?.id || undefined, true);
    setUiState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const classes = useStyles();
  return (
    <ContentPageLayout>
      <div className={classes.wrapper}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className={classes.containerBox}>
            <Box className={classes.formLayout}>
              <h1 className={classes.header}>
                {Contents[language]?.pageTitle}
              </h1>
              <InputContainer>
                <TextBox
                  autoFocus
                  name="user"
                  label={Contents[language]?.user}
                  inputRef={register({
                    required: Contents[language]?.requireUser
                  })}
                  error={!!errors.user}
                  helperText={errors.user && errors.user.message}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="password"
                  label={Contents[language]?.password}
                  type="password"
                  inputRef={register({
                    pattern: {
                      value: VALIDATION_REGEXS.PASSWORD,
                      message: Contents[language]?.passwordPattern
                    },
                    required: Contents[language]?.requirePassword
                  })}
                  error={!!errors.password}
                  helperText={errors.password && errors.password.message}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="confirmPwd"
                  label={Contents[language]?.confirmPwd}
                  type="password"
                  inputRef={register({
                    required: Contents[language]?.requirePwdConfirmation,
                    validate: value =>
                      value === watch('password') ||
                      Contents[language]?.passwordConfirmationMistake
                  })}
                  error={!!errors.confirmPwd}
                  helperText={errors.confirmPwd && errors.confirmPwd.message}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="name"
                  label={Contents[language]?.name}
                  inputRef={register({
                    required: Contents[language]?.requireName
                  })}
                  error={!!errors.name}
                  helperText={errors.name && errors.name.message}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="firstLastName"
                  label={Contents[language]?.firstLastName}
                  inputRef={register({
                    required: Contents[language]?.requirefirstLastName
                  })}
                  error={!!errors.firstLastName}
                  helperText={
                    errors.firstLastName && errors.firstLastName.message
                  }
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="secondLastName"
                  label={Contents[language]?.secondLastName}
                  inputRef={register({
                    required: Contents[language]?.require2LastName
                  })}
                  error={!!errors.secondLastName}
                  helperText={
                    errors.secondLastName && errors.secondLastName.message
                  }
                />
              </InputContainer>
              <InputContainer>
                <AutocompleteSelect
                  name="role"
                  selectedValue={uiState.role}
                  placeholder={Contents[language]?.role}
                  url={Endpoints.GetRoles}
                  error={!!errors.role}
                  errorText={errors.role && errors.role.message}
                  onSelect={onSelectChanged}
                />
              </InputContainer>
              <ActionButton
                type="submit"
                status="success"
                className={classes.RegisterButton}
                text={Contents[language]?.RegisterUser}
              >
                {uiState.isLoading && (
                  <CircularProgress size={24} color={colors.white} />
                )}
              </ActionButton>
            </Box>
          </Box>
        </form>
      </div>
    </ContentPageLayout>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

const RegisterConnected = connect(null, mapDispatchToProps)(RegisterUser);

export default RegisterConnected;
