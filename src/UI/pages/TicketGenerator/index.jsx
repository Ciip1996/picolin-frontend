// @flow
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ContentPageLayout from 'UI/components/templates/ContentPageLayout';
import TitleLabel from 'UI/components/atoms/TitleLabel';
import { PageTitles } from 'UI/constants/defaults';
import { Endpoints } from 'UI/constants/endpoints';
import API from 'services/API';
import InputContainer from 'UI/components/atoms/InputContainer';
import TextBox from 'UI/components/atoms/TextBox';
import ActionButton from 'UI/components/atoms/ActionButton';

import { downloadTicketPDF, sendToPrintTicket } from 'UI/utils/ticketGenerator';
import { useStyles, styles } from './styles';

const TicketGenerator = () => {
  const classes = useStyles();
  // const [fileURL, setFileURL] = useState(null);

  const [data, setData] = useState();
  const [saleId, setSaleId] = useState(null);

  const getData = async idSale => {
    const response = await API.get(
      `${Endpoints.Sales}${Endpoints.GetSaleDetailsByIdSale}`.replace(':id', idSale)
    );
    if (response?.data && response?.data?.detail?.length > 0) {
      setData(response?.data);
    }
  };

  useEffect(() => {
    getData(saleId);
  }, [saleId]);

  useEffect(() => {
    document.title = PageTitles.TicketGenerator;
  }, []);

  const handleSaleIdChange = (name?: string, value: any) => {
    setSaleId(value);
    // const blob = !!data && getTicketBlob(data);
    // setFileURL(blob);
  };

  return (
    <>
      <ContentPageLayout>
        <div className={classes.root}>
          <Grid
            className={classes.container}
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <TitleLabel customStyle={styles.mainTitle} fontSize={47} text="Generador de Tickets" />
            <InputContainer flex="center">
              <TextBox
                name="idVenta"
                label="Id de Venta"
                inputType="number"
                placeholder="99 por ejemplo"
                error={!saleId}
                errorText={!saleId ? 'Primero debe escribir el id de la venta.' : undefined}
                onChange={handleSaleIdChange}
              />
              <ActionButton
                text="Descargar"
                variant="important"
                onClick={() => !!data && downloadTicketPDF(data, 'ticket.pdf')}
              />
              <ActionButton
                variant="important"
                text="Imprimir"
                onClick={() => !!data && sendToPrintTicket(data, 'ticket.pdf')}
              />
            </InputContainer>

            {/* <div id="pdfContainer" className={classes.pdfBox}>
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
            </div> */}
          </Grid>
        </div>
      </ContentPageLayout>
    </>
  );
};
export default withRouter(TicketGenerator);
