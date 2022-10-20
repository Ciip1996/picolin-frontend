// @flow
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import TitleLabel from 'UI/components/atoms/TitleLabel';
// import { BackgroundGraphic, colors } from 'UI/res';
import { PageTitles } from 'UI/constants/defaults';
import { getCurrentUser } from 'services/Authentication';
// import SalesDetailCard from 'UI/components/organisms/SalesDetailCard';
// import SalesSummary from 'UI/components/organisms/SalesSummary';
import { type User } from 'types/app';
import { useLanguage, useIsDemoEnvironment } from 'UI/utils';
import { useStyles, styles } from './styles';
import Contents from './strings';

const Home = () => {
  const classes = useStyles();
  const user: User = getCurrentUser();
  const wasReloaded = localStorage.getItem('reloaded');
  const language = useLanguage();
  const isDemo = useIsDemoEnvironment();

  useEffect(() => {
    document.title = language && PageTitles[language].Home;

    const forceRefreshingUIRestrictions = () => {
      // A page reloaded is needed the first time we login in order to refresh the UI components
      // with access for Admin / employees. Otherwise it wont refresh them.
      if (!wasReloaded) {
        localStorage.setItem('reloaded', 'true');
        window.location.reload();
      }
    };
    forceRefreshingUIRestrictions();
  }, [language, wasReloaded]);

  const titleLabel = wasReloaded
    ? `${Contents[language]?.welcomeFirst} ${user?.userName || ''} ${
        Contents[language]?.welcomeSecond
      }`
    : Contents[language]?.loading;
  return (
    <>
      {/* <BackgroundGraphic fill={colors.backgroundGraphic} className={classes.backgroundImg} /> */}
      <ContentPageLayout>
        <div className={classes.root}>
          <Grid
            className={classes.container}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <TitleLabel
              customStyle={styles.mainTitle}
              fontSize={47}
              text={titleLabel}
            />
            {isDemo && <p>{wasReloaded ? Contents[language]?.credits : ''}</p>}
            <br />
            <TitleLabel
              fontSize={14}
              text={wasReloaded ? Contents[language]?.translationCaption : ''}
            />
          </Grid>
          {/* <Grid
            className={classes.container}
            style={styles.gridContainer}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              className={classes.container}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <ActionButton
                style={styles.button}
                text="Nueva Venta"
                onClick={() => handleActionClick(EntityRoutes.CandidateCreate)}
              >
                <AddIcon {...styles.iconSize} />
              </ActionButton>
              <ActionButton
                style={styles.button}
                text="Nuevo Producto"
                onClick={() => handleActionClick(EntityRoutes.JobOrderCreate)}
              >
                <AddIcon {...styles.iconSize} />
              </ActionButton>
              <ActionButton
                style={styles.button}
                text="Inventarios"
                onClick={() => handleActionClick(EntityRoutes.CompanyCreate)}
              >
                <AddIcon {...styles.iconSize} />
              </ActionButton>
            </Grid>
          </Grid> */}
        </div>
      </ContentPageLayout>
    </>
  );
};
export default withRouter(Home);
