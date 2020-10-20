// @flow
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import GlobalSearchbar from 'UI/components/molecules/GlobalSearchbar';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import ActionButton from 'UI/components/atoms/ActionButton';
import { WolfBackground, AddIcon, colors } from 'UI/components/molecules/ProductCard/node_modules/UI/res';
import { EntityRoutes } from 'routes/constants';
import { PageTitles } from 'UI/constants/defaults';
import { isNotificationAvailable, getNotificationToken } from 'services/FirebaseMessaging';

import API from 'services/API';
import { Endpoints } from 'UI/constants/endpoints';
import { useStyles, styles } from './styles';

const Home = ({ history }) => {
  const classes = useStyles();

  useEffect(() => {
    document.title = PageTitles.Home;
  });

  useEffect(() => {
    const saveNotificationToken = async () => {
      if (isNotificationAvailable) {
        const token = getNotificationToken();
        await API.post(Endpoints.NotificationRegistration, { token });
      }
    };

    saveNotificationToken();
  }, []);

  const handleActionClick = action => {
    history.push(action);
  };

  return (
    <>
      <WolfBackground fill={colors.wolfImage} className={classes.backgroundImg} />
      <ContentPageLayout>
        <div className={classes.root}>
          <Grid
            className={classes.container}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <TitleLabel
              customStyle={styles.mainTitle}
              fontSize={40}
              text="A search away from your goal"
            />
            <GlobalSearchbar />
          </Grid>
          <Grid
            className={classes.container}
            style={styles.gridContainer}
            container
            justify="center"
            alignItems="center"
          >
            <Grid
              className={classes.container}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <ActionButton
                style={styles.button}
                text="CANDIDATE"
                onClick={() => handleActionClick(EntityRoutes.CandidateCreate)}
              >
                <AddIcon {...styles.iconSize} />
              </ActionButton>
              <ActionButton
                style={styles.button}
                text="JOB ORDER"
                onClick={() => handleActionClick(EntityRoutes.JobOrderCreate)}
              >
                <AddIcon {...styles.iconSize} />
              </ActionButton>
              <ActionButton
                style={styles.button}
                text="COMPANY"
                onClick={() => handleActionClick(EntityRoutes.CompanyCreate)}
              >
                <AddIcon {...styles.iconSize} />
              </ActionButton>
            </Grid>
          </Grid>
        </div>
      </ContentPageLayout>
    </>
  );
};
export default withRouter(Home);
