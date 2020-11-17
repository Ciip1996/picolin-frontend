// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
// import axios from 'axios';
// Material UI components:
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import API from 'services/API';

// Custom components and others
import { colors } from 'UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import TextBox from 'UI/components/atoms/TextBox';
import { Endpoints } from 'UI/constants/endpoints';

import { showAlert as showAlertAction, confirm as confirmAction } from 'actions/app';
import { EntityRoutes } from 'routes/constants';
import { useStyles } from './styles';
import Contents from './strings';

type LogInProps = {
  showAlert: any => void
};

const LogIn = (props: LogInProps) => {
  const [uiState, setUiState] = useState({
    isLoading: false
  });
  const { showAlert } = props;

  const history = useHistory();
  const language = localStorage.getItem('language');

  const { register, handleSubmit, errors, setError } = useForm();

  useEffect(() => {
    localStorage.setItem('language', 'Spanish');
    localStorage.setItem('locale', 'es');
  }, []);

  const onSubmit = async (formData: Object) => {
    try {
      setUiState(prevState => ({ ...prevState, isLoading: true }));

      const params = {
        user: formData.user,
        password: formData.pwd
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
          autoHideDuration: 800000,
          body: `${response?.data?.mensaje}`
        });
      } else {
        showAlert({
          severity: 'error',
          title: response?.status ? `Error ${response.status}` : `Error`,
          code: response?.status || '500',
          autoHideDuration: 800000,
          body: Contents[language]?.errServer
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
            <h1 className={classes.header}>{Contents[language]?.pageTitle || 'INICIAR SESIÓN'}</h1>
            <TextBox
              className={classes.txtUser}
              name="user"
              label={Contents[language]?.labuser || 'Usuario'}
              inputRef={register({
                required: Contents[language]?.requser || 'Se requiere un nombre de usuario'
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
                required: Contents[language]?.reqpwd || 'Se requiere una contraseña'
              })}
              error={!!errors.pwd}
              helperText={errors.pwd && errors.pwd.message}
            />
            <ActionButton
              type="submit"
              status="success"
              className={classes.loginButton}
              text="Entrar"
              variant="important"
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
