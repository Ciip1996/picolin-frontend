// @flow
import React from 'react';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Contents from './strings';
import { useStyles } from './styles';

const language = localStorage.getItem('language');

type SummaryCardProps = {
  saleData: Object,
  sale: Object,
  detail: Array<Object>
};

const SummaryCard = (props: SummaryCardProps) => {
  const { saleData } = props;
  const { sale = {}, detail: data } = saleData;
  const { total, subtotal, iva: taxes, discount, received, paymentMethod, deposit } = sale;
  if (sale) {
    debugger;
  }
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
                      primary={<span className={classes.ScrollDescription}>{each.title}</span>}
                    />
                    <ListItemText
                      secondary={
                        <span className={classes.ScrollCostDescription}>{each.content}</span>
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
            <ListItem divider className={classes.Content}>
              <ListItemText
                primary={<span className={classes.Description}>{Contents[language]?.Deposit}</span>}
              />
              <ListItemText
                secondary={<span className={classes.CostDescription}>{deposit}</span>}
              />
            </ListItem>
            <ListItem divider className={classes.Content}>
              <ListItemText
                primary={
                  <span className={classes.Description}>{Contents[language]?.Subtotal}</span>
                }
              />
              <ListItemText
                secondary={<span className={classes.CostDescription}>{subtotal}</span>}
              />
            </ListItem>
            <ListItem divider className={classes.Content}>
              <ListItemText
                primary={<span className={classes.Description}>{Contents[language]?.Taxes}</span>}
              />
              <ListItemText secondary={<span className={classes.CostDescription}>{taxes}</span>} />
            </ListItem>
            <ListItem divider className={classes.Content}>
              <ListItemText
                primary={
                  <span className={classes.Description}>{Contents[language]?.discount}</span>
                }
              />
              <ListItemText
                secondary={<span className={classes.CostDescription}>{discount}</span>}
              />
            </ListItem>
            <ListItem divider className={classes.Content}>
              <ListItemText
                primary={
                  <span className={classes.Description}>{Contents[language]?.paymentMethod}</span>
                }
              />
              <ListItemText
                secondary={<span className={classes.CostDescription}>{paymentMethod}</span>}
              />
            </ListItem>
            <ListItem divider className={classes.Content}>
              <ListItemText
                primary={
                  <span className={classes.Description}>{Contents[language]?.Received}</span>
                }
              />
              <ListItemText
                secondary={<span className={classes.CostDescription}>{received}</span>}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<span className={classes.Total}>{Contents[language].Total}</span>}
              />
              <ListItemText secondary={<span className={classes.TotalCost}>{total}</span>} />
            </ListItem>
          </div>
        </center>
      </List>
    </Card>
  );
};

export default SummaryCard;
