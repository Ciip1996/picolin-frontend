// @flow
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
// import GlobalSearchbar from 'UI/components/molecules/GlobalSearchbar';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import { BackgroundGraphic, colors } from 'UI/res';
import { PageTitles } from 'UI/constants/defaults';
import { getCurrentUser } from 'services/Authentication';
import SummaryCard from 'UI/components/organisms/SummaryCard';

import { type User } from 'types/app';

import { useStyles, styles } from './styles';

const Home = () => {
  const classes = useStyles();
  const user: User = getCurrentUser();

  useEffect(() => {
    document.title = PageTitles.Home;
  });

  return (
    <>
      <BackgroundGraphic fill={colors.backgroundGraphic} className={classes.backgroundImg} />
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
              fontSize={47}
              text={`¡Bienvenido ${user?.userName || ''} al sistema Picolin Store!`}
            />
            <SummaryCard />
            {/* <GlobalSearchbar /> */}
          </Grid>
          {/* <Grid
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
                text="Inventario"
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
