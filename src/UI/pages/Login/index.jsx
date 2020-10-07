// @flow
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { showAlert } from 'actions/app';

import CircularProgress from '@material-ui/core/CircularProgress';

import LoginButton from 'UI/components/atoms/LoginButton';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import Text from 'UI/components/atoms/Text';

import { getErrorMessage } from 'UI/utils';
import { EntityRoutes } from 'routes/constants';
import { Endpoints } from 'UI/constants/endpoints';
import { PageTitles } from 'UI/constants/defaults';

import { getRedirectPage } from 'services/Authentication';
import API from 'services/API';

import { WolfBackground, colors, GpacFullLogo, DotsPattern } from 'UI/res';
import { useStyles, styles } from './styles';

const loginConfig = {
  clientId: `${(window.GPAC_ENV && window.GPAC_ENV.CLIENT_ID) || process.env.REACT_APP_CLIENT_ID}`,
  tenantUrl: `${process.env.REACT_APP_MICROSOFT_URL}${process.env.REACT_APP_TENANT_URL}`,
  debug: false,
  theme: 'dark'
};

type LoginProps = {
  onShowAlert: any => void,
  history: any
};

const Login = (props: LoginProps) => {
  const { onShowAlert, history } = props;

  useEffect(() => {
    document.title = PageTitles.Login;
  });

  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  const authHandler = (err, data) => {
    setIsLoading(true);
    if (err) {
      onShowAlert({
        severity: 'error',
        title: 'Login',
        body: err.message
      });
      setIsLoading(false);
    } else {
      const { accessToken } = data.authResponseWithAccessToken;
      signin(accessToken);
    }
  };

  const signin = async accessToken => {
    try {
      const response = await API.post(Endpoints.Users, {
        access_token: accessToken
      });

      localStorage.setItem('access', JSON.stringify(response.data.token));

      API.defaults.headers.Authorization = `Bearer ${response.data.token.token}`;

      setIsLoading(false);

      const redirectPage = getRedirectPage();

      history.push(redirectPage || EntityRoutes.Home);
    } catch (error) {
      setIsLoading(false);
      onShowAlert({
        severity: 'error',
        title: 'Login',
        body: getErrorMessage(error)
      });
    }
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <DotsPattern
            width="20vh"
            fill={colors.red}
            style={styles.pattern1}
            className={classes.pattern}
          />
          <DotsPattern
            width="20vh"
            fill={colors.red}
            style={styles.pattern2}
            className={classes.pattern}
          />
          <GpacFullLogo style={{ paddingTop: '10vh' }} width="50vh" />
          <div className={classes.label}>
            <TitleLabel
              fontSize={36}
              text="Welcome to FortPac, your new partner to keep growing people and companies."
            />
          </div>
          <Text
            variant="body2"
            fontSize={20}
            text="Please, log in with your Microsoft account by clicking the button below"
          />
          <center style={{ paddingBottom: '10vh' }}>
            {!isLoading && (
              <LoginButton
                clientId={loginConfig.clientId}
                tenantUrl={loginConfig.tenantUrl}
                debug={loginConfig.debug}
                authCallback={authHandler}
                theme={loginConfig.theme}
              />
            )}
            {isLoading && <CircularProgress />}
          </center>
        </div>
      </div>
      <WolfBackground fill={colors.wolfImage} className={classes.backgroundImg} />
    </>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onShowAlert: alert => dispatch(showAlert(alert))
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Login));
