// @flow
import React from 'react';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import ListItemText from '@material-ui/core/ListItemText';
import { currencyFormatter } from 'UI/utils';
import { Tooltip } from '@material-ui/core';
import Contents from './string';
import { useStyles } from './styles';

type SalesSummaryProps = {
  cash: number | null,
  card: number | null
};
const language = localStorage.getItem('language');

const SalesSummary = (props: SalesSummaryProps) => {
  const { cash, card } = props;

  const classes = useStyles();
  return (
    <Card className={classes.content}>
      <ListItem>
        <ListItemText
          primary={<span className={classes.Description}>{Contents[language]?.cash}</span>}
        />
        <ListItemText
          secondary={
            <Tooltip title={cash ? currencyFormatter(cash) : '...'} placement="right">
              <Chip label={cash ? currencyFormatter(cash) : '...'} className={classes.cash} />
            </Tooltip>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={<span className={classes.Description}>{Contents[language]?.card}</span>}
        />
        <ListItemText
          secondary={
            <Tooltip title={card ? currencyFormatter(card) : '...'} placement="right">
              <Chip label={card ? currencyFormatter(card) : '...'} className={classes.card} />
            </Tooltip>
          }
        />
      </ListItem>
    </Card>
  );
};

export default SalesSummary;
