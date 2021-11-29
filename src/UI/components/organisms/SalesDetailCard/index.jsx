// @flow
import React from 'react';
import moment from 'moment-timezone';
import {
  Card,
  CardActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip
} from '@material-ui/core';
import EmptyPlaceholder from 'UI/components/templates/EmptyPlaceholder';
import { currencyFormatter } from 'UI/utils';
import {
  EmptyFeeAgreement,
  CloseIcon,
  PrintIcon,
  DownloadFileIcon,
  colors
} from 'UI/res';
import { DateFormats } from 'UI/constants/defaults';
import ListProductRow from 'UI/components/molecules/ListProductRow';
import {
  downloadSaleTicketPDF,
  sendToPrintSaleTicket
} from 'UI/utils/ticketGenerator';
import Contents from './strings';
import { useStyles } from './styles';

const language = localStorage.getItem('language');

type SummaryCardProps = {
  saleData: Object,
  onCloseModal: any => any
};

const SummaryCard = (props: SummaryCardProps) => {
  const {
    saleData: { sale = {}, detail: data },
    saleData,
    onCloseModal
  } = props;

  const {
    date,
    discount,
    idSale,
    iva: taxes,
    paymentMethod,
    received,
    subtotal,
    ticket,
    total
  } = sale;
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActions className={classes.buttonContainer}>
        <Tooltip title="Imprimir Ticket" placement="bottom">
          <IconButton
            size="medium"
            onClick={() =>
              !!data && sendToPrintSaleTicket(saleData, `${ticket}.pdf`)
            }
          >
            <PrintIcon fill={colors.black} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Descargar Ticket" placement="bottom">
          <IconButton
            size="medium"
            onClick={() =>
              !!data && downloadSaleTicketPDF(saleData, `${ticket}.pdf`)
            }
          >
            <DownloadFileIcon fill={colors.black} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cerrar" placement="bottom">
          <IconButton size="medium" onClick={onCloseModal}>
            <CloseIcon fill={colors.red} />
          </IconButton>
        </Tooltip>
      </CardActions>
      {data ? (
        <>
          <h1 className={classes.title}>{Contents[language].HeaderTitle}</h1>
          <List>
            <center>
              <div className={classes.List}>
                {data &&
                  data.map(each => {
                    return (
                      <Tooltip
                        placement="top"
                        arrow
                        title={<ListProductRow product={each} />}
                        classes={{ tooltip: classes.noMaxWidth }}
                      >
                        <ListItem divider className={classes.Item}>
                          <ListItemText
                            primary={
                              <>
                                <span className={classes.ScrollDescription}>
                                  {`${each?.quantity}: ${each?.productCode} ${each?.type} `}
                                </span>
                              </>
                            }
                          />
                          <ListItemText
                            secondary={
                              <span className={classes.ScrollCostDescription}>
                                {currencyFormatter(each?.salePrice) || '--'}
                              </span>
                            }
                          />
                        </ListItem>
                      </Tooltip>
                    );
                  })}
              </div>
            </center>
            <br />
            <center>
              <div className={classes.Resume}>
                {/* <ListItem divider className={classes.Content}>
              <ListItemText
                primary={<span className={classes.Description}>{Contents[language]?.Deposit}</span>}
              />
              <ListItemText
                secondary={
                  <span className={classes.CostDescription}>{currencyFormatter(deposit)}</span>
                }
              />
            </ListItem> */}
                <ListItem divider className={classes.Content}>
                  <ListItemText
                    primary={
                      <span className={classes.Description}>
                        {Contents[language]?.ticket}
                      </span>
                    }
                  />
                  <ListItemText
                    secondary={
                      <span className={classes.CostDescription}>
                        {ticket || '--'}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem divider className={classes.Content}>
                  <ListItemText
                    primary={
                      <span className={classes.Description}>
                        {Contents[language]?.idSale}
                      </span>
                    }
                  />
                  <ListItemText
                    secondary={
                      <span className={classes.CostDescription}>
                        {idSale || '--'}
                      </span>
                    }
                  />
                </ListItem>

                <ListItem divider className={classes.Content}>
                  <ListItemText
                    primary={
                      <span className={classes.Description}>
                        {Contents[language]?.date}
                      </span>
                    }
                  />
                  <ListItemText
                    secondary={
                      <span className={classes.CostDescription}>
                        {date
                          ? moment(date).format(
                              DateFormats.International.DayDate
                            )
                          : '--'}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem divider className={classes.Content}>
                  <ListItemText
                    primary={
                      <span className={classes.Description}>
                        {Contents[language]?.Subtotal}
                      </span>
                    }
                  />
                  <ListItemText
                    secondary={
                      <span className={classes.CostDescription}>
                        {subtotal ? currencyFormatter(subtotal) : '--'}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem divider className={classes.Content}>
                  <ListItemText
                    primary={
                      <span className={classes.Description}>
                        {Contents[language]?.Taxes}
                      </span>
                    }
                  />
                  <ListItemText
                    secondary={
                      <span className={classes.CostDescription}>
                        {taxes ? currencyFormatter(taxes) : '--'}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem divider className={classes.Content}>
                  <ListItemText
                    primary={
                      <span className={classes.Description}>
                        {Contents[language]?.discount}
                      </span>
                    }
                  />
                  <ListItemText
                    secondary={
                      <span className={classes.CostDescription}>
                        {discount
                          ? currencyFormatter(parseFloat(discount) * -1)
                          : '--'}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem divider className={classes.Content}>
                  <ListItemText
                    primary={
                      <span className={classes.Description}>
                        {Contents[language]?.Payment}
                      </span>
                    }
                  />
                  <ListItemText
                    secondary={
                      <span className={classes.CostDescription}>
                        {paymentMethod || '--'}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem divider className={classes.Content}>
                  <ListItemText
                    primary={
                      <span className={classes.Description}>
                        {Contents[language]?.Received}
                      </span>
                    }
                  />
                  <ListItemText
                    secondary={
                      <span className={classes.CostDescription}>
                        {received ? currencyFormatter(received) : '--'}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <span className={classes.Total}>
                        {Contents[language].Total}
                      </span>
                    }
                  />
                  <ListItemText
                    secondary={
                      <span className={classes.TotalCost}>
                        {total ? currencyFormatter(total) : '--'}
                      </span>
                    }
                  />
                </ListItem>
              </div>
            </center>
          </List>
        </>
      ) : (
        <EmptyPlaceholder
          title="Detalle de Venta Vacío "
          subtitle="Si cree que es un error contacte a soporte técnico."
        >
          <EmptyFeeAgreement fill={colors.white} />
        </EmptyPlaceholder>
      )}
    </Card>
  );
};

export default SummaryCard;
