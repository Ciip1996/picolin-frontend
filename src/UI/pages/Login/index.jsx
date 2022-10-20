// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
// import axios from 'axios';
// Material UI components:
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import API from 'services/API';
import FormHelperText from '@material-ui/core/FormHelperText';

// Custom components and others
import { colors } from 'UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import TextBox from 'UI/components/atoms/TextBox';
import { Endpoints } from 'UI/constants/endpoints';
import { getErrorData, useLanguage, useIsDemoEnvironment } from 'UI/utils';

import {
  showAlert as showAlertAction,
  confirm as confirmAction
} from 'actions/app';
import { EntityRoutes } from 'routes/constants';
import { useStyles } from './styles';
import Contents from './strings';

type LogInProps = {
  showAlert: any => void
};

const LogIn = (props: LogInProps) => {
  const language = useLanguage();
  const isDemo = useIsDemoEnvironment();

  const [uiState, setUiState] = useState({
    isLoading: false
  });
  const { showAlert } = props;

  const history = useHistory();

  const { register, handleSubmit, errors, setError } = useForm();

  const onSubmit = async (formData: Object) => {
    try {
      setUiState(prevState => ({ ...prevState, isLoading: true }));

      const params = {
        user: isDemo ? 'demo' : formData.user,
        password: isDemo ? 'freedemopassword2022' : formData.pwd
      };
      const response = await API.post(`${Endpoints.Login}`, params);
      if (response) {
        if (response?.status === 200) {
          const access = {
            ...response?.data,
            type: 'bearer'
          };
          localStorage.setItem('access', JSON.stringify(access));
          API.defaults.headers.Authorization = `Bearer ${response.data.token}`;
          history.push(EntityRoutes.Home);
        }
      }
    } catch (error) {
      const { response } = error;
      if (response?.status === 401) {
        setError('user', 'notMatch', Contents[language]?.errUser);
        setError('pwd', 'notMatch', Contents[language]?.errUser);
        showAlert({
          severity: 'warning',
          title: `Login`,
          autoHideDuration: 8000,
          body: getErrorData(error)?.message || Contents[language]?.errServer
        });
      } else {
        showAlert({
          severity: 'error',
          title: getErrorData(error)?.title || `Error`,
          code: response?.status || '500',
          autoHideDuration: 8000,
          body: getErrorData(error)?.message || Contents[language]?.errServer
        });
      }
    } finally {
      setUiState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Box className={classes.containerBox}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <center>
            <h1 className={classes.header}>
              {isDemo
                ? Contents[language].demoTitle
                : Contents[language].pageTitle}
            </h1>
            <TextBox
              autoFocus
              className={classes.txtUser}
              name="user"
              label={
                isDemo
                  ? Contents[language].demoUser
                  : Contents[language].labuser
              }
              inputRef={register({
                required:
                  Contents[language]?.requser ||
                  'Se requiere un nombre de usuario'
              })}
              disabled={isDemo}
            />
            <TextBox
              className={classes.txtPwd}
              name="pwd"
              label={Contents[language].labPwd}
              type="password"
              inputRef={register({
                required:
                  Contents[language]?.reqpwd || 'Se requiere una contraseña'
              })}
              error={!!errors.pwd}
              helperText={errors.pwd && errors.pwd.message}
              disabled={isDemo}
            />
            <ActionButton
              type="submit"
              status="success"
              className={classes.loginButton}
              text={
                isDemo
                  ? Contents[language].demoButton
                  : Contents[language].login
              }
              isHighlited
            >
              {uiState.isLoading && (
                <CircularProgress size={24} color={colors.white} />
              )}
            </ActionButton>
            {isDemo && (
              <FormHelperText
                style={{
                  marginLeft: 16,
                  marginRight: 16,
                  marginTop: 8,
                  textAlign: 'center'
                }}
              >
                {Contents[language].demoDescription}
              </FormHelperText>
            )}
          </center>
        </form>
      </Box>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: alert => dispatch(showAlertAction(alert)),
    showConfirm: confirmation => dispatch(confirmAction(confirmation))
  };
};

const LogInConnected = connect(null, mapDispatchToProps)(LogIn);

export default LogInConnected;
