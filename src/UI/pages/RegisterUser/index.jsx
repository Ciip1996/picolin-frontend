// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
// import { useHistory } from 'react-router-dom';

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

import { showAlert as showAlertAction, confirm as confirmAction } from 'actions/app';
import { useStyles } from './styles';
import Contents from './strings';

type RegisterProps = {
  showAlert: any => void
};

const RegisterUser = (props: RegisterProps) => {
  const [uiState, setUiState] = useState({
    isLoading: false,
    language: localStorage.getItem('language')
  });
  const { showAlert } = props;

  const RoleOptions = [
    { id: 0, title: Contents[uiState.language]?.worker },
    { id: 1, title: Contents[uiState.language]?.manager },
    { id: 1, title: Contents[uiState.language]?.admin }
  ];

  // const history = useHistory();

  const { register, handleSubmit, errors, setError } = useForm();

  const onSubmit = async (formData: Object) => {
    try {
      setUiState(prevState => ({ ...prevState, isLoading: true }));
      const params = {
        user: formData.user,
        password: formData.pwd
      };
      const response = await API.post(`${Endpoints.RegisterUser}`, params);
      if (response?.status === 200) {
        // TODO: handle success
      }
    } catch (error) {
      const { response } = error;
      if (response?.status === 401) {
        setError('user', 'notMatch', Contents[uiState.language]?.errUser);
        setError('pwd', 'notMatch', Contents[uiState.language]?.errUser);
        showAlert({
          severity: 'warning',
          title: `RegisterUser`,
          autoHideDuration: 800000,
          body: `${response?.data?.mensaje}`
        });
      } else {
        showAlert({
          severity: 'error',
          title: response?.status ? `Error ${response.status}` : `Error`,
          code: response?.status || '500',
          autoHideDuration: 800000,
          body: Contents[uiState.language]?.errServer
        });
      }
    } finally {
      setUiState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const classes = useStyles();
  return (
    <ContentPageLayout>
      <div className={classes.wrapper}>
        <Box className={classes.containerBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <center>
              <h1 className={classes.header}>
                {Contents[uiState.language]?.pageTitle || 'REGISTRAR USUARIO'}
              </h1>
              <TextBox
                className={classes.Formulary}
                name="user"
                label={Contents[uiState.language]?.user || 'Usuario'}
                inputRef={register({
                  required:
                    Contents[uiState.language]?.requser || 'Se requiere un nombre de usuario'
                })}
                error={!!errors.user}
                helperText={errors.user && errors.user.message}
              />
              <TextBox
                className={classes.Content}
                name="pwd"
                label={Contents[uiState.language]?.pwd}
                type="password"
                inputRef={register({
                  required: Contents[uiState.language]?.reqpwd || 'Se requiere una contraseña'
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
                  required:
                    Contents[uiState.language]?.reqpwd2 ||
                    'Se requiere por segunda vez la contraseña'
                })}
                error={!!errors.repwd}
                helperText={errors.repwd && errors.repwd.message}
              />
              <AutocompleteSelect
                className={classes.Formulary}
                name="rol"
                placeholder={Contents[uiState.language]?.role}
                // selectedValue={filters.rol}
                defaultOptions={RoleOptions}
                // onSelect={handleFilterChange}
                inputRef={register({
                  required: Contents[uiState.language]?.reqrole || 'Se requiere el rol'
                })}
                error={!!errors.rol}
                helperText={errors.rol && errors.rol.message}
              />
              <TextBox
                className={classes.Formulary}
                name="name"
                label={Contents[uiState.language]?.name || 'Nombre'}
                inputRef={register({
                  required: Contents[uiState.language]?.reqname || 'Se requiere un nombre'
                })}
                error={!!errors.name}
                helperText={errors.name && errors.name.message}
              />
              <TextBox
                className={classes.Formulary}
                name="firstLastName"
                label={Contents[uiState.language]?.firstLastName || 'Apellido Paterno'}
                inputRef={register({
                  required:
                    Contents[uiState.language]?.reqfirstLastName || 'Se requiere el primer apellido'
                })}
                error={!!errors.firstLastName}
                helperText={errors.firstLastName && errors.firstLastName.message}
              />
              <TextBox
                className={classes.Formulary}
                name="secondLastName"
                label={Contents[uiState.language]?.secondLastName || 'Apellido Materno'}
                inputRef={register({
                  required:
                    Contents[uiState.language]?.req2LastName || 'Se requiere el segundo apellido'
                })}
                error={!!errors.secondLastName}
                helperText={errors.secondLastName && errors.secondLastName.message}
              />
              <ActionButton
                type="submit"
                status="success"
                className={classes.RegisterButton}
                text={Contents[uiState.language]?.RegisterUser}
              >
                {uiState.isLoading && <CircularProgress size={24} color={colors.white} />}
              </ActionButton>
            </center>
          </form>
        </Box>
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
