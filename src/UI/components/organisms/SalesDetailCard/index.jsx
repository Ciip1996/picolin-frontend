// @flow
import React from 'react';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { currencyFormatter } from 'UI/utils';
import Contents from './strings';
import { useStyles } from './styles';

const language = localStorage.getItem('language');

type SummaryCardProps = {
  saleData: Object
};

const SummaryCard = (props: SummaryCardProps) => {
  const {
    saleData: { sale = {}, detail: data }
  } = props;

  const { total, subtotal, iva: taxes, discount, received, paymentMethod } = sale;

  console.log(data);

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <h1 className={classes.title}>{Contents[language].HeaderTitle}</h1>
      <List component="nav">
        <center>
          <div className={classes.List}>
            {data &&
              data.map(each => {
                return (
                  <ListItem divider className={classes.Item}>
                    <ListItemText
                      primary={
                        <span className={classes.ScrollDescription}>
                          {`${each?.quantity} ${each?.type} ` || '--'}
                        </span>
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
                  <span className={classes.Description}>{Contents[language]?.Subtotal}</span>
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
                primary={<span className={classes.Description}>{Contents[language]?.Taxes}</span>}
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
                  <span className={classes.Description}>{Contents[language]?.discount}</span>
                }
              />
              <ListItemText
                secondary={
                  <span className={classes.CostDescription}>
                    {discount ? currencyFormatter(parseFloat(discount) * -1) : '--'}
                  </span>
                }
              />
            </ListItem>
            <ListItem divider className={classes.Content}>
              <ListItemText
                primary={<span className={classes.Description}>{Contents[language]?.Payment}</span>}
              />
              <ListItemText
                secondary={<span className={classes.CostDescription}>{paymentMethod || '--'}</span>}
              />
            </ListItem>
            <ListItem divider className={classes.Content}>
              <ListItemText
                primary={
                  <span className={classes.Description}>{Contents[language]?.Received}</span>
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
                primary={<span className={classes.Total}>{Contents[language].Total}</span>}
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
    </Card>
  );
};

export default SummaryCard;
