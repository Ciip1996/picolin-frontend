// @flow
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import ActionButton from 'UI/components/atoms/ActionButton';
import { EntityRoutes } from 'routes/constants';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import { Error404, Error500, Error401, colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { PageTitles } from 'UI/constants/defaults';
import { useStyles } from './styles';

type ErrorPageProps = {
  error?: 500 | 401 | 404,
  history: any
};

const ErrorPage = ({ history, error }: ErrorPageProps) => {
  const classes = useStyles();

  useEffect(() => {
    document.title = PageTitles.NotFound;
  }, []);

  const handleGoBack = () => {
    history.goBack();
  };

  const handleGoHome = () => {
    history.push(EntityRoutes.Home);
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const errorType = {
    image: (
      <TitleLabel shadow text="Unkown ERROR" fontWeight={700} fontSize={120} color={colors.red} />
    ),
    title: "We don't know what's going on.",
    firstRow: 'Please come back later!',
    secondRow: '',
    buttonText: 'Go Back',
    action: handleGoBack
  };

  switch (error) {
    case 401:
      errorType.image = <Error401 />;
      errorType.title = 'Unauthorized access';
      errorType.firstRow = 'Sorry! You can’t go beyond this point.';
      errorType.secondRow = 'Please turn back.';
      errorType.buttonText = 'GO TO HOME';
      errorType.action = handleGoHome;
      break;
    case 404:
      errorType.image = <Error404 style={{ marginBottom: 75 }} />;
      errorType.title = 'There’s nothing here';
      errorType.firstRow = 'We couldn’t find the page you’re looking for.';
      errorType.secondRow = 'Let’s head back ';
      errorType.buttonText = 'Go Back';
      errorType.action = handleGoBack;
      break;
    case 500:
      errorType.image = <Error500 />;
      errorType.title = 'Internal Server Error';
      errorType.firstRow = 'Oops! We didn’t see that coming.';
      errorType.secondRow = 'We’re are working on fixing the problem as soon as possible!';
      errorType.buttonText = 'NOTIFY SUPPORT';
      errorType.action = handleRefreshPage;
      break;
    default:
      // any other problem will be the default
      break;
  }

  return (
    <ContentPageLayout>
      <Grid className={classes.wrapper}>
        {errorType.image}
        <TitleLabel shadow fontSize={48} fontWeight={700} text={errorType.title} />
        <Typography style={{ marginTop: 0, marginBottom: 0 }} component="div">
          <Box className={classes.text}>{errorType.firstRow}</Box>
          <Box className={classes.text}>
            {errorType.secondRow}
            {error === 404 && (
              <Button
                className={classes.text}
                style={{ textTransform: 'lowercase', marginBottom: 3 }}
                onClick={errorType.action}
                color="primary"
              >
                {errorType.buttonText}
              </Button>
            )}
          </Box>
        </Typography>
        {error !== 404 && (
          <ActionButton
            text={errorType.buttonText}
            style={{ marginTop: 64 }}
            onClick={errorType.action}
          />
        )}
      </Grid>
    </ContentPageLayout>
  );
};

ErrorPage.defaultProps = {
  error: 404
};

export default withRouter(ErrorPage);
