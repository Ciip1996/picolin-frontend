// @flow
import React, { useEffect, useState } from 'react';
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
import { getTicketBlob, downloadTicketPDF, sendToPrintTicket } from 'UI/utils/ticketGenerator';
import { useStyles, styles } from './styles';

const getSaleDetailed = {
  sale: {
    total: 500,
    subtotal: 600,
    iva: 0,
    discount: 100,
    received: 1000,
    paymentMethod: 'Tarjeta',
    deposit: 6
  },
  detail: [
    {
      type: 'Ropón',
      characteristic: 'Mini',
      productCode: 'PROROMA202',
      color: 'Rosa',
      salePrice: 300,
      quantity: 1,
      combo: null
    },
    {
      type: 'Ropón',
      characteristic: 'Mini',
      productCode: 'PROROMA202',
      color: 'Rosa',
      salePrice: 300,
      quantity: 1,
      combo: null
    }
  ]
};

const Home = () => {
  const classes = useStyles();
  const user: User = getCurrentUser();
  const wasReloaded = localStorage.getItem('reloaded');
  const [fileURL, setFileURL] = useState(null);

  useEffect(() => {
    document.title = PageTitles.Home;
    const forceRefreshingUIRestrictions = () => {
      // A page reloaded is needed the first time we login in order to refresh the UI components
      // with access for Admin / employees. Otherwise it wont refresh them.
      if (!wasReloaded) {
        localStorage.setItem('reloaded', 'true');
        window.location.reload();
      }
    };
    forceRefreshingUIRestrictions();
    const blob = getTicketBlob(getSaleDetailed);
    setFileURL(blob);
  }, [wasReloaded]);

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
              text={
                wasReloaded
                  ? `¡Bienvenido ${user?.userName || ''} al sistema Picolin Store!`
                  : 'Cargando permisos porfavor espere...'
              }
            />
            <input
              type="button"
              value="Download Ticket"
              onClick={() => downloadTicketPDF(getSaleDetailed, 'ticket.pdf')}
            />
            <input
              type="button"
              value="print"
              onClick={() => sendToPrintTicket(getSaleDetailed, 'ticket.pdf')}
            />
            {/* <GlobalSearchbar /> */}
            <div id="pdfContainer" className={classes.pdfBox}>
              {fileURL && (
                <iframe
                  type="application/pdf"
                  allowFullScreen
                  id="inlineFrameExample"
                  title="Inline Frame Example"
                  width="100%"
                  height="100%"
                  src={`${fileURL}#toolbar=0&navpanes=0`}
                />
              )}
            </div>
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
