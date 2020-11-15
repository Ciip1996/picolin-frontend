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

import { useStyles, styles } from './styles';

const Home = () => {
  const classes = useStyles();
  const user: User = getCurrentUser();
  // const data = [
  //   { title: '1 ROPON mini ariete445', content: '$111,200.00' },
  //   { title: '1 CALCETAS NIÑA BEIGE', content: '$28.6' },
  //   { title: '1 CALZADO NIÑA NACAR', content: '$119.5' },
  //   { title: '1 PAÑALEROS BEIGE', content: '$160.0' },
  //   { title: '1 CALCETAS NIÑA BEIGE', content: '$28.6' },
  //   { title: '1 CALCETAS NIÑA BEIGE', content: '$28.6' }
  // ];

  useEffect(() => {
    document.title = PageTitles.Home;
  });

  return (
    <>
      {/* <BackgroundGraphic fill={colors.backgroundGraphic} className={classes.backgroundImg} /> */}
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
            {/* <SalesDetailCard data={data} />
            <SalesSummary cash={123.0} card={245.23} /> */}
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
