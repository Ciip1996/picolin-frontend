// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
// Material UI components:
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import API from 'services/API';
// Custom components and others
import { colors } from 'UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import TextBox from 'UI/components/atoms/TextBox';

import { showAlert as showAlertAction, confirm as confirmAction } from 'actions/app';
import { useStyles } from './styles';

type LogInProps = {
  showAlert: any => void
};

const LogIn = (props: LogInProps) => {
  const [uiState, setUiState] = useState({
    isLoading: false
  });
  const { showAlert } = props;

  const url = `http://localhost:3307/login`;
  const history = useHistory();

  const { register, handleSubmit, errors, setError } = useForm();

  const onSubmit = async (formData: Object) => {
    try {
      setUiState(prevState => ({ ...prevState, isLoading: true }));

      const params = {
        user: formData.user,
        password: formData.pwd
      };
      // const response = await API.post(`${url}`, params);
      await axios.post(`${url}`, params).then(response => {
        if (response?.status === 200) {
          // TODO: properly handle token with valid session
          const access = {
            ...response?.data,
            type: 'bearer'
          };
          localStorage.setItem('access', JSON.stringify(access));
          API.defaults.headers.Authorization = `Bearer ${response.data.token}`;
          history.push('/home'); // TODO: change redirect url later
        }
      });
    } catch (error) {
      const { response } = error;
      if (response?.status === 401) {
        setError('user', 'notMatch', 'El Usuario puede ser incorrecto.');
        setError('pwd', 'notMatch', 'La contraseña puede ser incorrecta.');
        showAlert({
          severity: 'warning',
          title: `Login`,
          autoHideDuration: 800000,
          body: `${response?.data?.mensaje}`
        });
      } else {
        showAlert({
          severity: 'error',
          title: response?.status ? `Error ${response.status}` : `Error`,
          code: response?.status || '500',
          autoHideDuration: 800000,
          body: `Ocurrió un error en servidor. Porfavor intente mas tarde o contacte a soporte.`
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
            <h1 className={classes.header}>INICIAR SESIÓN</h1>
            <TextBox
              className={classes.txtUser}
              name="user"
              label="Usuario"
              inputRef={register({
                required: 'Se requiere un nombre de usuario'
              })}
              error={!!errors.user}
              helperText={errors.user && errors.user.message}
            />
            <TextBox
              className={classes.txtPwd}
              name="pwd"
              label="Contraseña"
              type="password"
              inputRef={register({
                required: 'Se requiere una contraseña'
              })}
              error={!!errors.pwd}
              helperText={errors.pwd && errors.pwd.message}
            />
            <ActionButton
              type="submit"
              status="success"
              className={classes.loginButton}
              text="Entrar"
            >
              {uiState.isLoading && <CircularProgress size={24} color={colors.white} />}
            </ActionButton>
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
