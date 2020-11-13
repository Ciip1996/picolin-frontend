// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
// Material UI components:
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import API from 'services/API';
import AutocompleteSelect from 'UI/components/molecules/AutocompleteSelect';
// Custom components and others
import { colors } from 'UI/res';
import ActionButton from 'UI/components/atoms/ActionButton';
import TextBox from 'UI/components/atoms/TextBox';

import { showAlert as showAlertAction, confirm as confirmAction } from 'actions/app';
import { getFilters } from 'services/FiltersStorage';
import { useStyles } from './styles';
import Contents from './strings';

type RegisterProps = {
  showAlert: any => void
};

const Register = (props: RegisterProps) => {
  const [uiState, setUiState] = useState({
    isLoading: false
  });
  const { showAlert } = props;
  const language = localStorage.getItem('language');

  const RoleOptions = [
    { id: 0, title: Contents[language]?.worker },
    { id: 1, title: Contents[language]?.manager },
    { id: 1, title: Contents[language]?.admin }
  ];

  const url = `http://localhost:3307/login`;
  const history = useHistory();

  const { register, handleSubmit, errors, setError } = useForm();
  const [setSearching] = useState(false);
  const savedSearch = getFilters('register');
  const savedFilters = savedSearch?.filters;

  useEffect(() => {
    localStorage.setItem('language', 'Spanish');
    localStorage.setItem('locale', 'es');
  }, []);
  const [filters, setFilters] = useState<Filters>(savedFilters || {});

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
        setError('user', 'notMatch', Contents[language]?.errUser);
        setError('pwd', 'notMatch', Contents[language]?.errUser);
        showAlert({
          severity: 'warning',
          title: `Register`,
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
            <h1 className={classes.header}>
              {Contents[language]?.pageTitle || 'REGISTRAR USUARIO'}
            </h1>
            <TextBox
              className={classes.Formulary}
              name="user"
              label={Contents[language]?.user || 'Usuario'}
              inputRef={register({
                required: Contents[language]?.requser || 'Se requiere un nombre de usuario'
              })}
              error={!!errors.user}
              helperText={errors.user && errors.user.message}
            />
            <TextBox
              className={classes.Content}
              name="pwd"
              label={Contents[language]?.pwd}
              type="password"
              inputRef={register({
                required: Contents[language]?.reqpwd || 'Se requiere una contraseña'
              })}
              error={!!errors.pwd}
              helperText={errors.pwd && errors.pwd.message}
            />
            <TextBox
              className={classes.Content}
              name="repwd"
              label="Confirmar contraseña"
              type="password"
              inputRef={register({
                required: Contents[language]?.reqpwd2 || 'Se requiere por segunda vez la contraseña'
              })}
              error={!!errors.repwd}
              helperText={errors.repwd && errors.repwd.message}
            />
            <AutocompleteSelect
              className={classes.Formulary}
              name="rol"
              placeholder={Contents[language]?.role}
              // selectedValue={filters.rol}
              defaultOptions={RoleOptions}
              // onSelect={handleFilterChange}
              inputRef={register({
                required: Contents[language]?.reqrole || 'Se requiere el rol'
              })}
              error={!!errors.rol}
              helperText={errors.rol && errors.rol.message}
            />
            <TextBox
              className={classes.Formulary}
              name="name"
              label={Contents[language]?.name || 'Nombre'}
              inputRef={register({
                required: Contents[language]?.reqname || 'Se requiere un nombre'
              })}
              error={!!errors.name}
              helperText={errors.name && errors.name.message}
            />
            <TextBox
              className={classes.Formulary}
              name="firstLastName"
              label={Contents[language]?.firstLastName || 'Apellido Paterno'}
              inputRef={register({
                required: Contents[language]?.reqfirstLastName || 'Se requiere el primer apellido'
              })}
              error={!!errors.firstLastName}
              helperText={errors.firstLastName && errors.firstLastName.message}
            />
            <TextBox
              className={classes.Formulary}
              name="secondLastName"
              label={Contents[language]?.secondLastName || 'Apellido Materno'}
              inputRef={register({
                required: Contents[language]?.req2LastName || 'Se requiere el segundo apellido'
              })}
              error={!!errors.secondLastName}
              helperText={errors.secondLastName && errors.secondLastName.message}
            />
            <ActionButton
              type="submit"
              status="success"
              className={classes.RegisterButton}
              text={Contents[language]?.Register}
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

const RegisterConnected = connect(null, mapDispatchToProps)(Register);

export default RegisterConnected;
