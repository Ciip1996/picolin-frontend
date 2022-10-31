// @flow
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import ActionButton from 'UI/components/atoms/ActionButton';
import { EntityRoutes } from 'routes/constants';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import { Error404, Error500, Error401, colors } from 'UI/res';
import { PageTitles } from 'UI/constants/defaults';
import { useLanguage } from 'UI/utils';
import { useStyles } from './styles';
import Contents from './strings';

type ErrorPageProps = {
  error?: 500 | 401 | 404,
  history: any
};

const ErrorPage = ({ history, error }: ErrorPageProps) => {
  const classes = useStyles();
  const language = useLanguage();
  const [errorType, setErrorType] = useState({});

  const handleGoBack = () => {
    history.goBack();
  };

  const handleGoHome = () => {
    history.push(EntityRoutes.Home);
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    document.title = language && PageTitles[language].NotFound;

    setErrorType({
      image: (
        <TitleLabel
          shadow
          text="Unkown ERROR"
          fontWeight={700}
          fontSize={120}
          color={colors.red}
        />
      ),
      title: Contents[language]?.errTitle,
      firstRow: Contents[language]?.errTitle2,
      secondRow: '',
      buttonText: Contents[language]?.txtbtn,
      action: handleGoBack
    });

    switch (error) {
      case 401:
        setErrorType({
          image: <Error401 />,
          title: Contents[language]?.err401title,
          firstRow: Contents[language]?.err401first,
          secondRow: Contents[language]?.err401second,
          buttonText: Contents[language]?.err401btn,
          action: handleGoHome
        });
        break;
      case 404:
        setErrorType({
          image: <Error404 style={{ marginBottom: 75 }} />,
          title: Contents[language]?.err404title,
          firstRow: Contents[language]?.err404first,
          secondRow: Contents[language]?.err404second,
          buttonText: Contents[language]?.err404btn,
          action: handleGoBack
        });
        break;
      case 500:
        setErrorType({
          image: <Error500 />,
          title: Contents[language]?.err500title,
          firstRow: Contents[language]?.err500first,
          secondRow: Contents[language]?.err500second,
          buttonText: Contents[language]?.err500btn,
          action: handleRefreshPage
        });
        break;
      default:
        // any other problem will be the default
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, language]);

  return (
    <ContentPageLayout>
      <Grid className={classes.wrapper}>
        {errorType.image}
        <TitleLabel
          shadow
          fontSize={48}
          fontWeight={700}
          text={errorType.title}
        />
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
