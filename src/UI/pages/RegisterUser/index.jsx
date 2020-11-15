// @flow
import React, { useState, useEffect } from 'react';
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
import InputContainer from 'UI/components/atoms/InputContainer';

import { showAlert as showAlertAction, confirm as confirmAction } from 'actions/app';
import { useStyles } from './styles';
import Contents from './strings';

type RegisterProps = {
  showAlert: any => void
};

const RegisterUser = (props: RegisterProps) => {
  const [uiState, setUiState] = useState({
    isLoading: false,
    language: localStorage.getItem('language'),
    role: undefined
  });
  const { showAlert } = props;

  const RoleOptions = [
    { id: 0, title: Contents[uiState.language]?.worker, value: 'employee' },
    { id: 1, title: Contents[uiState.language]?.manager, value: 'manager' },
    { id: 1, title: Contents[uiState.language]?.admin, value: 'admin' }
  ];

  // const history = useHistory();

  const { register, handleSubmit, errors, setValue, watch } = useForm();

  useEffect(() => {
    register({ name: 'role' }, { required: Contents[uiState.language]?.requireRole });
  }, [register, uiState.language]);

  const onSubmit = async (formData: Object) => {
    try {
      console.log(formData);
      setUiState(prevState => ({ ...prevState, isLoading: true }));
      const { password, confirmPwd, name, firstLastName, role, secondLastName, user } = formData;
      // react hook forms is doing this validation but we are double validating in order to prevent mistakes or code injection
      if (password === confirmPwd) {
        debugger;
        const params = {
          password,
          name,
          firstLastName,
          role,
          secondLastName,
          user
        };
        const response = await API.post(`${Endpoints.RegisterUser}`, params);
        if (response?.status === 200) {
          // TODO: handle success
          debugger;
        }
      } else {
        // password mismatch
        showAlert({
          severity: 'warning',
          title: `Password confirmation`,
          autoHideDuration: 800000,
          body: `Your password don't match. Try again or contact IT support.`
        });
      }
    } catch (error) {
      const { response } = error;
      showAlert({
        severity: 'error',
        title: response?.status ? `Error ${response.status}` : `Error`,
        code: response?.status || '500',
        autoHideDuration: 800000,
        body: Contents[uiState.language]?.errServer
      });
    } finally {
      setUiState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const onSelectChanged = (name: string, value: Object) => {
    setValue(name, value?.id ? value?.id : value?.title, true);
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
              <h1 className={classes.header}>{Contents[uiState.language]?.pageTitle}</h1>
              <InputContainer>
                <TextBox
                  name="user"
                  label={Contents[uiState.language]?.user}
                  inputRef={register({
                    required: Contents[uiState.language]?.requireUser
                  })}
                  error={!!errors.user}
                  helperText={errors.user && errors.user.message}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="password"
                  label={Contents[uiState.language]?.password}
                  type="password"
                  inputRef={register({
                    required: Contents[uiState.language]?.requirePassword
                  })}
                  error={!!errors.password}
                  helperText={errors.password && errors.password.message}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="confirmPwd"
                  label={Contents[uiState.language]?.confirmPwd}
                  type="password"
                  inputRef={register({
                    required: Contents[uiState.language]?.requirePwdConfirmation,
                    validate: value =>
                      value === watch('password') ||
                      Contents[uiState.language]?.passwordConfirmationMistake
                  })}
                  // inputRef={register({
                  //   required: Contents[uiState.language]?.requirePwdConfirmation
                  // })}
                  error={!!errors.confirmPwd}
                  helperText={errors.confirmPwd && errors.confirmPwd.message}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="name"
                  label={Contents[uiState.language]?.name}
                  inputRef={register({
                    required: Contents[uiState.language]?.requireName
                  })}
                  error={!!errors.name}
                  helperText={errors.name && errors.name.message}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="firstLastName"
                  label={Contents[uiState.language]?.firstLastName}
                  inputRef={register({
                    required: Contents[uiState.language]?.requirefirstLastName
                  })}
                  error={!!errors.firstLastName}
                  helperText={errors.firstLastName && errors.firstLastName.message}
                />
              </InputContainer>
              <InputContainer>
                <TextBox
                  name="secondLastName"
                  label={Contents[uiState.language]?.secondLastName}
                  inputRef={register({
                    required: Contents[uiState.language]?.require2LastName
                  })}
                  error={!!errors.secondLastName}
                  helperText={errors.secondLastName && errors.secondLastName.message}
                />
              </InputContainer>
              <InputContainer>
                <AutocompleteSelect
                  name="role"
                  placeholder={Contents[uiState.language]?.role}
                  error={!!errors.role}
                  errorText={errors.role && errors.role.message}
                  selectedValue={uiState.role}
                  defaultOptions={RoleOptions}
                  onSelect={onSelectChanged}
                />
              </InputContainer>
              <ActionButton
                type="submit"
                status="success"
                className={classes.RegisterButton}
                text={Contents[uiState.language]?.RegisterUser}
              >
                {uiState.isLoading && <CircularProgress size={24} color={colors.white} />}
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
